const STORAGE_KEY = "books"

export function getBooks() {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const books = stored ? JSON.parse(stored) : []
    return Array.isArray(books) ? books : []
  } catch {
    return []
  }
}

function writeBooks(books) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  } catch {
    throw new Error("Could not save the book in this browser (storage is full or blocked).")
  }
}

export function saveBook(book) {
  // newest book goes first; createdAt lets us show the date on the card
  const saved = { createdAt: Date.now(), ...book }
  writeBooks([saved, ...getBooks()])
}

export function getBookById(id) {
  return getBooks().find((book) => book.id === id) ?? null
}

export function deleteBook(id) {
  writeBooks(getBooks().filter((book) => book.id !== id))
}

export function deleteAllBooks() {
  writeBooks([])
}

export function toggleFavorite(id) {
  writeBooks(
    getBooks().map((book) =>
      book.id === id ? { ...book, favorite: !book.favorite } : book
    )
  )
}