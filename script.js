'use strict';

let recipes = [];
let currentRecipe = null;

// RECIPE API CALL
const recipeEndpoint = 'https://api.edamam.com/search';

function getRecipeData(searchTerm, callback) {

  const query = {
    q: searchTerm,
    app_id: 'ea916a78',
    app_key: '068a84e88e74b4d799de8679525df5b7',
    to: 50
  };

  $.getJSON(recipeEndpoint, query, callback);
}

// function reponsible for parsing out URLs into a new array, shuffling, and making random selection
function parseUrls(data) {

  let recipeArr = data.hits;
  let resultArr = [];

  // parse urls into resultArr
  for (let i=0; i < recipeArr.length; i++) {
    resultArr.push(recipeArr[i].recipe);  
  }

  // shuffle the order of the url items in resultArr
  const shuffledUrls = resultArr.sort(function() { 
    .5 - Math.random()  
  });

  // select a random segment of 5 items from 
  let begin = Math.floor(Math.random() * resultArr.length);
  recipes = shuffledUrls.slice(begin, begin + 6);

  urlsToDom(recipes);
}

// function responsible for appending URL's to the DOM
function urlsToDom(urlArr) {

  let recipeCard = '';

  for (let i=0; i < urlArr.length; i++) {

    let recipeUrl = urlArr[i].url;
    let recipeImg = urlArr[i].image;
    let recipeLabel = urlArr[i].label;

    recipeCard += `<section role="region"><a href="${recipeUrl}" recipeIndex="${i}" class="recipe-link trigger"><div class="recipe-card"><img src="${recipeImg}"/><p class="label">${recipeLabel}</p></div></a></section>`;

    $('.js-search-results').html(recipeCard);

    $(".label").text(function (index, currentText) {
      return currentText.substr(0, 25);
    });
  }


  $('.trigger').click(function (e) {
    e.preventDefault();

    let url = this.href;
    currentRecipe = parseInt($(this).attr('recipeIndex'));

    const linkPreviewEndpoint = 'https://api.linkpreview.net/';

    const query = {
      q: url,
      key: '5ac7b41b7aa774703af37c2925cf2191b72dcb5f7f286'
    };

    $.getJSON(linkPreviewEndpoint, query, showExpandedView);

    $('.modal-wrapper').toggleClass('open');
    $('main').toggleClass('blur');
  })
}

function showExpandedView(data) {

  let description = data.description;
  let image = data.image; 
  let ingredients = recipes[currentRecipe].ingredientLines;
  let ingredientsList = '';

  for (let i = 0; i < ingredients.length; i++) {
    ingredientsList += '<li>' + ingredients[i] + '</li>';
  }

  let moreDetails = `<section class="details" role="region"><img src="${image}"/><p class="description">${description}</p><ul class="ingredients">${ingredientsList}</ul></section>`;

  $('.modal-title').text(recipes[currentRecipe].label);
  
  $('.content').append(moreDetails);

  

  $('.btn-close').click(function () {
    $('.content').empty();
  })

  // console.log(data);
}


function handleSubmitButton() {
  $('form').submit(function(e) {
    e.preventDefault();

    let recipe = $('#recipe');
    let recipeSearch = recipe.val();

    recipe.val('');

    getRecipeData(recipeSearch, parseUrls);
  })
}

$(handleSubmitButton);