'use strict';


const apiKey = 'AIzaSyBhr6VWsoOfF4LJbYkZAP1cTgsLyKW42GU';
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
        html = `
          <section class="movie-header">
            <div class="movie-title">
                <h2 class="title">${movie.Title}</h2>
            </div>
            <div class="back" >
                <button class="back-to-list"><i class="fas fa-chevron-left"></i>Back to top movies list</button>
            </div >
          </section>
          <div class="movie-image">
          <img src="${movie.Poster}" alt="${movie.Title} photo">
          </div>
          <p>Plot: ${movie.Plot}</p>
          <p>Cast: ${movie.Actors}</p>
          <p>Genre: ${movie.Genre}</p>
          <p>Rated: ${movie.Rated}</p>
          <p>Movie Score: ${movie.Ratings[0].Value}</p>
          <p>Runtime: ${movie.Runtime}</p>
          <p>Year: ${movie.Year}</p>
          <h2>Trailers</h2>
          <hr>
        `;
        trailers.items.forEach( trailer =>{
            html = html + `
            <figure>
                <iframe height="300" style="width:100%;" src="https://www.youtube.com/embed/${trailer.id.videoId}"></iframe>
                <figcaption>${trailer.snippet.title}</figcaption>
            </figure>`
        }
            
        )
    }

  $('.movie-info').html(html);

}


function getMovieData(query) {

  const params = {
    key: apiKey,
    q: query + ' movie trailer',
    part: 'snippet',
    maxResults: 2,
    type: 'video'
  };
  let queryString = '';
  let OMDBurl = OMDBsearchURL + query;
  let YoutubeSearchUrl = "";
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
      params.q = params.q + ` ${movie.Year}`;
      queryString = formatQueryParams(params);
      YoutubeSearchUrl = searchURL + '?' + queryString;
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
    $('.movie-info').html("<div style='text-align: center'><h2>Loading...</h2></div>");
    getMovieData(searchTerm);
    $(".top-movies").hide();
  });

  $("ol").on("click","a", function(){
    event.preventDefault();
    const listTerm = $(this).text();
    $('.movie-info').html("<div style='text-align: center'><h2>Loading...</h2></div>");
    getMovieData(listTerm);
    $(".top-movies").hide();
 });
 $(".movie-info").on("click","button", function(){
    event.preventDefault();
    $('.movie-info').html(" ");
    $(".top-movies").show();
 });

}

$(watchForm);