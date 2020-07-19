/*  Update operation */

db.users.updateOne(
  { name: "Chris" },
  {
    $set: {
      hobbies: [
        { title: "Painting", frequency: 4 },
        { title: "Cooking", frequency: 7 },
      ],
    },
  }
);

db.users.updateOne(
  { name: "Chris" },
  { $set: { age: 25, phone: "9900712357" } }
);

db.users.updateOne({ name: "Chris" }, { $inc: { age: 1 } });
// we can use $inc and $set at the same time on update doc
db.users.updateOne(
  { name: "Chris" },
  { $inc: { age: 1 }, $set: { isSporty: false } }
);
//we can't $set and $inc on the same field at at time
db.users.updateOne({ name: "Chris" }, { $inc: { age: 1 }, $set: { age: 5 } }); // error

//$min
db.users.updateOne({ name: "Chris" }, { $min: { age: 26 } });
// $min changes the value only when the given $min value lessthan existing value of a doc

//$mul
db.users.updateOne({ name: "Chris" }, { $mul: { age: 3 } });

// deleting the field
db.users.updateOne({ name: "Chris" }, { $set: { phone: null } });
// setting a phone to null doesn't mean field will be deleted
db.users.updateOne({ name: "Chris" }, { $unset: { phone: true } });

// Renaming a fields
// $rename
db.users.updateMany({}, { $rename: { phone: "contact" } });

// upsert()
// when updating and setting a doc, if specified criteria didn't match then modified count returns 0
// upsert() helps to create a new doc if the search filter doesn't exist
db.users.updateOne(
  { name: "Shaun" },
  { $set: { age: 29, hobbies: [{ title: "cooking", frequency: 5 }] } },
  { upsert: true }
);
