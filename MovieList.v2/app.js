const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIE_PER_PAGE = 12;
const movies = [];
let filtermovies = [];
const dataPanelCard = document.querySelector("#data-panel-card");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const dataPanelTable = document.querySelector("#data-panel-table");
const displayCard = document.querySelector("#display-card");
const displayTable = document.querySelector("#display-table");
const changeDisplayMode = document.querySelector("#change-mode");
let currentPage = 1;

//render每部電影 card
function renderMovieCard(data) {
  let renderHTML = "";

  data.forEach((item) => {
    // console.log(item);
    renderHTML += `
    <div class="col-6 col-md-3">
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
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </div>
        </div>`;
  });

  dataPanelCard.innerHTML = renderHTML;
  dataPanelTable.style.display = "none";
}

//render Movies by table
function renderMovieTable(data) {
  let tableHTML = `
  <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col-sm-1"><h4>#</h4></th>
              <th scope="col-sm-9"><h4>Movies</h4></th>

              <th scope="col-sm-2"><h4>Active</h4></th>
            </tr>
          </thead>
          <tbody id="data-panel-table">
  `;
  data.forEach((item) => {
    tableHTML += `
    <tr>
              <th scope="row"><h5>${item.id}</h5></th>
              <td><h5 class="card-title">${item.title}</h5></td>

              <td>
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}"
                >
                  More
                </button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </td>
            </tr>
    `;
  });
  tableHTML += `</tbody>
  </table>
  `;
  dataPanelTable.innerHTML = tableHTML;
  dataPanelCard.style.display = "none";
}
//點擊變換display
changeDisplayMode.addEventListener("click", (event) => {
  if (event.target.matches("#display-card")) {
    console.log("card-mode");
    renderMovieCard(getMoviesByPage(currentPage));
    dataPanelCard.style.display = "flex";
    dataPanelTable.style.display = "none";
  } else if (event.target.matches("#display-table")) {
    console.log("table-mode");
    renderMovieTable(getMoviesByPage(currentPage));
    dataPanelTable.style.display = "block";
    dataPanelCard.style.display = "none";
  }
});

//render每個分頁
function renderPaginator(amount) {
  //計算總分頁數量
  const numberOfPages = Math.ceil(amount / MOVIE_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

//more button modal每部電影詳細資料
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");
  const modalImage = document.querySelector("#movie-modal-image");
  axios.get(INDEX_URL + id).then((res) => {
    const data = res.data.results;
    console.log(data);
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

//加入我的最愛清單
function addToFavorite(id) {
  //先知道local storage的東西有什麼，key:favoriteMovies，沒有東西就是false，變成[]
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已在我的最愛清單中!");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
  console.log(list);
}

//more  + button設定
dataPanelCard.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});
dataPanelTable.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

//input就有submit的功能
searchInput.addEventListener("input", function onSearchInputSubmitted(event) {
  const keyword = searchInput.value.trim().toLowerCase();
  console.log(keyword);
  // let filtermovies = [];
  filtermovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword));
  if (dataPanelCard.style.display === "flex") {
    if (filtermovies.length === 0) {
      alert("Cannot find movies with " + keyword);
      searchInput.value = "";
      renderPaginator(movies.length);
      renderMovieCard(getMoviesByPage(1));
    } else {
      renderMovieCard(getMoviesByPage(1));
      renderPaginator(filtermovies.length);
      console.log(filtermovies);
    }
  } else if (dataPanelTable.style.display === "block") {
    if (filtermovies.length === 0) {
      alert("Cannot find movies with " + keyword);
      searchInput.value = "";
      renderPaginator(movies.length);
      renderMovieTable(getMoviesByPage(1));
    } else {
      renderMovieTable(getMoviesByPage(1));
      renderPaginator(filtermovies.length);
      console.log(filtermovies);
    }
  }
});

// 搜尋電影功能
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  console.log(keyword);

  //方法一
  //無法搜尋空字串
  // if (!keyword.length) {
  //   alert("Please enter a valid string!");
  // }
  //過濾符合搜尋電影
  // let filtermovies = [];
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filtermovies.push(movie);
  //   }
  // }

  //方法二
  filtermovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword));
  if (filtermovies.length === 0) {
    alert("Cannot find movies with " + keyword);
    searchInput.value = "";
    renderPaginator(movies.length);
    renderMovieCard(getMoviesByPage(1));
  } else {
    renderMovieCard(getMoviesByPage(1));
    renderPaginator(filtermovies.length);
  }
});

//點擊到不同分頁
paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return; //不是按到<a>就return
  const page = Number(event.target.dataset.page);
  currentPage = page;
  console.log(currentPage);
  if (dataPanelCard.style.display === "flex") {
    renderMovieCard(getMoviesByPage(currentPage));
    console.log("card");
  } else if (dataPanelTable.style.display === "block") {
    renderMovieTable(getMoviesByPage(currentPage));
  }
});

//分頁
function getMoviesByPage(page) {
  //getMoviesByPage有兩種情況，一種是movies分頁，一種是filtermovies分頁
  //所以movies與filtermovies都統稱data
  //分辨data是movies還是filtermovies，關鍵在於filtermovies的長度(搜尋有無結果)
  const data = filtermovies.length ? filtermovies : movies;
  //page 1 = movies[0]-[11]
  //page 2 = movies[12]-[23]
  //page 3 = movies[24]-[35]
  //...
  const startIndex = (page - 1) * MOVIE_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE);
}

// API網址取得movie資訊
axios.get(INDEX_URL).then((res) => {
  movies.push(...res.data.results);
  renderPaginator(movies.length);
  renderMovieCard(getMoviesByPage(currentPage));
  // renderMovieTable(getMoviesByPage(3));
});
// console.log(movies);
