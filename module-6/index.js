/*  Index creation */
db.contacts.createIndex({ "dob.age": 1 });
// Creates the index for age field in nested doc of dob object in asc order
// searching the small portion of the record will be done easily by the index, in case our search field is index filed

db.contacts.createIndex({ "dob.age": 1, gender: 1 });
// Creates the compound index on the dob.age and gender property, it will helps to fetch the record through index
// for the find selection attribute {"dob.age", ""}, {"dob.age": "", gender: ""} but not for {gender: ""}
// index works on the  filed from left to right

/*  Index is overhead incase we are searching full portion of a document and when no record match the search criteria 
(in this case records already in memory so no need to create the index) */
