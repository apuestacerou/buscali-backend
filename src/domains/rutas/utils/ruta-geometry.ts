const EARTH_RADIUS_M = 6371000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Distancia en metros entre dos puntos WGS84. */
export function haversineM(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Distancia mínima del punto al segmento (aprox. plana en lat/lng; válida para tramos urbanos). */
export function distancePointToSegmentM(
  lat: number,
  lng: number,
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const len2 = dLat * dLat + dLng * dLng;
  const t =
    len2 < 1e-18
      ? 0
      : ((lat - lat1) * dLat + (lng - lng1) * dLng) / len2;
  const tt = Math.max(0, Math.min(1, t));
  const clat = lat1 + tt * dLat;
  const clng = lng1 + tt * dLng;
  return haversineM(lat, lng, clat, clng);
}

/** `coords` en formato GeoJSON LineString: [lng, lat][]. */
export function minDistanceToPolylineM(
  lat: number,
  lng: number,
  coords: [number, number][],
): number {
  if (coords.length < 2) return Number.POSITIVE_INFINITY;
  let min = Number.POSITIVE_INFINITY;
  for (let i = 0; i < coords.length - 1; i++) {
    const [lng1, lat1] = coords[i];
    const [lng2, lat2] = coords[i + 1];
    const d = distancePointToSegmentM(lat, lng, lat1, lng1, lat2, lng2);
    if (d < min) min = d;
  }
  return min;
}

/**
 * Punto del polilínea más cercano al punto dado (proyección ortogonal por tramo, distancia Haversine).
 * Sirve como “parada” lógica cuando no hay tabla de paradas discretas.
 */
export function closestPointOnPolylineM(
  lat: number,
  lng: number,
  coords: [number, number][],
): { latitud: number; longitud: number; distancia_m: number } | null {
  if (coords.length < 2) return null;
  let bestDist = Number.POSITIVE_INFINITY;
  let bestLat = lat;
  let bestLng = lng;
  for (let i = 0; i < coords.length - 1; i++) {
    const [lng1, lat1] = coords[i];
    const [lng2, lat2] = coords[i + 1];
    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;
    const len2 = dLat * dLat + dLng * dLng;
    const t =
      len2 < 1e-18
        ? 0
        : ((lat - lat1) * dLat + (lng - lng1) * dLng) / len2;
    const tt = Math.max(0, Math.min(1, t));
    const clat = lat1 + tt * dLat;
    const clng = lng1 + tt * dLng;
    const dist = haversineM(lat, lng, clat, clng);
    if (dist < bestDist) {
      bestDist = dist;
      bestLat = clat;
      bestLng = clng;
    }
  }
  return {
    latitud: bestLat,
    longitud: bestLng,
    distancia_m: Math.round(bestDist),
  };
}

/** Normaliza `coordenadas` desde PostGIS/Sequelize a pares [lng, lat]. */
export function parseLineStringCoords(
  coordenadas: unknown,
): [number, number][] | null {
  if (!coordenadas) return null;
  if (typeof coordenadas === 'object' && coordenadas !== null) {
    const c = (coordenadas as { type?: string; coordinates?: unknown })
      .coordinates;
    if (Array.isArray(c) && c.length >= 2) {
      return c as [number, number][];
    }
  }
  if (typeof coordenadas === 'string') {
    try {
      const o = JSON.parse(coordenadas) as {
        type?: string;
        coordinates?: [number, number][];
      };
      if (o?.coordinates && Array.isArray(o.coordinates) && o.coordinates.length >= 2) {
        return o.coordinates;
      }
    } catch {
      return null;
    }
  }
  return null;
}
