const BASE_URL = "https://user-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/users";
const SHOW_URL = BASE_URL + "/api/v1/users/";
const userCard = document.querySelector("#user-card");
const userModal = document.querySelector("#user-modal");

function makeCard(data) {
  let cardHTML = "";
  data.forEach((item) => {
    // console.log(item);
    cardHTML += `
    <div class="card col-sm-2 mb-1 p-0 m-1" id ="user-modal">
          <img
            src="${item.avatar}"
            class="card-img-top"
            alt="avatar"
            class="card-img-top"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-id="${item.id}"
          />
          <div class="card-body">
            <p class="card-title">${item.name}</p>
          </div>
    </div>
    `;
  });
  userCard.innerHTML = cardHTML;
}

function showUserInfo(id) {
  const name = document.querySelector("#name");
  const surname = document.querySelector("#surname");
  const email = document.querySelector("#email");
  const gender = document.querySelector("#gender");
  const age = document.querySelector("#age");
  const region = document.querySelector("#region");
  const birthday = document.querySelector("#birthday");
  const avatar = document.querySelector("#avatar");
  console.log(id);
  axios.get(SHOW_URL + id).then((res) => {
    console.log(res.data);
    name.innerText = "Name : " + res.data.name;
    surname.innerText = "Surname : " + res.data.surname;
    email.innerText = "Email : " + res.data.email;
    gender.innerText = "Gender : " + res.data.gender;
    age.innerText = "Age : " + res.data.age;
    region.innerText = "Region : " + res.data.region;
    birthday.innerText = "Birthday : " + res.data.birthday;
    avatar.innerHTML = `<img src="${res.data.avatar}" alt="avatar" class="img-fluid"/>`;
  });
}

userCard.addEventListener("click", function onUserClicked(event) {
  showUserInfo(Number(event.target.dataset.id));
});

axios.get(INDEX_URL).then((res) => {
  const users = [];
  users.push(...res.data.results);
  makeCard(users);
});
