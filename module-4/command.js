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
