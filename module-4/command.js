// comparision operator
db.movies.find({ runtime: { $lt: 60 } }).pretty();
db.movies.find({ runtime: { $lte: 60 } }).pretty();
db.movies.find({ runtime: { $ne: 60 } }).pretty();
db.movies.find({ runtime: { $eq: 60 } }).pretty();

/* Querying embedded doc */
db.movies.find({ "rating.average": { $gt: 7 } });
// in array
db.movies.find({ genres: "Drama" }); // there is item Drama in the genres array
db.movies.find({ genres: ["Drama"] }); // looking for an array exact ["Drama"] array in generes field

// continue - comparisions
db.movies.find({ runtime: { $in: [30, 42] } }); // look for the document runtime is 30 or 40
db.movies.find({ runtime: { $nin: [30, 42] } });

// $or and $nor condition
db.movies.find({
  $or: [{ "rating.average": { $lt: 5 } }, { "rating.average": { $gt: 9.3 } }],
});

db.movies.find({
  $nor: [{ "rating.average": { $lt: 5 } }, { "rating.average": { $gt: 9.3 } }],
});

// $and
db.movies
  .find({ $and: [{ "rating.average": { $gt: 9 } }, { genres: "Drama" }] })
  .pretty();

db.movies.find({ genres: "Drama", genres: "Horror" }); // will replace the first conditon because of same key in json object, $and helps to overcome the problem

// $not operator
db.movies.find({ runtime: { $not: { $eq: 60 } } }).count();

// $exist
db.users.find({ age: { $exists: true } }).pretty();
db.users.find({ phone: { $exists: true, $ne: null } });

// $type
db.users.find({ phone: { $type: 2 } });
db.users.find({ phone: { $type: "string" } });
db.users.find({ phone: { $type: [1, 2] } });

/* Regex $regex */
db.movies.find({ summary: { $regex: /musical$/ } });

/* $expr */
db.sales.find({ $expr: { $gt: ["$volume", "$target"] } }).pretty();

// Assignment

db.box
  .find({
    $and: [{ "meta.rating": { $gt: 9.2 } }, { "meta.runtime": { $lt: 100 } }],
  })
  .pretty();

db.box.find({ genre: { $in: ["drama", "action"] } });

db.box.find({ $expr: { $gt: ["$visitors", "$expectedVisitors"] } });

/* Array - Query Selector */
// $size
db.users.find({ hobbies: { $size: 3 } });

// $all
db.box.find({ genre: { $all: ["thriller", "action"] } });

// $eleMatch
db.users
  .find({
    $and: [{ "hobbies.title": "Cooking" }, { "hobbies.frequency": { $gt: 5 } }],
  })
  .pretty();

// problem in extracting - replace by $eleMatch
db.users
  .find({
    hobbies: { $elemMatch: { title: "Cooking", frequency: { $gte: 5 } } },
  })
  .pretty();
// even only one doc in array matched the condition over all array will be retrived
