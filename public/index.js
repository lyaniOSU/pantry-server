document.getElementById('recipe-submit').addEventListener('click', function (event) {
  event.preventDefault();
  var req = new XMLHttpRequest();
  let item = document.getElementById('recipe-query').value;
  let cuisine = document.getElementById('recipe-cuisine').value;
  let diet = document.getElementById('recipe-diet').value;
  let number = document.getElementById('recipe-number').value;
  req.open("GET", "http://127.0.0.1:5000/search?item=" +item + "&cuisine=" + cuisine + "&diet=" + diet + "&number=" + number, true);
  req.addEventListener('load', function() {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      console.log(req);
      console.log(response);
      var res = response;
      console.log(res);
      if (response.code === 400) {
        console.log("Unsuccessful");
        document.getElementById('recipe-result').textContent = "No results found. Please try another search.";
      } else {
        console.log("Successful");
        createRecipe(res);
        linkListen(res);
      }
    } else {
      document.getElementById('recipe-result').textContent = "No results found. Please try another search.";
      console.log("Not Successful");
    }
  });
  req.send(null);
});

document.getElementById('recipe-random').addEventListener('click', function(event) {
  event.preventDefault();
  var req = new XMLHttpRequest();
  let number = document.getElementById('recipe-number').value;
  //req.open("GET", "http://127.0.0.1:5000/randomize?number=" + number, true);
  req.open("GET", "http://pantry-recipes-server.herokuapp.com/randomize?number=" + number, true);
  req.addEventListener('load', function() {
    if (req.status >= 200 && req.status < 400) {
      var response = JSON.parse(req.responseText);
      console.log("Successful")
      console.log(req);
      console.log(response);
      var res = response;
      console.log(res);
      createRecipe(res);
      linkListen(res);
      //document.getElementById('recipe-result').textContent = response.results[0].title;
    } else {
      document.getElementById('recipe-result').textContent = "Error";
      console.log("Not Successful");
    }
  });
  req.send(null);
});

function createRecipe(response) {
  var results = document.getElementById('recipe-result');
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  }
  console.log(response);
  for (let count = 0; count < response.length; count++) {
    var container = document.createElement("div");
    container.classList.add("recipe-container");

    var id = response[count].id;
    console.log(id);

    var title = response[count].title;
    var name = document.createElement("h3")
    name.classList.add("recipe-title");
    name.innerHTML = title;

    var link = document.createElement('a');
    link.classList.add("recipe-link")
    link.innerHTML = title;
    link.href = "../public/details.html"
    link.setAttribute("id", id);
    link.setAttribute("name", count);

    //var image = "https://spoonacular.com/recipeImages/" + response[count].image;
    var image = response[count].image;
    var img = document.createElement("IMG");
    img.classList.add("recipe-image");
    img.setAttribute("src", image);

    var breaker = document.createElement("br");

    container.append(link);
    container.append(breaker);
    container.append(img);

    results.append(container);
  }
}

function linkListen(response) {
  links = document.querySelectorAll('.recipe-link');
  console.log(links);
  links.forEach((link) => {
    link.addEventListener('click', function(event) {
      let id = this.id;
      let name = this.name;
      recipe = response[name];
      sessionStorage.setItem('recipeDetails', JSON.stringify(recipe));
      window.location = '../public/details.html';
    }, false);
  });
}
