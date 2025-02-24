async function getSongs() {
  const response = await fetch("lyrics.json");
  const songs = await response.json();
  songs.sort(() => Math.random() - 0.5);
  return songs;
}

function setupSelect(songs) {
  const select = document.getElementById("select");
  const sortedSongs = [...songs].sort((a, b) => a.name.localeCompare(b.name));
  sortedSongs.forEach((song) => {
    const option = document.createElement("option");
    option.value = song.name;
    option.textContent = song.name;
    select.appendChild(option);
  });
}

function play(songs) {
  const song = songs.shift();
  if (!song) {
    setTimeout(() => {
      showFinalModal();
    }, 4000);
    return;
  }
  const lines = song.lyrics.split("\n");
  const validLines = lines.filter((line) => {
    const trimmed = line.trim();
    if (songs.some((otherSong) => otherSong.lyrics.split("\n").some((line) => line.trim() === trimmed)))
      return false;
    return trimmed && !trimmed.startsWith("[") && trimmed.split(/\s+/).length >= 2;
  });
  const randomLine = validLines[Math.floor(Math.random() * validLines.length)];
  document.getElementById("quote").textContent = randomLine;

  document.getElementById("submit").remove();
  const newButton = document.createElement("button");
  newButton.id = "submit";
  newButton.type = "submit";
  newButton.textContent = "submit";
  document.getElementById("main-container").appendChild(newButton);
  function submitEvent() {
    const selectElement = document.getElementById("select");
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    selectElement.selectedIndex = 0;
    const guess = selectedOption.textContent;
    if (guess.toLowerCase() === song.name.toLowerCase()) {
      console.log(song.lyrics);
      showModal("correct!!");
    } else {
      console.log(song.lyrics);
      showModal("incorrect... the answer was " + song.name);
    }
    play(songs);
  }
  newButton.addEventListener("click", submitEvent);
  newButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitEvent();
  });
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

function showModal(title, text) {
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-text").textContent = text;
}

function showFinalModal() {}

document.addEventListener("DOMContentLoaded", async () => {
  const songs = await getSongs();
  setupModal();
  setupSelect(songs);
  play(songs);
});
