import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import { validateGeoJSON } from './validator';
import { GeoJSON } from 'geojson';

/**
 * Creates a GraphQL scalar type for a specific GeoJSON type.
 * @param expectedType The GeoJSON type to validate.
 */
const createGeoJSONScalar = (expectedType: string): GraphQLScalarType => {
  return new GraphQLScalarType({
    name: expectedType,
    description: `A GeoJSON ${expectedType} object as defined by the GeoJSON format.`,
    serialize(value: unknown): GeoJSON {
      const geojson = validateGeoJSON(value);
      if (geojson.type !== expectedType) {
        throw new Error(
          `Expected GeoJSON type to be '${expectedType}', but got '${geojson.type}'.`
        );
      }
      return geojson;
    },
    parseValue(value: unknown): GeoJSON {
      const geojson = validateGeoJSON(value);
      if (geojson.type !== expectedType) {
        throw new Error(
          `Expected GeoJSON type to be '${expectedType}', but got '${geojson.type}'.`
        );
      }
      return geojson;
    },
    parseLiteral(ast: ValueNode): GeoJSON {
      if (ast.kind !== Kind.OBJECT) {
        throw new Error(`GeoJSON ${expectedType} must be an object.`);
      }

      const value: Record<string, any> = {};
      ast.fields.forEach((field) => {
        value[field.name.value] = (field.value as any).value;
      });

      const geojson = validateGeoJSON(value);
      if (geojson.type !== expectedType) {
        throw new Error(
          `Expected GeoJSON type to be '${expectedType}', but got '${geojson.type}'.`
        );
      }
      return geojson;
    },
  });
};

export const PointScalar = createGeoJSONScalar('Point');
export const LineStringScalar = createGeoJSONScalar('LineString');
export const PolygonScalar = createGeoJSONScalar('Polygon');
export const MultiPointScalar = createGeoJSONScalar('MultiPoint');
export const MultiLineStringScalar = createGeoJSONScalar('MultiLineString');
export const MultiPolygonScalar = createGeoJSONScalar('MultiPolygon');
export const GeometryCollectionScalar =
  createGeoJSONScalar('GeometryCollection');
export const Feature = createGeoJSONScalar('Feature');
export const FeatureCollection = createGeoJSONScalar('FeatureCollection');
