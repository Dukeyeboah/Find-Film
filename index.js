const search = document.getElementById("search-btn")
const searchInput = document.getElementById("search-input")
const movieResults = document.getElementById("movie-results")
const watchlistOrSearchBtn = document.getElementById("switch-view-btn")
const watchlistMovieResults = document.getElementById("watchlist-movie-results")
const searchRegion = document.getElementById("search-region")
let movieHtml = ''
let movieWatchlistHtmlArray = []

// Load watchlist from localStorage
const watchlistFromStorage = localStorage.getItem('myWatchlist')
if (watchlistFromStorage) {
  movieWatchlistHtmlArray = JSON.parse(watchlistFromStorage)
  renderMyWatchlist(movieWatchlistHtmlArray)
}

//initiate page switch on button click
watchlistOrSearchBtn.addEventListener('click', pageSwitch)
//allow the input field to activate search button when 'Enter' key is hit
searchInput.addEventListener("keyup", function(e){
    e.preventDefault()
    if (e.keyCode === 13) {
        search.click()
    }
})

search.addEventListener("click", searchMovies) //searches input movie

//retrieve movie API(by search)- `https://www.omdbapi.com/?s=${searchInput.value}&apikey=c4601a05`
//retrieve movie API(by type)- `https://www.omdbapi.com/?t=${searchInput.value}&apikey=c4601a05`
async function searchMovies() {
    try {
        const res = await fetch(`https://www.omdbapi.com/?t=${searchInput.value}&apikey=c4601a05`)
        const mov = await res.json()
        if (!mov.Title) {
            movieHtml = `<div class="movie-data">
                              <h1> Movie Couldn't be Found. Try New Search</h1>
                          </div>
                         `
            movieResults.innerHTML = movieHtml
        } else {
            movieHtml = `<div class="movie-data"> 
                            <div id="movie-poster">
                                <img class="poster" src="${mov.Poster}">
                            </div>
                            <div class="info">
                                <div class="name-rating">
                                    <h3>${mov.Title}</h3>
                                    <i class="fa-solid fa-star fa-sm" style="color: #fbff00;"></i>
                                    <p>${mov.imdbRating}</p>
                                </div>
                                <div class="additional-info">
                                    <p>${mov.Runtime}</p>
                                    <p>${mov.Genre}</p>
                                    <div id="add-watchlist" class="watchlist">
                                        <i class="fa-solid fa-plus"></i>
                                        <p id="watchlist-link">Watchlist</a>
                                    </div>
                                </div>
                                <p class="plot">${mov.Plot}</p>
                            </div>
                        </div>
                        <hr class="line"> 
                        `
            movieResults.innerHTML = movieHtml
            document.getElementById("add-watchlist").addEventListener("click", function () {
                if (!movieWatchlistHtmlArray.includes(movieHtml)) {
                    movieWatchlistHtmlArray.push(movieHtml)
                    localStorage.setItem('myWatchlist', JSON.stringify(movieWatchlistHtmlArray))
                    renderMyWatchlist(movieWatchlistHtmlArray)
                    // renderMyWatchlist(JSON.parse(localStorage.getItem('myWatchlist')))
                    // console.log(movieWatchlistHtmlArray)
                }
            })
        }

        searchInput.value = ""
    } catch (err) {
        console.log(err)
    }
}

//render the watchlist from the array of selected movies html
function renderMyWatchlist(watchlistHtmlArray){ 
     const myFinalWatchlist = watchlistHtmlArray.map((item)=>{
                              return item }).join('')
     watchlistMovieResults.innerHTML = myFinalWatchlist
}
//switch pages from movie search to watchlist
function pageSwitch(){
    if (watchlistOrSearchBtn.textContent === 'My watchlist'){
        watchlistOrSearchBtn.textContent = 'Search for movies'
        searchRegion.classList.add("hidden")
        document.getElementById("movie-results").classList.add("hidden")
        document.getElementById("watchlist-movie-results").classList.remove("hidden")
    }else if(watchlistOrSearchBtn.textContent === 'Search for movies'){
        watchlistOrSearchBtn.textContent = 'My watchlist'
        searchRegion.classList.remove("hidden")
        document.getElementById("movie-results").classList.remove("hidden")
        document.getElementById("watchlist-movie-results").classList.add("hidden")
    }
}