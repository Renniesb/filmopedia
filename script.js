'use strict';



const apiKey = 'AIzaSyAQd_NjHatlqWnGl1iwxQPhiUAe_euaccs';
const OMDBsearchURL = 'https://www.omdbapi.com/?apikey=2a2afcb2&t=';
const searchURL = 'https://www.googleapis.com/youtube/v3/search';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayMovieData(movie,trailers) {
    let html = '';
    if(movie.Error){
        html = `<p>${movie.Error} Type in a different movie name</p>`
    } else {
        html = `<h3>Movie Name: ${movie.Title}</h5><p>Plot: ${movie.Plot}</h3>
        <p>Year: ${movie.Year}</p>\n
        <h5>Trailers</h5>
        <hr>
        `;
        console.log(trailers);
        trailers.items.forEach( trailer =>{
            html = html + `<h5>${trailer.snippet.title}</h5><iframe width="200" height="200" src="https://www.youtube.com/embed/${trailer.id.videoId}"></iframe>`
        }
            
        )
    }

  $('#results').html(html);

}


function getMovieData(query) {

  const params = {
    key: apiKey,
    q: query + ' movie trailer',
    part: 'snippet',
    maxResults: 2,
    type: 'video'
  };
  let queryString = formatQueryParams(params)
  let OMDBurl = OMDBsearchURL + query;
  let YoutubeSearchUrl = searchURL + '?' + queryString;
  let movie = ''

  fetch(OMDBurl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.error);
    })
    .then(responseJson => {
      console.log(JSON.stringify(responseJson))
      movie = responseJson;
      return fetch(YoutubeSearchUrl);      
    })
    .then(data=> data.json())
    .then(trailers=>displayMovieData(movie,trailers) )
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