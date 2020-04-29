'use strict';


const OMDBsearchURL = 'http://www.omdbapi.com/?apikey=2a2afcb2&t=';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayOMDBData(movie) {
    let html = '';
    if(movie.Error){
        html = `<p>${movie.Error} Type in a different movie name</p>`
    } else {
        html = `<h2>Movie Name: ${movie.Title}</h5><p>Plot: ${movie.Plot}</p>
        <p>Year: ${movie.Year}</p>\n`;
    }

  $('#results').html(html);

}


function getMovieData(query) {

  const url = OMDBsearchURL + query;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.error);
    })
    .then(responseJson => {
      console.log(JSON.stringify(responseJson))
      displayOMDBData(responseJson);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getMovieData(searchTerm);
  });
}

$(watchForm);