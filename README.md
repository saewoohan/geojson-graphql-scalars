# GraphQL GeoJSON Scalars

`graphql-geojson-scalars` provides custom GraphQL scalar types for working seamlessly with GeoJSON objects, ensuring they comply with the [RFC 7946 specification](https://tools.ietf.org/html/rfc7946). This library simplifies validation and handling of GeoJSON in GraphQL queries and mutations.

## Installation

```bash
npm install graphql-geojson-scalars
```

or with Yarn:

```bash
yarn add graphql-geojson-scalars
```

### Features

- **Full GeoJSON Support:**
  Includes scalars for all GeoJSON types, such as Point, LineString, Polygon, and more.
- **Robust Validation:**
  Automatically validates GeoJSON objects to ensure compliance with the RFC 7946 format.

- **Effortless Integration:**
  Easily add GeoJSON scalars to your GraphQL schema for enhanced functionality.

## Usage

### Basic Setup

Integrate the scalars into your GraphQL schema.

#### Type Definitions

```graphql
scalar Point
scalar LineString
scalar Polygon
scalar MultiPoint
scalar MultiLineString
scalar MultiPolygon
scalar GeometryCollection
scalar Feature
scalar FeatureCollection
```

#### Resolvers

```javascript
import {
  PointScalar,
  LineStringScalar,
  PolygonScalar,
  MultiPointScalar,
  MultiLineStringScalar,
  MultiPolygonScalar,
  GeometryCollectionScalar,
  FeatureScalar,
  FeatureCollectionScalar,
} from 'graphql-geojson-scalars';

export const resolvers = {
  Point: PointScalar,
  LineString: LineStringScalar,
  Polygon: PolygonScalar,
  MultiPoint: MultiPointScalar,
  MultiLineString: MultiLineStringScalar,
  MultiPolygon: MultiPolygonScalar,
  GeometryCollection: GeometryCollectionScalar,
  Feature: FeatureScalar,
  FeatureCollection: FeatureCollectionScalar,
};
```

#### Schema Example

```javascript
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
```

### Server Examples

```bash
yarn dev-apollo
```

or

```bash
yarn dev-yoga
```

or

```bash
yarn dev-graphql
```

Examples of server implementation is available here: [examples](examples/)

### Example Usage

#### Query Example

To fetch a GeoJSON `Point`, you can use the following query:

```graphql
query {
  examplePoint
}
```

#### Response

```json
{
  "data": {
    "examplePoint": {
      "type": "Point",
      "coordinates": [125.6, 10.1]
    }
  }
}
```

### Validation Rules

The library validates each GeoJSON type based on the following rules:

| **GeoJSON Type**       | **Validation Criteria**                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Point**              | `coordinates` must be `[x, y]` or `[x, y, z]`.                                                                              |
| **MultiPoint**         | `coordinates` must be an array of `[x, y]` or `[x, y, z]`.                                                                  |
| **LineString**         | `coordinates` must include at least two `[x, y]` points.                                                                    |
| **MultiLineString**    | `coordinates` must be an array of `LineString` coordinate arrays.                                                           |
| **Polygon**            | `coordinates` must be an array of linear rings, each with at least four positions and closed (first and last points match). |
| **MultiPolygon**       | `coordinates` must be an array of `Polygon` coordinate arrays.                                                              |
| **GeometryCollection** | Must include a `geometries` field containing an array of valid GeoJSON geometries.                                          |
| **Feature**            | Must include a `geometry` field with a valid GeoJSON geometry.                                                              |
| **FeatureCollection**  | Must include a `features` field with an array of valid `Feature` objects.                                                   |
