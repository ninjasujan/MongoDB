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

/* Additional data */

db.friends.insertMany([
  {
    name: 'Max',
    hobbies: ['Sports', 'Cooking'],
    age: 29,
    examScores: [
      { difficulty: 4, score: 57.9 },
      { difficulty: 6, score: 62.1 },
      { difficulty: 3, score: 88.5 },
    ],
  },
  {
    name: 'Manu',
    hobbies: ['Eating', 'Data Analytics'],
    age: 30,
    examScores: [
      { difficulty: 7, score: 52.1 },
      { difficulty: 2, score: 74.3 },
      { difficulty: 5, score: 53.1 },
    ],
  },
  {
    name: 'Maria',
    hobbies: ['Cooking', 'Skiing'],
    age: 29,
    examScores: [
      { difficulty: 3, score: 75.1 },
      { difficulty: 8, score: 44.2 },
      { difficulty: 6, score: 61.5 },
    ],
  },
]);

/* Pushing the element into newly cretaed elements */

db.friends
  .aggregate([
    { $group: { _id: { age: '$age' }, allHobbies: { $push: '$age' } } },
  ])
  .pretty();
db.friends
  .aggregate([{ $group: { _id: '$age', allHobbies: { $push: '$hobbies' } } }])
  .pretty();

/* $unwind */

db.friends.aggregate([{ $unwind: '$hobbies' }]);
db.friends.aggregate([
  { $unwind: '$hobbies' },
  { $group: { _id: { age: '$age' }, allHobbies: { $addToSet: '$hobbies' } } },
]);

db.friends.aggregate([
  { $project: { _id: 0, examScore: { $slice: ['$examScores', 1, 1] } } },
]);

// Length of an array
db.friends.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      totalExams: { $size: '$examScores' },
      score: {
        $filter: {
          input: '$examScores',
          as: 'sc',
          cond: { $gt: ['$$sc.score', 69] },
        },
      },
    },
  },
]);

/* Display the highest marks in the marks array */
db.friends.aggregate([
  {
    $project: { _id: 0, score: '$examScores.score', name: { $first: '$name' } },
  },
  { $sort: { $maxScore: 1 } },
]);

db.friends.aggregate([
  { $unwind: '$examScores' },
  { $sort: { 'examScores.score': -1 } },
  { $group: { _id: '$_id', name: { $first: '$name' } } },
]);

/* $bucket */

db.persons.aggregate([
  {
    $bucket: {
      groupBy: '$dob.age',
      boundaries: [20, 50],
      default: 'others',
      output: {
        average: { $avg: '$dob.age' },
        total: { $sum: 1 },
      },
    },
  },
]);

db.persons.aggregate([
  {
    $match: {
      $and: [{ 'dob.age': { $gte: 20 } }, { 'dob.age': { $lt: 50 } }],
    },
  },
  { $group: { _id: null, average: { $avg: '$dob.age' }, total: { $sum: 1 } } },
]);

db.persons.aggregate([
  {
    $project: {
      _id: 0,
      fullName: {
        $concat: ['$name.title', ' ', '$name.first', ' ', '$name.last'],
      },
      date: { $toDate: '$dob.date' },
    },
  },
  { $skip: 10 },
  { $limit: 10 },
  { $sort: { date: -1 } },
  { $out: 'output' },
]);

/* $geoNear */

db.persons.aggregate([
  {
    $geoNear: {
      near: { type: 'Point', coordinates: [-18.4, -42.8] },
      maxDistance: 1000000,
      distanceField: 'distance',
    },
  },
]);
