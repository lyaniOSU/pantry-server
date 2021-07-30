//Setup

var express = require('express');
var mysql = require('mysql');
const http = require("https");

const {
  Client
} = require('pg');

const pool = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');
const {
  appendFile
} = require('fs');
const { prependListener } = require('process');
const { callbackify } = require('util');

var app = express();
var handlebars = require('express-handlebars').create({
  defaultLayout: 'other'
});
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Content-Type, application/json");
  next();
});

app.use(cors());

//HTTP Requests

app.get('/randomize', function (req, res) {
  var number = req.query.number;
  var path = "/recipes/random?number=" + number;
  var sample = "/recipes/random?number=1&tags=vegetarian%2Cdessert";

  const searchRecipe = {
    "method": "GET",
    "hostname": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "port": null,
    "path": path,
    "headers": {
      "x-rapidapi-key": "7eac1f1eb2msh18be51d7ad8ff22p19c11ejsnd85ba0747743",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "useQueryString": true
    }
  };

  const request = http.request(searchRecipe, function (results) {
    const chunks = [];
    //console.log(res);

    results.on("data", function (chunk) {
      chunks.push(chunk);
      //console.log(chunk);
    });

    results.on("end", function () {
      const body = Buffer.concat(chunks);
      //console.log(body.toString());
      content = JSON.parse(body);
      var recipes = content.recipes;
      //console.log(recipes);
      var ids = [];
      for (i = 0; i < recipes.length; i++) {
        ids.push(recipes[i].id);
        //console.log(recipes[i].id);
      }
      //console.log(ids);
      getDetails(ids, res);
      //res.send(body);
    });
  });

  request.end()
});

app.get('/search', function (req, res) {
  //console.log(req);
  var item = req.query.item; //"burger";
  var cuisine = req.query.cuisine; //"american";
  var diet = req.query.diet; //"vegetarian";
  var number = req.query.number; //10;
  var limitLicense = false;
  var type = "main%20course";
  var path = "/recipes/search?query=" + item + "&cuisine=" + cuisine + "&diet=" + diet + "&number=" + number;
  var sample = "/recipes/search?query=burger&diet=vegetarian&excludeIngredients=coconut&intolerances=egg%2C%20gluten&number=10&offset=0&type=main%20course";

  const searchRecipe = {
    "method": "GET",
    "hostname": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "port": null,
    "path": path,
    "headers": {
      "x-rapidapi-key": "7eac1f1eb2msh18be51d7ad8ff22p19c11ejsnd85ba0747743",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "useQueryString": true
    }
  };

  const request = http.request(searchRecipe, function (results) {
    const chunks = [];
    console.log(res);

    results.on("data", function (chunk) {
      chunks.push(chunk);
      //console.log(chunk);
    });

    results.on("end", function () {
      const body = Buffer.concat(chunks);
      //console.log(body.toString());
      content = JSON.parse(body);
      var recipes = content.results;
      var ids = [];
      for (i = 0; i < recipes.length; i++) {
        ids.push(recipes[i].id);
        console.log(recipes[i].id);
      }
      getDetails(ids, res);
      //res.send(body);
    });
  });

  request.end()

});

app.get('/query', function(req, res) {
  var item = req.query.item;
  console.log(item);
  var path = "/recipes/search?query=" + item + "&number=1";

  const options = {
    "method": "GET",
    "hostname": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "port": null,
    "path": path,
    "headers": {
      "x-rapidapi-key": "7eac1f1eb2msh18be51d7ad8ff22p19c11ejsnd85ba0747743",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "useQueryString": true
    }
  };
  
  const request = http.request(options, function (results) {
    const chunks = [];
  
    results.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    results.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
      content = JSON.parse(body);
      var recipes = content.results;
      console.log(recipes);

      if (recipes.length === 0) {
        res.send("No results found. Please try another query.");
      } else {
        var ids = recipes[0].id;
      /*for (i = 0; i < recipes.length; i++) {
        ids.push(recipes[i].id);
        console.log(recipes[i].id);
      }*/
        getSummary(ids, res);
      }

      
    });
  });
  
  request.end();
});

function getSummary(array, res) {
  var id = array;
  console.log(id);
  var path = "/recipes/"+ id +"/information";

  const options = {
    "method": "GET",
    "hostname": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "port": null,
    "path": path,
    "headers": {
      "x-rapidapi-key": "7eac1f1eb2msh18be51d7ad8ff22p19c11ejsnd85ba0747743",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "useQueryString": true
    }
  };
  
  const request = http.request(options, function (results) {
    const chunks = [];
  
    results.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    results.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
      var condensed = {};
      var bodyjson = JSON.parse(body);
      condensed["title"] = bodyjson.title;
      condensed["image"] = bodyjson.image;
      condensed["sourceUrl"] = bodyjson.sourceUrl;
      res.send(condensed);
    });
  });
  
  request.end();
}

function getDetails(array, res) {
  var ids = "";
  for (i = 0; i < array.length; i++) {
    if (i === (array.length - 1)) {
      ids += array[i];
    } else {
      ids += array[i];
      ids += "%2C";
    }
  }
  var path = "/recipes/informationBulk?ids=" + ids;
  //console.log(path);

  const searchDetails = {
    "method": "GET",
    "hostname": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "port": null,
    "path": path,
    "headers": {
      "x-rapidapi-key": "7eac1f1eb2msh18be51d7ad8ff22p19c11ejsnd85ba0747743",
      "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      "useQueryString": true
    }
  };

  const request = http.request(searchDetails, function (results) {
    const chunks = [];
    //console.log(res);

    results.on("data", function (chunk) {
      chunks.push(chunk);
      //console.log(chunk);
    });

    results.on("end", function () {
      const body = Buffer.concat(chunks);
      //console.log(body.toString());
      res.send(body);

      //getNutrition(JSON.parse(body), array)


    });
  });
  request.end()
};

function getNutrition(data, array, res) {
  function combining(callback) {
    let points = [];
    for (i = 0; i < array.length; i++) {
      var id = array[i];
      var path = "/recipes/" + id + "/nutritionWidget.json"
      const options = {
        "method": "GET",
        "hostname": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        "port": null,
        "path": path,
        "headers": {
          "x-rapidapi-key": "7eac1f1eb2msh18be51d7ad8ff22p19c11ejsnd85ba0747743",
          "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "useQueryString": true
        }
      };
      var obj1 = data[i];
      const request = http.request(options, function (results) {
        const chunks = [];
        results.on("data", function (chunk) {
          chunks.push(chunk);
        });
        results.on("end", function () {
          const body = Buffer.concat(chunks);
          var other = JSON.parse(body);
          var obj2 = other;
          var merged = {
            ...obj1,
            ...obj2
          };
          var details = JSON.stringify(merged);
          points.push(details);
          //console.log(points);
        });
      });
      request.end();
    };
    callback(points);
  };
  
  combining(function(points) {
    console.log(points);
  });

};

//Error Handling

app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

//Run

app.listen(app.get('port'), function () {
  console.log('Express started' + '; press Ctrl-C to terminate.');
});