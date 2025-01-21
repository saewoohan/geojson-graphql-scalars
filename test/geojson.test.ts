import {
  PointScalar,
  LineStringScalar,
  PolygonScalar,
  MultiPointScalar,
  MultiLineStringScalar,
  MultiPolygonScalar,
  GeometryCollectionScalar,
} from '../src/scalars/geojson';
import { validateGeoJSON } from '../src/scalars/validator';

describe('GeoJSON Scalars', () => {
  it('validates a valid Point', () => {
    const point = {
      type: 'Point',
      coordinates: [100.0, 0.0],
    };
    expect(PointScalar.parseValue(point)).toEqual(point);
  });

  it('throws an error for invalid Point coordinates', () => {
    const invalidPoint = {
      type: 'Point',
      coordinates: [125.6],
    };
    expect(() => PointScalar.parseValue(invalidPoint)).toThrow(
      /Point must have coordinates as \[x, y\] or \[x, y, z\]\./
    );
  });

  it('validates a valid MultiPoint', () => {
    const multiPoint = {
      type: 'MultiPoint',
      coordinates: [
        [100.0, 0.0],
        [101.0, 1.0],
      ],
    };
    expect(MultiPointScalar.parseValue(multiPoint)).toEqual(multiPoint);
  });

  it('validates a valid LineString', () => {
    const lineString = {
      type: 'LineString',
      coordinates: [
        [100.0, 0.0],
        [101.0, 1.0],
      ],
    };

    expect(LineStringScalar.parseValue(lineString)).toEqual(lineString);
  });

  it('validates a valid MultiLineString', () => {
    const multiLineString = {
      type: 'MultiLineString',
      coordinates: [
        [
          [100.0, 0.0],
          [101.0, 1.0],
        ],
        [
          [102.0, 2.0],
          [103.0, 3.0],
        ],
      ],
    };
    expect(MultiLineStringScalar.parseValue(multiLineString)).toEqual(
      multiLineString
    );
  });

  it('validates a valid Polygon (No holes)', () => {
    const polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [100.0, 0.0],
          [101.0, 0.0],
          [101.0, 1.0],
          [100.0, 1.0],
          [100.0, 0.0],
        ],
      ],
    };
    expect(PolygonScalar.parseValue(polygon)).toEqual(polygon);
  });

  it('validates a valid Polygon (With holes)', () => {
    const polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [100.0, 0.0],
          [101.0, 0.0],
          [101.0, 1.0],
          [100.0, 1.0],
          [100.0, 0.0],
        ],
        [
          [100.8, 0.8],
          [100.8, 0.2],
          [100.2, 0.2],
          [100.2, 0.8],
          [100.8, 0.8],
        ],
      ],
    };
    expect(PolygonScalar.parseValue(polygon)).toEqual(polygon);
  });

  it('throws an error for invalid Polygon coordinates', () => {
    const invalidPolygon = {
      type: 'Polygon',
      coordinates: [
        [
          [100.0, 0.0],
          [101.0, 0.0],
        ],
      ],
    };
    expect(() => PolygonScalar.parseValue(invalidPolygon)).toThrow(
      /Each linear ring in a Polygon must have at least four positions and must be closed./
    );
  });

  it('validates a valid MultiPolygon', () => {
    const multiPolygon = {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [102.0, 2.0],
            [103.0, 2.0],
            [103.0, 3.0],
            [102.0, 3.0],
            [102.0, 2.0],
          ],
        ],
        [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0],
          ],
          [
            [100.2, 0.2],
            [100.2, 0.8],
            [100.8, 0.8],
            [100.8, 0.2],
            [100.2, 0.2],
          ],
        ],
      ],
    };

    expect(MultiPolygonScalar.parseValue(multiPolygon)).toEqual(multiPolygon);
  });

  it('throws an error for invalid MultiPolygon coordinates', () => {
    const invalidMultiPolygon = {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [100.0, 0.0],
            [101.0, 0.0],
          ],
        ],
      ],
    };
    expect(() => MultiPolygonScalar.parseValue(invalidMultiPolygon)).toThrow(
      /Each linear ring in a Polygon must have at least four positions and must be closed./
    );
  });

  it('validates a valid GeometryCollection', () => {
    const geometryCollection = {
      type: 'GeometryCollection',
      geometries: [
        {
          type: 'Point',
          coordinates: [100.0, 0.0],
        },
        {
          type: 'LineString',
          coordinates: [
            [101.0, 0.0],
            [102.0, 1.0],
          ],
        },
      ],
    };
    expect(GeometryCollectionScalar.parseValue(geometryCollection)).toEqual(
      geometryCollection
    );
  });

  it('validates a valid Feature', () => {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [100.0, 0.0],
      },
      properties: {},
    };
    expect(validateGeoJSON(feature)).toEqual(feature);
  });

  it('throws an error for Feature missing geometry', () => {
    const invalidFeature = {
      type: 'Feature',
      properties: {},
    };
    expect(() => validateGeoJSON(invalidFeature)).toThrow(
      /Feature must include a 'geometry' field./
    );
  });

  it('validates a valid FeatureCollection', () => {
    const featureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [100.0, 0.0],
          },
          properties: {},
        },
      ],
    };
    expect(validateGeoJSON(featureCollection)).toEqual(featureCollection);
  });

  it('throws an error for FeatureCollection missing features', () => {
    const invalidFeatureCollection = {
      type: 'FeatureCollection',
    };
    expect(() => validateGeoJSON(invalidFeatureCollection)).toThrow(
      /FeatureCollection must include a 'features' field./
    );
  });

  it('throws an error for invalid GeoJSON type', () => {
    const invalidGeoJSON = {
      type: 'InvalidType',
    };
    expect(() => validateGeoJSON(invalidGeoJSON)).toThrow(
      /Invalid GeoJSON type: InvalidType./
    );
  });
});
