// one colour + emoji per world, used on the book covers
const themes = {
  "Floating Kingdom": { emoji: "🏰", c1: "#7c4dff", c2: "#2e9bff" },
  "Whispering Woods": { emoji: "🌲", c1: "#1fa56b", c2: "#0b4f5c" },
  "Underwater City": { emoji: "🌊", c1: "#00b4d8", c2: "#1d3fbf" },
  "Candy Land": { emoji: "🍭", c1: "#ff5ea8", c2: "#b04bff" },
  "Snowy Mountains": { emoji: "🏔️", c1: "#8ecbff", c2: "#5a5fd8" },
}

const fallback = { emoji: "📖", c1: "#7c4dff", c2: "#ff3c96" }

export function getTheme(world) {
  return themes[world] ?? fallback
}