export default async function handler(req, res) {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: "Missing address" });

  try {
    // Geocode (Esri World Geocoder, unauthenticated)
    const geocodeUrl =
      "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates" +
      "?f=json&maxLocations=1&category=Address&countryCode=USA&outSR=2229&outFields=Match_addr" +
      "&SingleLine=" + encodeURIComponent(address);

    const geoResp = await fetch(geocodeUrl);
    const geoData = await geoResp.json();
    const cand = geoData.candidates?.[0];

    if (!cand || (cand.score ?? 0) < 90) {
      return res.status(422).json({ error: "Low-confidence geocode match" });
    }

    const { x, y } = cand.location;

    // Query a MapServer layer by point-in-polygon
    async function queryLayer(layerId, outFields) {
      const base =
        `https://gisportal.santabarbaraca.gov/server1/rest/services/CitySantaBarbara/MapServer/${layerId}/query`;
      const params =
        "?f=json&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&inSR=2229" +
        "&returnGeometry=false&outFields=" + encodeURIComponent(outFields) +
        "&geometry=" + encodeURIComponent(JSON.stringify({ x, y, spatialReference: { wkid: 2229 } }));
      const r = await fetch(base + params);
      const j = await r.json();
      return j.features?.[0]?.attributes ?? null;
    }

    // Hit test: true if any feature contains point
    async function hit(layerId) {
      const base =
        `https://gisportal.santabarbaraca.gov/server1/rest/services/CitySantaBarbara/MapServer/${layerId}/query`;
      const params =
        "?f=json&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&inSR=2229" +
        "&returnGeometry=false&outFields=OBJECTID" +
        "&geometry=" + encodeURIComponent(JSON.stringify({ x, y, spatialReference: { wkid: 2229 } }));
      const r = await fetch(base + params);
      const j = await r.json();
      return Array.isArray(j.features) && j.features.length > 0;
    }

    // Core parcel + zoning
    const parcel = await queryLayer(8, "APN,Situs1,Acreage,Shape.STArea()");
    const zoning = await queryLayer(256, "ZoneOther,Zone_Descr,OverlayZone");

    if (!parcel || !zoning) {
      return res.status(404).json({ error: "Parcel or zoning not found" });
    }

    const lotSqFt =
      typeof parcel["Shape.STArea()"] === "number"
        ? parcel["Shape.STArea()"]
        : parcel.Acreage ? parcel.Acreage * 43560 : null;

    const overlays =
      zoning.OverlayZone?.split(/[;,]/).map(s => s.trim()).filter(Boolean) ?? [];

    // Clean boolean flags (City of Santa Barbara)
    const [
      coastal_zone,
      high_fire_hazard_area,
      fema_flood_zone,
      floodway,
      tsunami_cgs_2021,
      design_district,
      historic_landmark_district,
      bluff_edge_50ft_buffer
    ] = await Promise.all([
      hit(93),   // Coastal Zone Boundary
      hit(37),   // High Fire Hazard Areas
      hit(266),  // FEMA Flood 2023
      hit(231),  // Floodway
      hit(29),   // Tsunami CGS 2021
      hit(247),  // Design Districts
      hit(277),  // Historic & Landmark Districts
      hit(223)   // Bluff Edge 50ft Buffer
    ]);

    res.json({
      jurisdiction: "City of Santa Barbara",
      address: cand.address,
      apn: parcel.APN ?? null,
      lot_sqft: lotSqFt ? Math.round(lotSqFt) : null,
      zoning: {
        code: zoning.ZoneOther ?? null,
        description: zoning.Zone_Descr ?? null,
        overlays
      },
      gis_flags: {
        coastal_zone,
        high_fire_hazard_area,
        fema_flood_zone,
        floodway,
        tsunami_cgs_2021,
        design_district,
        historic_landmark_district,
        bluff_edge_50ft_buffer
      }
    });
  } catch (e) {
    res.status(500).json({ error: "Server error", detail: e.message });
  }
}
