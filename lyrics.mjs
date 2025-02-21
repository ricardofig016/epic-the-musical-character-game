async function getLyrics() {
  const response = await fetch("lyrics.json");
  return await response.json();
}

document.addEventListener("DOMContentLoaded", async () => {
  const lyrics = await getLyrics();
  console.log(lyrics[0]);
});
