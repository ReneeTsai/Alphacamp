const URL = "https://randomuser.me/api/";
const URL_mount = URL + "?results=30";
const friends = JSON.parse(localStorage.getItem("favoriteFriend"));
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const showFriend = document.querySelector(".btn-show-friend");
const searchInput = document.querySelector("#search-input");
const addFavoriteFriend = document.querySelector(".btn-add-favorite");

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
                <button class="btn btn-danger btn-sm btn-remove-favorite" data-id="${item.id.name}${item.id.value}">刪除好友清單</button>
              </div>
            </div>
          </div>
        </div>`;
    }
  });

  dataPanel.innerHTML = friendHTML;
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
//從我的最愛好友清單移除
function toRemoveFavoriteFriend(index) {
  // 找出點擊的好友list[index]
  // const friendIndex = friends.findIndex((friend) => friend.id.value === friends[index].id.value);
  // console.log(friendIndex);
  friends.splice(index, 1);
  console.log(friends);
  localStorage.setItem("favoriteFriend", JSON.stringify(friends));
  renderFriendList(friends);
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
  } else if (event.target.matches(".btn-remove-favorite")) {
    const id = event.target.dataset.id;
    const index = friends.findIndex((friend) => friend.id.name + friend.id.value === id);
    console.log(index);
    // 獲取點擊的資料;
    const clickedData = friends[index];
    // console.log(clickedData);
    toRemoveFavoriteFriend(index);
  }
});

renderFriendList(friends);
