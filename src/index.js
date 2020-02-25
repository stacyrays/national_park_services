"use strict";

const apiKey = "VI4MkDdpTUPczdrYaUgbI58yGvZrLwdx0wJ10YZO";

const searchURL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson, maxResults) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; (i < responseJson.data.length) & (i < maxResults); i++) {
    // for each video object in the articles
    //array, add a list item to the results
    //list with the article title, source, author,
    //description, and image
    $("#results-list").append(
      `<li><h3><a href="${responseJson.data[i].url}">${responseJson.data[i].title}</a></h3>
      <p>${responseJson.articles[i].source.name}</p>
      <img src='${responseJson.articles[i].urlToImage}'>
      </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}

function getParks(stateCode, maxResults = 10) {
  const params = {
    stateCode,
    limit: maxResults,
    api_key: apiKey
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;

  console.log(url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey
    })
  };
  //displayResults(responseJson, maxResults)
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => console.log(responseJson))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    getParks(searchTerm, maxResults);
  });
}

$(watchForm);
