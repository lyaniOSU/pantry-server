window.addEventListener('load', (event) => {
    var res = sessionStorage.getItem('recipeDetails');
    console.log(res);
    var results = JSON.parse(res);
    addTitle(results);
    addImage(results);
    addDescription(results);
    addIngredients(results);
    //addEquipment(results);
    addWine(results);
});

function addTitle(res) {
    var title = res.title;
    console.log(title);
    var parent = document.getElementById('recipe');
    var titleChild = document.createElement('h3');
    titleChild.classList.add("recipe-title");
    titleChild.innerHTML = title;
    parent.appendChild(titleChild);
}

function addImage(res) {
    var image = res.image;
    var parent = document.getElementById('recipe');
    var imageChild = document.createElement("IMG");
    imageChild.classList.add("recipe-image");
    imageChild.classList.add("mx-auto");
    imageChild.setAttribute("src", image);
    parent.appendChild(imageChild);
}

function addDescription(res) {
    var desc = res.summary;
    console.log(desc);
    var parent = document.getElementById('recipe');
    var descChild = document.createElement("p");
    descChild.classList.add("recipe-desc");
    descChild.innerHTML = desc;
    parent.appendChild(descChild);
}

function addIngredients(res) {
    var ingredients = res.extendedIngredients;
    console.log(ingredients);
    var parent = document.getElementById('recipe');
    var container = document.createElement('div');
    container.classList.add("recipe-ingredients");
    var header = document.createElement('h5');
    header.innerHTML = "Ingredients";
    var list = document.createElement("li");
    for (i=0; i<ingredients.length; i++) {
        var ingChild = document.createElement('ul');
        var text = ingredients[i].name + ": " + ingredients[i].amount + " " + ingredients[i].unit;
        ingChild.innerHTML = text;
        list.appendChild(ingChild);
    }
    container.appendChild(header);
    container.appendChild(list);
    parent.appendChild(container);
}

function addEquipment(res) {
    var equipment = res.analyzedInstructions.equipment;
    console.log(equipment);
    var parent = document.getElementById('recipe');
    var header = document.createElement('h5');
    header.innerHTML = "Equipment";
    var list = document.createElement("li");
    for (i=0; i<equipment.length; i++) {
        var eqpChild = document.createElement('ul');
        var text = equipment[i].name;
        eqpChild.innerHTML = text;
        list.appendChild(eqpChild);
    }
    parent.appendChild(header);
    parent.appendChild(list);
}

function addWine(res) {
    var wine = res.winePairing.pairedWines;
    console.log(wine);
    if (wine) {
        var parent = document.getElementById('recipe');
        var header = document.createElement("h5");
        header.innerHTML = "Wine Pairings";
        var list = document.createElement("li");
        for (i=0; i < wine.length; i++) {
            var wineChild = document.createElement('ul');
            var text = wine[i];
            wineChild.innerHTML = text;
            list.appendChild(wineChild);
        }
        parent.appendChild(header);
        parent.appendChild(list);
    }
}