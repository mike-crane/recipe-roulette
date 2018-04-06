'use strict';

// RECIPE API CALL

const recipeEndpoint = 'https://api.edamam.com/search';

function getRecipeData(searchTerm, callback) {

  const query = {
    q: searchTerm,
    app_id: 'ea916a78',
    app_key: '068a84e88e74b4d799de8679525df5b7',
    to: 50
  }
  $.getJSON(recipeEndpoint, query, callback);
}

// function reponsible for parsing out URLs into a new array, shuffling, and making random selection
function parseUrls(data) {

  let recipeArr = data.hits;
  let resultArr = [];

  // parse urls into resultArr
  for (let i=0; i < recipeArr.length; i++) {
    resultArr.push(recipeArr[i].recipe.url);  
  }

  // shuffle the order of the url items in resultArr
  const shuffledUrls = resultArr.sort(function() { 
    .5 - Math.random()  
  });

  // select a random segment of 5 items from 
  let begin = Math.floor(Math.random() * resultArr.length);
  let selectedUrls = shuffledUrls.slice(begin, begin + 6);

  getLinkPreview(selectedUrls);
  
}



function getLinkPreview(urlArr) {

  const linkPreviewEndpoint = 'https://api.linkpreview.net/';

  let call0;
  let call1;
  let call2;
  let call3;
  let call4;
  let call5;

  for (let i=0; i < urlArr.length; i++) {

    let callNumber = 'call' + i;

    const query = {
      q: urlArr[i],
      key: '5ac56159a2e7c314bae787bbde4c246d44ae5994585ee'
    };

    callNumber = $.getJSON(linkPreviewEndpoint, query);

  } 

  $.when(call0, call1, call2, call3, call4, call5)
    .then(testCallback);

}

function testCallback(data) {
  console.log(data);
}

// function responsible for appending URL's to the DOM
function urlsToDom(urlArr) {

  let recipeCard = '';

  for (let i=0; i < urlArr.length; i++) {

    let recipeUrl = urlArr[i].url;
    let recipeImg = urlArr[i].image;
    let recipeDesc = urlArr[i].label;

    recipeCard += `<section role="region"><a href="${recipeUrl}"><div class="recipe-card"><img src="${recipeImg}"/><p class="description">${recipeDesc}</p></div></a></section>`;

    $('.js-search-results').html(recipeCard);
  }

}

function handleSubmitButton() {
  $('form').submit(function (e) {
    e.preventDefault();

    let recipe = $('#recipe');
    let recipeSearch = recipe.val();

    recipe.val('');

    getRecipeData(recipeSearch, parseUrls);
  })
}

$(handleSubmitButton);



