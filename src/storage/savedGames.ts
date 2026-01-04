export const saveGame = (fen: string) => {
  const saved = JSON.parse(localStorage.getItem("savedGames") || "[]");
  saved.push({ fen, date: new Date().toISOString() });
  localStorage.setItem("savedGames", JSON.stringify(saved));
};

export const loadGames = () => JSON.parse(localStorage.getItem("savedGames") || "[]");