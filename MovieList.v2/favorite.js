const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = JSON.parse(localStorage.getItem("favoriteMovies"));
const dataPanelCard = document.querySelector("#data-panel-card");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

//render每部電影
function renderMovieList(data) {
  let renderHTML = "";
  data.forEach((item) => {
    // console.log(item);
    renderHTML += `
    <div class="col-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
              </div>
            </div>
          </div>
        </div>`;
  });

  dataPanelCard.innerHTML = renderHTML;
}

//more button modal每部電影詳細資料
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  const modalImage = document.querySelector("#movie-modal-image");
  axios.get(INDEX_URL + id).then((res) => {
    const data = res.data.results;
    // console.log(data);
    modalTitle.innerText = data.title;
    modalDate.innerText = "release date : " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img
    src="${POSTER_URL + data.image}"
    alt="Movie Poster"
    class="img-fluid"
  />`;
  });
}

//more button設定
dataPanelCard.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

//從我的最愛清單中移除
function removeFromFavorite(id) {
  //因為刪除清單任一電影，需要知道電影的index
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  console.log(movieIndex);
  //刪除該筆電影
  movies.splice(movieIndex, 1);
  //存回 local storage
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  renderMovieList(movies);
}

renderMovieList(movies);
