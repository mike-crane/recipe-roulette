'use strict';

let recipes = [];
let currentRecipe = null;

/**
 * ============================================================================
 *            calls edamam API to get recipe data
 * ============================================================================
 */

function getRecipeData(searchTerm, callback) {

  const recipeEndpoint = 'https://api.edamam.com/search';

  const query = {
    q: searchTerm,
    app_id: 'ea916a78',
    app_key: '068a84e88e74b4d799de8679525df5b7',
    to: 50
  };

  $.getJSON(recipeEndpoint, query, callback);
}


/**
 * ============================================================================
 *            parses, shuffles, and makes random selection of 6 recipes
 * ============================================================================
 */

function parseRecipes(data) {

  let recipeArr = data.hits;
  let resultArr = [];

  // parse recipes into resultArr
  for (let i = 0; i < recipeArr.length; i++) {
    resultArr.push(recipeArr[i].recipe);
  }

  // shuffle the order of the recipe items in resultArr
  const shuffledUrls = resultArr.sort(function () {
    0.5 - Math.random();
  });

  // select a random segment of 5 items from resultArr
  let begin = Math.floor(Math.random() * (resultArr.length - 6));
  recipes = shuffledUrls.slice(begin, begin + 6);

  recipesToDom(recipes);
}


/**
 * ============================================================================
 *            appends recipe items to the DOM
 * ============================================================================
 */

function recipesToDom(arrItems) {

  let recipeCard = '';

  // iterate through arrItems to compile into HTML
  for (let i = 0; i < arrItems.length; i++) {

    let recipeUrl = arrItems[i].url;
    let recipeImg = arrItems[i].image;
    let recipeLabel = arrItems[i].label;

    recipeCard += `<section role="region"><a href="${recipeUrl}" recipeIndex="${i}" class="recipe-link trigger"><div class="recipe-card"><img src="${recipeImg}" aria-label="${recipeLabel}"/><p class="label">${recipeLabel}</p></div></a></section>`;

    $('.js-search-results').prop('hidden', false).html(recipeCard);

    // set character limit on recipe labels
    $(".label").text(function (index, currentText) {
      return currentText.substr(0, 25);
    });
  }

  // click handler which calls second api and triggers modal with recipe details
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

  });
}


/**
 * ============================================================================
 *            appends recipe details to modal div
 * ============================================================================
 */

function showExpandedView(data) {

  let description = data.description;
  let urlLink = data.url;
  let image = recipes[currentRecipe].image;
  let modalLabel = recipes[currentRecipe].label;
  let ingredients = recipes[currentRecipe].ingredientLines;
  let ingredientsList = '';

  // iterate over ingredients array to convert into list items
  for (let i = 0; i < ingredients.length; i++) {
    ingredientsList += '<li>' + ingredients[i] + '</li>';
  }

  // compile data from api call into HTML for modal
  let moreDetails = `<section class="details" role="region"><a href="${urlLink}"><img src="${image}" aria-label="${modalLabel}"/></a><ul class="ingredients">${ingredientsList}</ul><p class="description">${description}</p></section>`;

  $('.modal-title').text(modalLabel);

  $('.content').prop('hidden', false).append(moreDetails);

  // clears out recipe details when modal is closed
  $('.btn-close').click(function () {
    $('.content').empty();
  });

  // set character limit on modal label
  $(".modal-title").text(function (index, currentText) {
    return currentText.substr(0, 35);
  });
}


/**
 * ============================================================================
 *            randomly selects 1 of the 6 displayed recipes
 * ============================================================================
 */

function handleRouletteButton() {
  $('.roulette').click(function () {
    $.fn.random = function () {
      return this.eq(Math.floor(Math.random() * 6));
    };

    $(".recipe-card").removeClass("selectedRandom");

    $(".recipe-card").random().addClass("selectedRandom");
  });
}


/**
 * ============================================================================
 *            handles the recipe search button
 * ============================================================================
 */

function handleSubmitButton() {
  $('form').submit(function (e) {
    e.preventDefault();

    let recipe = $('#recipe');
    let recipeSearch = recipe.val();

    recipe.val('');

    getRecipeData(recipeSearch, parseRecipes);

    // romoves the welcome screen when search button is clicked
    $('.feature-tour').css('display', 'none');

    // adds the 'try your luck' button when search button is clicked
    $('.roulette').css('display', 'block');
  });
}


/**
 * ============================================================================
 *            executes when the DOM is fully loaded
 * ============================================================================
 */

function initiateApp() {
  $(handleSubmitButton);
  $(handleRouletteButton);
}

$(initiateApp);

