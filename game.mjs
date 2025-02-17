async function getCharacters() {
  const response = await fetch("characters.json");
  const characters = await response.json();
  characters.sort(() => Math.random() - 0.5);
  return characters.slice(0, 10);
}

function setupModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("modal-close").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.getElementById("modal").classList.add("hidden");
  });
}

function showModal(imgSrc, title, text) {
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal-img").src = imgSrc;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-text").textContent = text;
}

function showFinalModal() {
  if (score < -10)
    showModal(
      memesPath + "angrytrain.jpg",
      "this was a disgrace",
      "you should be ashamed of yourself - final score: " + score
    );
  else if (score <= 0)
    showModal(
      memesPath + "sideeye.jpg",
      "hmmmm ok...",
      "thats not the best score is it - final score: " + score
    );
  else if (score > 0)
    showModal(memesPath + "absolutecinema.webp", "amazing", "good job - final score: " + score);
}

function loadCharacter(characters) {
  const character = characters.shift();
  if (!character) {
    setTimeout(() => {
      showFinalModal();
    }, 4000);
    return;
  }
  const oldMainContainer = document.getElementById("main-container");
  const newMainContainer = oldMainContainer.cloneNode(true);
  oldMainContainer.parentNode.replaceChild(newMainContainer, oldMainContainer);
  document.getElementById("character-image").src = `images/characters/${character.name}.webp`;
  document.getElementById("guess").value = "";
  function submitEvent() {
    const guess = document.getElementById("guess").value.toLowerCase();
    character.name = character.name.toLowerCase();
    if (guess === character.name) {
      showModal(memesPath + "thumbsup.jpeg", "correct!!", "ezpz (+3)");
      score += 3;
      updateScore();
    } else {
      const levenshtein = (s, t) => {
        if (!s.length) return t.length;
        if (!t.length) return s.length;
        const arr = [];
        for (let i = 0; i <= t.length; i++) {
          arr[i] = [i];
          for (let j = 1; j <= s.length; j++) {
            arr[i][j] =
              i === 0
                ? j
                : Math.min(
                    arr[i - 1][j] + 1,
                    arr[i][j - 1] + 1,
                    arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                  );
          }
        }
        return arr[t.length][s.length];
      };
      const distance = levenshtein(guess, character.name);
      console.log("distance:", distance);
      if (distance <= 2) {
        showModal(memesPath + "meh.jpg", "close enough", guess + " → " + character.name + " (+0)");
      } else {
        showModal(memesPath + "wtf.jpg", "girl...", guess + " → " + character.name + " (-3)");
        score -= 3;
        updateScore();
      }
    }
    loadCharacter(characters);
  }
  document.getElementById("submit").addEventListener("click", submitEvent);
  document.getElementById("guess").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && document.getElementById("modal").classList.contains("hidden")) {
      e.preventDefault();
      submitEvent();
    }
  });
  document.getElementById("hints-container").innerHTML = "";
  document.getElementById("hint").classList.remove("disabled");
  document.getElementById("hint-score-penalty").innerText = "-2";
  let hints = 0;
  document.getElementById("hint").addEventListener("click", () => {
    if (hints >= character.hints.length) return;
    const p = document.createElement("p");
    p.textContent = character.hints[hints++];
    document.getElementById("hints-container").appendChild(p);
    if (hints === 1) {
      score -= 2;
      updateScore();
      document.getElementById("hint-score-penalty").innerText = "-2";
    } else if (hints === 2) {
      score -= 2;
      updateScore();
      document.getElementById("hint").classList.add("disabled");
      document.getElementById("hint-score-penalty").innerText = "";
    }
  });
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

const memesPath = "images/memes/";
let score = 0;
updateScore();
document.addEventListener("DOMContentLoaded", async () => {
  setupModal();
  const characters = await getCharacters();
  loadCharacter(characters, true);
});
