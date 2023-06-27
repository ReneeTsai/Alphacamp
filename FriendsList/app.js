const URL = "https://randomuser.me/api/";
const URL_mount = URL + "?results=100";
const friends = [];
let filterFriend = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const showFriend = document.querySelector(".btn-show-friend");
const searchInput = document.querySelector("#search-input");
const addFavoriteFriend = document.querySelector(".btn-add-favorite");
const FRIEND_PER_PAGE = 12;
const paginator = document.querySelector("#paginator");

//render friends list
function renderFriendList(data) {
  let friendHTML = "";
  data.forEach((item) => {
    if (!item.id.value) {
      return;
    } else {
      const name = item.name.first + " " + item.name.last;
      friendHTML += `
    <div class="col-sm-2">
          <div class="mb-2">
            <div class="card">
              <img
                src="${item.picture.medium}"
                class="card-img-top"
                alt="Movie Poster"
              />
              <div class="card-body">
                <p class="card-title">${name}</p>
              </div>
              <div class="card-footer">
                <button
                  class="btn btn-warning btn-sm mb-1 btn-show-friend"
                  data-bs-toggle="modal"
                  data-bs-target="#friend-modal"
                  data-id="${item.id.name}${item.id.value}"
                >
                  詳細資料
                </button>
                <button class="btn btn-info btn-sm btn-add-favorite" data-id="${item.id.name}${item.id.value}">加入好友清單</button>
              </div>
            </div>
          </div>
        </div>`;
    }
  });

  dataPanel.innerHTML = friendHTML;
}

//render paginator list
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / FRIEND_PER_PAGE);
  // console.log(numberOfPages);
  let pageHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    pageHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `;
  }
  paginator.innerHTML = pageHTML;
}

//friend modal
function showFriendModal(index) {
  const friend = friends[index];
  const name = document.querySelector("#friend-modal-name");
  const age = document.querySelector("#friend-modal-age");
  const gender = document.querySelector("#friend-modal-gender");
  const email = document.querySelector("#friend-modal-email");
  const picture = document.querySelector("#friend-modal-picture");
  name.innerText = "Name : " + friend.name.first + " " + friend.name.last;
  age.innerText = "Age : " + friend.age;
  gender.innerText = "Gender : " + friend.gender;
  email.innerText = "E-mail : " + friend.email;
  picture.innerHTML = `<img
  src="${friend.picture.large}"
  alt="Picture"
  class="img-fluid"
/>`;
}

//add favorite friend
function addToFavoriteFriend(index) {
  const list = JSON.parse(localStorage.getItem("favoriteFriend")) || [];
  const friend = friends.find((friend) => friend.id.value === friends[index].id.value);
  console.log(friend.id.value);
  console.log(friends[index].id.value);
  if (list.some((friend) => friend.id.value === friends[index].id.value)) {
    // console.log(friends[index].id);
    return alert("此朋友已在我的最愛清單中!");
  }
  list.push(friend);
  localStorage.setItem("favoriteFriend", JSON.stringify(list));
  console.log(list);
}

//panel bottun
dataPanel.addEventListener("click", (event) => {
  if (event.target.matches(".btn-show-friend")) {
    const id = event.target.dataset.id;
    const index = friends.findIndex((friend) => friend.id.name + friend.id.value === id);
    // console.log(index);
    //獲取點擊的資料
    const clickedData = friends[index];
    // console.log(clickedData);
    showFriendModal(index);
  } else if (event.target.matches(".btn-add-favorite")) {
    const id = event.target.dataset.id;
    const index = friends.findIndex((friend) => friend.id.name + friend.id.value === id);
    // console.log(index);
    // 獲取點擊的資料;
    const clickedData = friends[index];
    // console.log(clickedData);
    addToFavoriteFriend(index);
  }
});
//serch friend
searchInput.addEventListener("input", function onSearchInputSubmitted(event) {
  const keyword = searchInput.value.trim().toLowerCase();
  // console.log(keyword);
  filterFriend = friends.filter((friend) => friend.name.first.toLowerCase().includes(keyword));
  if (filterFriend.length === 0) {
    alert("Cannot find movies with " + keyword);
    searchInput.value = "";
    renderPaginator(movies.length);
    renderMovieList(getMoviesByPage(1));
  } else {
    console.log(filterFriend);
    renderFriendList(getfriendByPage(1));
    renderPaginator(filterFriend.length);
  }
});

//點擊分頁
paginator.addEventListener("click", (event) => {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  renderFriendList(getfriendByPage(page));
});
//分頁
function getfriendByPage(page) {
  const data = filterFriend.length ? filterFriend : friends;
  const startIndex = (page - 1) * FRIEND_PER_PAGE;
  return data.slice(startIndex, startIndex + FRIEND_PER_PAGE);
}

axios.get(URL_mount).then((res) => {
  friends.push(...res.data.results);
  console.log(friends);
  //   console.log(friends.map((friend) => friend.name.first));
  renderFriendList(getfriendByPage(1));
  renderPaginator(friends.length);
});
