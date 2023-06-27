//設定四個花色 spade/ heart/ diamond/ club
const Symbols = [
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png",
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png",
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png",
  "https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png",
];

//設定遊戲五種state
const GAME_STATE = {
  FirstCardAwaites: "FirstCardAwaites",
  SecondCardAwaites: "SecondCardAwaites",
  CardMatchedFailed: "CardMatchedFailed",
  CardMatched: "CardMatched",
  GameFinished: "GameFinished",
};

// MVC (Model-View-Controller)
//跟呈現有關的事情
const view = {
  // 原本的寫法  displayCards: function displayCards() { ...  }
  // 省略的寫法 :

  getCardElement(index) {
    return `<div class="card back" data-index="${index}"></div>`;
  },
  getCardContent(index) {
    //共有 52 張卡片，4種花色*13，在設計程式碼如要思考花色及數字大小，程式碼會相對複雜。
    //因此直接用[index] 0-51 來進行換算。
    const number = this.transformNumber((index % 13) + 1);
    const symbol = Symbols[Math.floor(index / 13)];
    return `<p>${number}</p>
        <img
          src="${symbol}"
          alt="card" />
        <p>${number}</p>`;
  },
  transformNumber(number) {
    switch (number) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return number;
    }
  },
  displayCard(indexes) {
    const rootElement = document.querySelector("#cards");
    rootElement.innerHTML = indexes.map((index) => this.getCardElement(index)).join("");
  },

  flipCards(...cards) {
    cards.map((card) => {
      //如果是背面(getCardElement)-->回傳正面(牌面內容 : 數字和花色)
      if (card.classList.contains("back")) {
        card.classList.remove("back");
        card.innerHTML = this.getCardContent(Number(card.dataset.index));
        return;
      }
      //如果是正面(getCardContent)-->重新覆蓋卡片(把牌面內容清除，重新呼叫牌背樣式)
      card.classList.add("back");
      card.innerHTML = null;
    });
  },
  pairCards(...cards) {
    cards.map((card) => {
      card.classList.add("paired");
    });
  },
  //分數及嘗試次數
  renderScore(score) {
    document.querySelector(".score").textContent = `Score : ${score}`;
  },
  renderTriedTimes(times) {
    document.querySelector(".tried-times").textContent = `You've tried : ${times} times`;
  },
  appendWrongAnimation(...cards) {
    cards.map((card) => {
      card.classList.add("wrong");
      card.addEventListener("animationend", (event) => event.target.classList.remove("wrong"), {
        once: true,
      });
    });
  },
  showGameFinished() {
    const div = document.createElement("div");
    div.classList.add("completed");
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `;
    const header = document.querySelector("header");
    header.before(div);
  },
};

//洗牌
const utility = {
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys());
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1));
      [number[index], number[randomIndex]] = [number[randomIndex], number[index]];
    }
    return number;
  },
};
//跟資料有關的東西
const model = {
  revealedCards: [],
  isReaveledCardMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13;
  },
  score: 0,
  triedTimes: 0,
};

//跟操作有關的事情
//基本上view跟model都是透過controller觸發動作
const controller = {
  //定義遊戲狀態
  //定義遊戲初始狀態
  currentState: GAME_STATE.FirstCardAwaites,

  //洗牌/發牌功能
  generateCards() {
    view.displayCard(utility.getRandomNumberArray(52));
  },
  //依照遊戲不同狀態，做不同行為
  dispatchCardActive(card) {
    //如果牌已經被翻開了(正面:沒有.back)，則點擊卡片不會有反應
    if (!card.classList.contains("back")) {
      return;
    }
    switch (this.currentState) {
      //如果狀態為等待翻開第一張牌
      case GAME_STATE.FirstCardAwaites:
        //翻開第一張牌，存入revealedCards: []，狀態變為等待第二張牌
        view.flipCards(card);
        model.revealedCards.push(card);
        this.currentState = GAME_STATE.SecondCardAwaites;
        break;
      //如果狀態為等待翻開第二張牌
      case GAME_STATE.SecondCardAwaites:
        //翻開第二張牌，存入revealedCards: []，判斷是否配對成功
        console.log("triedTimes++");
        view.renderTriedTimes(++model.triedTimes);
        view.flipCards(card);
        model.revealedCards.push(card);
        if (model.isReaveledCardMatched()) {
          //配對正確，狀態為卡片配對成功，卡片顏色灰底，狀態變為等待第一張牌
          view.renderScore((model.score += 10));
          this.currentState = GAME_STATE.CardMatched;
          view.pairCards(...model.revealedCards);
          model.revealedCards = [];
          if (model.score === 260) {
            console.log("showGameFinished");
            this.currentState = GAME_STATE.GameFinished;
            view.showGameFinished(); // 加在這裡
            return;
          }
          this.currentState = GAME_STATE.FirstCardAwaites;
        } else {
          //配對失敗
          this.currentState = GAME_STATE.CardMatchedFailed;
          view.appendWrongAnimation(...model.revealedCards); //錯誤動畫黃框閃爍
          //setTimeout(handler,times),因此this.setCard不加()
          setTimeout(this.resetCards, 1000);
        }
    }
    console.log(this.currentState);
    console.log(model.revealedCards);
  },
  //配對失敗後，重新翻回
  resetCards() {
    view.flipCards(...model.revealedCards);
    model.revealedCards = [];
    controller.currentState = GAME_STATE.FirstCardAwaites;
  },
};
//統一呼叫controller函式
controller.generateCards();
//設定卡片點擊事件&翻牌--綁定事件監聽器(所有card)
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", (event) => {
    controller.dispatchCardActive(card);
  });
});
