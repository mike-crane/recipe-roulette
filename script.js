'use strict';

let recipes = [];
let currentRecipe = null;

const recipeEndpoint = 'https://api.edamam.com/search';

// responsible for calling edamam API to get recipe data
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

    // set character limit on recipe labels
    $(".label").text(function (index, currentText) {
      return currentText.substr(0, 25);
    });
  }

  // randomly selects 1 of the 6 displayed recipes
  $('.roulette').click(function () {
    $.fn.random = function () {
      return this.eq(Math.floor(Math.random() * 6));
    }
    $(".recipe-card").random().css({ "background-color": "rgba(247,184,87,0.75)", "color": "#000"});
  })
  

  // on click, calls second api (linkpreview) and triggers modal with recipe details
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
  let urlLink = data.url;
  let image = recipes[currentRecipe].image; 
  let modalLabel = recipes[currentRecipe].label;
  let ingredients = recipes[currentRecipe].ingredientLines;
  let ingredientsList = '';

  for (let i = 0; i < ingredients.length; i++) {
    ingredientsList += '<li>' + ingredients[i] + '</li>';
  }

  let moreDetails = `<section class="details" role="region"><a href="${urlLink}"><img src="${image}"/></a><ul class="ingredients">${ingredientsList}</ul><p class="description">${description}</p></section>`;

  $('.modal-title').text(modalLabel);
  
  $('.content').append(moreDetails);

  $('.btn-close').click(function () {
    $('.content').empty();
  });

  $(".modal-title").text(function (index, currentText) {
    return currentText.substr(0, 35);
  });

  // console.log(data);
}


function handleSubmitButton() {
  $('form').submit(function(e) {
    e.preventDefault();

    let recipe = $('#recipe');
    let recipeSearch = recipe.val();

    recipe.val('');

    getRecipeData(recipeSearch, parseUrls);

    $('.feature-tour').css('display', 'none');
    $('.roulette').css('display', 'block');
  })
}

$(handleSubmitButton);