const state = { 
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },

    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type')
    },

    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    },

    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    }
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }

    return cardImage;
}
//tudo ok ate aqui

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let ComputerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[ComputerCardId].img;

    let duelResults = await checkDuelResults(cardId, ComputerCardId);

    await updateScore();
    await drawButton(duelResults);

    console.log("Resultado do duelo:", duelResults);

}

async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(ComputerCardId)) {
        duelResults = "win";
        state.score.playerScore++;
    }
    if (playerCard.LoseOf.includes(ComputerCardId)) {
        duelResults = "lose";
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}


async function removeAllCardsImages() {
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

//aq tbm pra ajeitar
function nextDuel() {
    // limpa os campos
    state.fieldCards.player.src = "";
    state.fieldCards.computer.src = "";

    // esconde botão
    state.actions.button.style.display = "none";

    // redes4enha cartas
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
}

// Ativa o botão "Próxima Rodada"
state.actions.button.addEventListener("click", nextDuel);
//ate aqui

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status.toUpperCase()}.wav`);
    audio.volume = 0.8;

    try {
        await audio.play();
    } catch (err) {
        console.warn("Erro ao tocar som de efeito:", err);
    }
}

document.addEventListener("click", function playBGMOnce() {
    const bgm = document.getElementById("bgm");
    bgm.volume = 0.5; // volume opcional
    bgm.play();
    document.removeEventListener("click", playBGMOnce); // toca só uma vez
});

function init() {
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
    updateScore();
}
init();
