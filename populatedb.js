#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Section = require("./models/section");
var Category = require("./models/category");
var ItemInstance = require("./models/iteminstance");
// var BookInstance = require("./models/bookinstance");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
console.log(mongoDB);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var sections = [];
var categories = [];
var iteminstances = [];
// var bookinstances = [];

function sectionCreate(name, cb) {
  sectionDetail = { name: name };

  var section = new Section(sectionDetail);

  section.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Section: " + section);
    sections.push(section);
    cb(null, section);
  });
}

function categoryCreate(name, cb) {
  var category = new Category({ name: name });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

// function bookCreate(title, summary, isbn, author, genre, cb) {
//   bookdetail = {
//     title: title,
//     summary: summary,
//     author: author,
//     isbn: isbn,
//   };
//   if (genre != false) bookdetail.genre = genre;

//   var book = new Book(bookdetail);
//   book.save(function (err) {
//     if (err) {
//       cb(err, null);
//       return;
//     }
//     console.log("New Book: " + book);
//     books.push(book);
//     cb(null, book);
//   });
// }

function itemInstanceCreate(
  name,
  // description,
  price,
  stock,
  section,
  category,
  cb
) {
  iteminstancedetail = {
    name: name,
    // description: description,
    price: price,
    stock: stock,
    section: section,
    category: category,
  };

  var iteminstance = new ItemInstance(iteminstancedetail);
  iteminstance.save(function (err) {
    if (err) {
      console.log("ERROR CREATING ItemInstance: " + iteminstance);
      cb(err, null);
      return;
    }
    console.log("New ItemInstance: " + iteminstance);
    iteminstances.push(iteminstance);
    cb(null, iteminstance);
  });
}

function createSectionsCategories(cb) {
  async.series(
    [
      function (callback) {
        sectionCreate("Freezer1", callback);
      },
      function (callback) {
        sectionCreate("Freezer2", callback);
      },
      function (callback) {
        sectionCreate("Fridge1", callback);
      },
      function (callback) {
        sectionCreate("Fridge2", callback);
      },
      function (callback) {
        categoryCreate("Fruits", callback);
      },
      function (callback) {
        categoryCreate("Vegetables", callback);
      },
      function (callback) {
        categoryCreate("Meats", callback);
      },
      function (callback) {
        categoryCreate("Poultry", callback);
      },
      function (callback) {
        categoryCreate("Dessert", callback);
      },
      function (callback) {
        categoryCreate("Dairy", callback);
      },
    ],
    // optional callback
    cb
  );
}

// function createBooks(cb) {
//   async.parallel(
//     [
//       function (callback) {
//         bookCreate(
//           "The Name of the Wind (The Kingkiller Chronicle, #1)",
//           "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
//           "9781473211896",
//           authors[0],
//           [genres[0]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
//           "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
//           "9788401352836",
//           authors[0],
//           [genres[0]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "The Slow Regard of Silent Things (Kingkiller Chronicle)",
//           "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
//           "9780756411336",
//           authors[0],
//           [genres[0]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "Apes and Angels",
//           "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
//           "9780765379528",
//           authors[1],
//           [genres[1]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "Death Wave",
//           "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
//           "9780765379504",
//           authors[1],
//           [genres[1]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "Test Book 1",
//           "Summary of test book 1",
//           "ISBN111111",
//           authors[4],
//           [genres[0], genres[1]],
//           callback
//         );
//       },
//       function (callback) {
//         bookCreate(
//           "Test Book 2",
//           "Summary of test book 2",
//           "ISBN222222",
//           authors[4],
//           false,
//           callback
//         );
//       },
//     ],
//     // optional callback
//     cb
//   );
// }

function createItemInstances(cb) {
  async.parallel(
    [
      function (callback) {
        itemInstanceCreate(
          "Camembert Cheese",
          3.9,
          2,
          sections[0],
          categories[3],
          callback
        );
      },
      function (callback) {
        itemInstanceCreate("Onion", 2, 1, sections[2], categories[1], callback);
      },
      function (callback) {
        itemInstanceCreate(
          "Full Cream Milk",
          3.5,
          1,
          sections[2],
          categories[3],
          callback
        );
      },
      function (callback) {
        itemInstanceCreate(
          "Gyoza",
          6.5,
          1,
          sections[0],
          categories[2],
          callback
        );
      },
      function (callback) {
        itemInstanceCreate(
          "shabu shabu",
          7,
          2,
          sections[1],
          categories[2],
          callback
        );
      },
      function (callback) {
        itemInstanceCreate(
          "Mixed vegetables",
          4,
          1,
          sections[0],
          categories[1],
          callback
        );
      },
      function (callback) {
        itemInstanceCreate(
          "Ramen Sauce",
          5.5,
          1,
          sections[2],
          categories[2],
          callback
        );
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createSectionsCategories, createItemInstances],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("ITEMInstances: " + iteminstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
