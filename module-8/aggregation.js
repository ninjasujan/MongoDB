/* 
    Aggregate takes an array - we execute series step
    first step is data next step filter
    aggregate can take an adavntage of indexes 
*/

/* 3 ways of aggregation in mongoDB 
1. Aggregation pipeline.
2. Mapreduce function.
3. Single purpose aggregation method
*/

/* $match, $aggregate, $group */
db.persons
  .aggregate([
    { $match: { gender: 'female' } },
    {
      $group: { _id: { state: '$location.state' }, totalPersons: { $sum: 1 } },
    },
    { $sort: { totalPersons: -1 } },
  ])
  .pretty();

db.persons
  .aggregate([
    { $match: { 'dob.age': { $gt: 50 } } },
    {
      $group: {
        _id: { gender: '$gender' },
        total: { $sum: 1 },
        average: { $avg: '$dob.age' },
      },
    },
  ])
  .pretty();

/* Aggregate Multiple $project */

db.persons.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      birthDate: {
        $convert: {
          input: '$dob.date',
          to: 'date',
        },
      },
      age: '$dob.age',
      location: {
        type: 'Point',
        coordinates: [
          {
            $convert: {
              input: '$location.coordinates.longitude',
              to: 'double',
              onError: '0.00',
              onNull: '0.00',
            },
          },
          {
            $convert: {
              input: '$location.coordinates.longitude',
              to: 'double',
              onError: '0.00',
              onNull: '0.00',
            },
          },
        ],
      },
    },
  },
  {
    $project: {
      gender: 1,
      location: 1,
      email: 1,
      birthDate: 1,
      age: 1,
      fullName: {
        $concat: [
          { $toUpper: { $substrCP: ['$name.first', 0, 1] } },
          {
            $substrCP: [
              '$name.first',
              1,
              { $subtract: [{ $strLenCP: '$name.first' }, 1] },
            ],
          },
          ' ',
          { $toUpper: { $substrCP: ['$name.last', 0, 1] } },
          {
            $substrCP: [
              '$name.last',
              1,
              { $subtract: [{ $strLenCP: '$name.last' }, 1] },
            ],
          },
        ],
      },
    },
  },
]);

/* Practise queries */

db.persons.aggregate([{ $match: { 'dob.age': { $gt: 80 } } }]);

db.persons.aggregate([
  { $match: { 'dob.age': { $gt: 50 } } },
  { $group: { _id: { gender: '$gender' }, count: { $sum: 1 } } },
]);

db.persons.aggregate([
  { $match: { 'dob.age': { $gt: 50 } } },
  { $group: { _id: { gender: '$gender' }, name: { $first: '$email' } } },
]);

db.persons.aggregate([
  { $match: { 'dob.age': { $gt: 50 } } },
  { $group: { _id: { gender: '$gender' }, name: { $max: '$dob.age' } } },
]);

db.persons.aggregate([
  { $group: { _id: { location: '$nat' }, average: { $avg: '$dob.age' } } },
]);

db.persons.aggregate([
  { $group: { _id: { location: '$nat' }, average: { $avg: '$dob.age' } } },
  { $count: 'email' },
]);

db.persons.aggregate([
  { $match: { 'dob.age': { $gt: 50 } } },
  {
    $project: {
      _id: 0,
      email: 1,
      fullName: {
        $concat: [
          { $toUpper: { $substrCP: ['$name.title', 0, 1] } },
          {
            $substrCP: [
              '$name.title',
              1,
              { $subtract: [{ $strLenCP: '$name.title' }, 1] },
            ],
          },
          ' ',
          { $toUpper: { $substrCP: ['$name.first', 0, 1] } },
          {
            $substrCP: [
              '$name.first',
              1,
              { $subtract: [{ $strLenCP: '$name.first' }, 1] },
            ],
          },
          ' ',
          { $toUpper: { $substrCP: ['$name.last', 0, 1] } },
          {
            $substrCP: [
              '$name.last',
              1,
              { $subtract: [{ $strLenCP: '$name.last' }, 1] },
            ],
          },
        ],
      },
      birthDate: { $toDate: '$dob.date' },
    },
  },
  {
    $group: {
      _id: { year: { $isoWeekYear: '$birthDate' } },
      total: { $sum: 1 },
    },
  },
]);
