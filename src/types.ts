/**
 * GeoJSON types according to RFC 7946.
 */
export const GeoJSONTypes = {
  Point: 'Point',
  LineString: 'LineString',
  Polygon: 'Polygon',
  MultiPoint: 'MultiPoint',
  MultiLineString: 'MultiLineString',
  MultiPolygon: 'MultiPolygon',
  GeometryCollection: 'GeometryCollection',
  Feature: 'Feature',
  FeatureCollection: 'FeatureCollection',
} as const;
