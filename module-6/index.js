/*  Index creation */
db.contacts.createIndex({ 'dob.age': 1 });
// Creates the index for age field in nested doc of dob object in asc order
// searching the small portion of the record will be done easily by the index, in case our search field is index filed

db.contacts.createIndex({ 'dob.age': 1, gender: 1 });
// Creates the compound index on the dob.age and gender property, it will helps to fetch the record through index
// for the find selection attribute {"dob.age", ""}, {"dob.age": "", gender: ""} but not for {gender: ""}
// index works on the  filed from left to right

/*  Index is overhead incase we are searching full portion of a document and when no record match the search criteria 
(in this case records already in memory so no need to create the index) */

// Sorting in Index
db.contacts
  .explain('executionStats')
  .find({ 'dob.age': { $gt: 20 } })
  .sort({ age: 1 });

/* Drop Index */
db.contacts.dropIndex();

/* Index configuration - Unique Index */
db.contacts.createIndex({ email: 1 }, { unique: true });
// helps to maintain uniquness in the collection, in which filed the index is upon created

/* List all created index on collection */
db.contacts.getIndexes();

/* PartialFilterExpression */
db.contacts.createIndex(
  { 'dob.age': 1 },
  { partialFilterExpression: { gender: 'male' } }
);

// while fetching the records if the gender female appeares then it will go for coloumn scan

/* Apply partial indexes */
db.contacts.insertMany([
  { name: 'AAA', email: 'aa@gmail.com' },
  { name: 'BBB', email: 'bb@gmail.com' },
]);
db.contacts.createIndex({ email: 1 }, { unique: true });
db.contacts.insertOne({ name: 'DDD' });
db.contacts.insertOne({ name: 'CCC' }); // throws error
// MongoDB gives error if 2 doc has no value for index field and if that field is decalred as unique
// to avoid this use partialFilterExpression
db.contacts.createIndex(
  { email: 1 },
  { unique: true, partialFilterExpression: { $email: { $exist: true } } }
);

/* TTL indexes */
db.sesion.insertMany([
  { name: 'Sujan', createdAt: new Date() },
  { name: 'Max', createdAt: new Date() },
]);

// expireAfterSeconds
db.sesion.createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 });
// * It works only on single field object and only on date object

/* Covered query */
// all the fields in the query are part of an index, and
// all the fields returned in the results are in the same index.
// no fields in the query are equal to null (i.e. {"field" : null} or {"field" : {$eq : null}} )

/* Text index */
db.contactData.createIndex({ desc: 'text' });
// It will creates the text index on the field desc
// text index devides the text into smaller subset and makes index avoids the stop words
db.contactData.find({ $text: { $search: 'Text book' } });
// it will look for word Text or book in all the documents
// text index costly so we may have only one text index
db.contacts.dropIndex('<indexName>'); // index name is available through getIndexes() command
// we can't have more than one index in collection but we can combine the indexes
db.contactData.createIndex({ desc: 'text', title: 'A Book' });

db.contactData.find({ $text: { $search: 'Text -book' } }); // excludes the word book n search

// configuration
db.products.createIndex(
  { title: 'text', description: 'text' },
  {
    default_language: 'english',
    weights: {
      title: 1,
      description: 10,
    },
  }
);

db.products.createIndex({
  title: 'text',
  description: 'text',
});

db.products.find(
  { $text: { $search: 'Some', $caseSensitive: true } },
  { score: { $meta: 'textScore' } }
);
