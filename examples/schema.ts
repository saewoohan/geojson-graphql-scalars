import { makeExecutableSchema } from '@graphql-tools/schema';
import gql from 'graphql-tag';
import {
  typeDefs as geojsonTypedefs,
  resolvers as geojsonResolvers,
  GeoJSONTypes,
} from '../src';

const typeDefs = gql`
  type Query {
    examplePoint: Point
    exampleLineString: LineString
    examplePolygon: Polygon
    exampleMultiPoint: MultiPoint
    exampleMultiLineString: MultiLineString
    exampleMultiPolygon: MultiPolygon
    exampleGeometryCollection: GeometryCollection
    exampleFeature: Feature
    exampleFeatureCollection: FeatureCollection
  }
`;

const resolvers = {
  Query: {
    examplePoint: () => ({
      type: GeoJSONTypes.Point,
      coordinates: [125.6, 10.1],
    }),
    exampleLineString: () => ({
      type: GeoJSONTypes.LineString,
      coordinates: [
        [125.6, 10.1],
        [126.0, 10.2],
      ],
    }),
    examplePolygon: () => ({
      type: GeoJSONTypes.Polygon,
      coordinates: [
        [
          [125.6, 10.1],
          [126.0, 10.2],
          [127.0, 11.0],
          [125.6, 10.1],
        ],
      ],
    }),
    exampleMultiPoint: () => ({
      type: GeoJSONTypes.MultiPoint,
      coordinates: [
        [125.6, 10.1],
        [126.0, 10.2],
      ],
    }),
    exampleMultiLineString: () => ({
      type: GeoJSONTypes.MultiLineString,
      coordinates: [
        [
          [125.6, 10.1],
          [126.0, 10.2],
        ],
        [
          [127.0, 11.0],
          [128.0, 12.0],
        ],
      ],
    }),
    exampleMultiPolygon: () => ({
      type: GeoJSONTypes.MultiPolygon,
      coordinates: [
        [
          [
            [125.6, 10.1],
            [126.0, 10.2],
            [127.0, 11.0],
            [125.6, 10.1],
          ],
        ],
      ],
    }),
    exampleGeometryCollection: () => ({
      type: GeoJSONTypes.GeometryCollection,
      geometries: [
        { type: GeoJSONTypes.Point, coordinates: [125.6, 10.1] },
        {
          type: GeoJSONTypes.LineString,
          coordinates: [
            [125.6, 10.1],
            [126.0, 10.2],
          ],
        },
      ],
    }),
    exampleFeature: () => ({
      type: GeoJSONTypes.Feature,
      geometry: {
        type: GeoJSONTypes.Point,
        coordinates: [125.6, 10.1],
      },
    }),
    exampleFeatureCollection: () => ({
      type: GeoJSONTypes.FeatureCollection,
      features: [
        {
          type: GeoJSONTypes.Feature,
          geometry: {
            type: GeoJSONTypes.Point,
            coordinates: [125.6, 10.1],
          },
        },
      ],
    }),
  },
};

export const schema = makeExecutableSchema({
  typeDefs: [geojsonTypedefs, typeDefs],
  resolvers: {
    ...geojsonResolvers,
    ...resolvers,
  },
});
