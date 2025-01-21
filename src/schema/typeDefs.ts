import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar Point
  scalar LineString
  scalar Polygon
  scalar MultiPoint
  scalar MultiLineString
  scalar MultiPolygon
  scalar GeometryCollection
  scalar Feature
  scalar FeatureCollection
`;
