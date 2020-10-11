/* Geospatial Data */
// Insertion of location data

db.places.insertOne({
  name: 'Golden Gate of the Golf Course',
  location: {
    type: 'Point',
    coordinates: [-122.50712, 37.76964],
  },
});

/* searching the place near to given coordinates */
db.places.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [-122.4671449, 37.7700134] },
      $maxDistance: 2000,
      $minDistance: 30,
    },
  },
});

// to execute this query we need to create 2dsphere index on location field
db.places.createIndex({ location: '2dsphere' });

// Polygon
const p1 = [-122.4547, 37.77475];
const p2 = [-122.45318, 37.76653];
const p3 = [-122.51025, 37.76426];
const p4 = [-122.51111, 37.77131];

db.places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.4547, 37.77475],
            [-122.45318, 37.76653],
            [-122.51025, 37.76426],
            [-122.51111, 37.77131],
            [-122.4547, 37.77475],
          ],
        ],
      },
    },
  },
});

// geoWithin helps to get a coordinated point in a Polygon

/* To check the point whcih lies in specified area */
db.areas.insertOne({
  name: 'Golden Gate Park.!',
  area: { type: 'Polygon', coordinates: [[p1, p2, p3, p4]] },
});

db.areas.find({
  name: {
    $geoIntersects: {
      $geometry: { type: 'Point', coordinates: [-122.49299, 37.76845] },
    },
  },
});
