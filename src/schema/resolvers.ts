import {
  PointScalar,
  LineStringScalar,
  PolygonScalar,
  MultiPointScalar,
  MultiLineStringScalar,
  MultiPolygonScalar,
  GeometryCollectionScalar,
  Feature,
  FeatureCollection,
} from '../scalars/geojson';

export const resolvers = {
  Point: PointScalar,
  LineString: LineStringScalar,
  Polygon: PolygonScalar,
  MultiPoint: MultiPointScalar,
  MultiLineString: MultiLineStringScalar,
  MultiPolygon: MultiPolygonScalar,
  GeometryCollection: GeometryCollectionScalar,
  Feature: Feature,
  FeatureCollection: FeatureCollection,
};
