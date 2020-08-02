// InsertMany method
db.personData.insertMany([
  { name: "Max", age: 30, hobbies: ["sports", "cooking"] },
  { name: "Manueal", age: 35, hobbies: ["Sports", "Yoga"] },
]);

db.personData.insertMany([
  { name: "Ryu", age: 32, hobbies: ["Mario game", "painting"] },
  { name: "Shaun", age: 35, hobbies: ["Cricket", "Yoga"] },
]);

// InsertOne method
db.personData.insertOne({
  name: "Mario Jofn",
  age: 24,
  hobbies: ["cooking", "surfing"],
});

// Insert method not returns _id immediately after insertion
// can insert single or multiple doc
db.personData.insert({ name: "Clara", age: 45, hobbies: [] });

/* Working with ordered insert */
db.hobbiesData.insertMany([
  { _id: "sports", name: "Sports" },
  { _id: "Cooking", name: "Cooking" },
  { _id: "Cars", name: "Cars" },
  { _id: "Cricket", name: "Cricket" },
]);

// trying to insert the doc with same _id will fail, but it will insert all the doc before the error encountered
// is callled ordered insert

db.hobbiesData.insertMany(
  [
    { _id: "Golf", name: "Golf" },
    { _id: "Basket-Ball", name: "Basket-Ball" },
    { _id: "Cars", name: "Cars" },
    { _id: "Cricket", name: "Cricket" },
  ],
  { ordered: false }
);

// It will insert all doc which are not inserted in the collection even though the subsequent doc already present in the collections

/* WriteConcern  */

// {w: 1, j: undefined}
// {w: 0, ...} acknowldges immediately without ObjectId, doesn't wait till it generates objectId - super fast
// w - how many instances, the write should acknowledges
// j - acts as a To-do File. Can be kept the operation that haven't stored in a server, In case of server failure the journal stores the operation, looks like backup todolist
// journal acts as a buffer because inserting a disk files are heavy write operation,
// {w: 1, j: true} - please only report success only after it has been acknoledged and saved to the journal
// {w: 1, wtimeout: 200 ,j: true} - which time frame do you give success report before canceling the server

db.personData.insertOne(
  { name: "Alex", age: 41 },
  { writeConcern: { w: 1, j: true } }
);

db.personData.insertOne(
  { name: "Michel", age: 45 },
  { writeConcern: { w: 1, j: true, wtimeout: 500 } }
);

/*  Atomicity */
// Transactions either succeed as a whole or fails as a whole
// support only on document level (not in insertMany then each doc is a operation)

/* Assignment */
// 1 . Insert company data in both InsertOne and insertMany
db.companyData.insertOne({ name: "Accenture", location: "Hyd" });
db.companyData.insertMany([
  { name: "Wipro", location: "Banglore" },
  { name: "Infosys", location: "Manglore" },
]);

// 2. Insert a doc with a dublicate Id and fix it failing additions with unordered insert
db.companyData.insertMany(
  [
    { name: "Amazon", location: "Mumbai" },
    {
      _id: ObjectId("5f02a55aa0406252ff264f32"),
      name: "Xceleo",
      location: "Mumbai",
    },
    { name: "Facebook", location: "Banglore" },
    { name: "Google", location: "Hyd" },
  ],
  { ordered: false }
);

// 3. write a data by guarnnteeng journaling and not guarnnteeng
db.companyData.insertOne(
  { name: "Novigo Solutions", location: "Manglore" },
  { w: 1, j: true, wtimeout: 500 }
);

db.companyData.insertOne(
  { name: "Diya System", location: "Manglore" },
  { w: 1, j: undefined }
);

/* Importing data */
// Navigate into the file location
// > mongoimport tv-shows.json -d moviesdata -c movies --jsonArray --drop
