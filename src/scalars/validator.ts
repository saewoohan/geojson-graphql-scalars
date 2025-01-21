import { GeoJSON, Geometry } from 'geojson';
import { GeoJSONTypes } from '../types';

/**
 * Validates an array of coordinates with a specific depth and linear ring rules.
 * @param coordinates The coordinates to validate.
 * @param depth The expected nesting depth of the coordinates.
 * @param minCount Minimum number of elements required at the current depth.
 * @param isLinearRing Whether to validate as a linear ring (closed polygon).
 * @returns true if valid, false otherwise.
 */
const validateCoordinates = (
  coordinates: unknown,
  depth: number,
  minCount: number = 0,
  isLinearRing: boolean = false
): boolean => {
  if (!Array.isArray(coordinates)) {
    return false;
  }

  if (depth === 0) {
    return (
      coordinates.length >= 2 &&
      coordinates.every((value) => typeof value === 'number')
    );
  }

  if (coordinates.length < minCount) {
    return false;
  }

  // Handle linear ring validation
  if (depth === 1 && isLinearRing) {
    // Ensure the first and last points are identical
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];

    if (
      !Array.isArray(first) ||
      !Array.isArray(last) ||
      first.length !== last.length ||
      !first.every((val, idx) => val === last[idx])
    ) {
      return false;
    }

    if (coordinates.length < 4) {
      return false;
    }
  }

  // Recursively validate nested coordinates
  return coordinates.every((nested) =>
    validateCoordinates(nested, depth - 1, minCount, isLinearRing)
  );
};

/**
 * Validates the structure of a GeoJSON object based on its type.
 * @param type The GeoJSON type.
 * @param coordinates The coordinates of the GeoJSON object.
 * @param geometries The geometries for GeometryCollection types.
 * @param geometry The geometry for Feature types.
 * @param features The features for FeatureCollection types.
 */
const validateTypeStructure = ({
  type,
  coordinates,
  geometries,
  geometry,
  features,
}: {
  type: Geometry['type'] | keyof typeof GeoJSONTypes;
  coordinates?: unknown;
  geometries?: Geometry[];
  geometry?: Geometry;
  features?: GeoJSON[];
}): void => {
  switch (type) {
    case GeoJSONTypes.Point:
      if (!validateCoordinates(coordinates, 0)) {
        throw new Error('Point must have coordinates as [x, y] or [x, y, z].');
      }
      break;
    case GeoJSONTypes.MultiPoint:
      if (!validateCoordinates(coordinates, 1, 1)) {
        throw new Error(
          'MultiPoint must have coordinates as an array of [x, y] or [x, y, z].'
        );
      }
      break;
    case GeoJSONTypes.LineString:
      if (!validateCoordinates(coordinates, 1, 2)) {
        throw new Error(
          'LineString must have coordinates as an array of two or more [x, y].'
        );
      }
      break;
    case GeoJSONTypes.MultiLineString:
      if (!validateCoordinates(coordinates, 2, 1)) {
        throw new Error(
          'MultiLineString must have coordinates as an array of LineString coordinate arrays.'
        );
      }
      break;
    case GeoJSONTypes.Polygon:
      if (!validateCoordinates(coordinates, 2, 1)) {
        throw new Error(
          'Polygon must have coordinates as an array of linear rings.'
        );
      }

      // Validate each linear ring
      (coordinates as unknown[]).forEach((ring) => {
        if (!validateCoordinates(ring, 1, 4, true)) {
          throw new Error(
            'Each linear ring in a Polygon must have at least four positions and must be closed.'
          );
        }
      });
      break;

    case GeoJSONTypes.MultiPolygon:
      if (!validateCoordinates(coordinates, 3, 1)) {
        throw new Error(
          'MultiPolygon must have coordinates as an array of Polygon coordinate arrays.'
        );
      }

      // Validate each Polygon in the MultiPolygon
      (coordinates as unknown[]).forEach((polygon) => {
        if (!validateCoordinates(polygon, 2, 1)) {
          throw new Error(
            'Each Polygon in a MultiPolygon must have coordinates as an array of linear rings.'
          );
        }

        (polygon as unknown[]).forEach((ring) => {
          if (!validateCoordinates(ring, 1, 4, true)) {
            throw new Error(
              'Each linear ring in a Polygon must have at least four positions and must be closed.'
            );
          }
        });
      });
      break;
    case GeoJSONTypes.GeometryCollection:
      if (!Array.isArray(geometries)) {
        throw new Error(
          "GeometryCollection must include a 'geometries' field with an array."
        );
      }
      geometries.forEach(validateGeoJSON);
      break;
    case GeoJSONTypes.Feature:
      if (!geometry) {
        throw new Error("Feature must include a 'geometry' field.");
      }
      validateGeoJSON(geometry);
      break;
    case GeoJSONTypes.FeatureCollection:
      if (!Array.isArray(features)) {
        throw new Error(
          "FeatureCollection must include a 'features' field with an array."
        );
      }
      features.forEach(validateGeoJSON);
      break;
    default:
      throw new Error(`Unsupported GeoJSON type: ${type}`);
  }
};

/**
 * Validates a GeoJSON object.
 * @param value The GeoJSON object to validate.
 * @returns The validated GeoJSON object.
 */
export const validateGeoJSON = (value: unknown): GeoJSON => {
  if (!value || typeof value !== 'object') {
    throw new Error('GeoJSON must be an object.');
  }

  const geojson = value as Partial<GeoJSON>;
  const { type } = geojson;

  // Ensure type is valid
  if (!type || !(type in GeoJSONTypes)) {
    throw new Error(
      `Invalid GeoJSON type: ${type}. Allowed types are ${Object.values(
        GeoJSONTypes
      ).join(', ')}.`
    );
  }

  // Validate based on type
  if (type === GeoJSONTypes.Feature) {
    if (!('geometry' in geojson) || !geojson.geometry) {
      throw new Error("Feature must include a 'geometry' field.");
    }
    validateTypeStructure({ type, geometry: geojson.geometry });
  } else if (type === GeoJSONTypes.FeatureCollection) {
    if (!('features' in geojson) || !geojson.features) {
      throw new Error("FeatureCollection must include a 'features' field.");
    }
    validateTypeStructure({ type, features: geojson.features });
  } else if (type === GeoJSONTypes.GeometryCollection) {
    if (!('geometries' in geojson) || !geojson.geometries) {
      throw new Error("GeometryCollection must include a 'geometries' field.");
    }
    validateTypeStructure({ type, geometries: geojson.geometries });
  } else {
    if (!('coordinates' in geojson) || !geojson.coordinates) {
      throw new Error(`${type} must include a 'coordinates' field.`);
    }
    validateTypeStructure({
      type: type as Geometry['type'],
      coordinates: geojson.coordinates,
    });
  }

  return value as GeoJSON;
};
