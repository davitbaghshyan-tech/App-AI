"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import {
  getBooks,
  deleteBook,
  deleteAllBooks,
  toggleFavorite,
} from "@/services/storage"
import { getTheme } from "@/features/books/theme"
import "./adventures.css"

function BookCard({
  book,
  confirming,
  onAskDelete,
  onCancel,
  onDelete,
  onFavorite,
}) {
  const theme = getTheme(book.world)
  const date = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString()
    : null

  return (
    <article
      className="book-card"
      style={{ "--c1": theme.c1, "--c2": theme.c2 }}
    >
      <Link className="book-link" href={`/book/${book.id}`}>
        <div className="book-cover">
          <span className="book-mood">{book.mood}</span>
          <span className="book-emoji" aria-hidden="true">{theme.emoji}</span>
          <h2 className="book-cover-title">{book.title}</h2>
        </div>

        <div className="book-info">
          <p className="book-hero">{book.character_name}</p>
          <p className="book-meta">
            {book.world} · {book.pages?.length ?? book.page_count} pages
            {date && ` · ${date}`}
          </p>
        </div>
      </Link>

      {confirming ? (
        <div className="book-confirm">
          <span>Delete this book?</span>
          <button className="book-yes" onClick={onDelete}>Yes</button>
          <button className="book-no" onClick={onCancel}>No</button>
        </div>
      ) : (
        <>
          <button
            className={`book-fav${book.favorite ? " is-on" : ""}`}
            onClick={onFavorite}
            aria-pressed={Boolean(book.favorite)}
            aria-label={
              book.favorite
                ? `Remove ${book.title} from favorites`
                : `Add ${book.title} to favorites`
            }
          >
            {book.favorite ? "★" : "☆"}
          </button>
          <button
            className="book-delete"
            onClick={onAskDelete}
            aria-label={`Delete ${book.title}`}
          >
            🗑
          </button>
        </>
      )}
    </article>
  )
}

export default function AdventuresPage() {
  const [books, setBooks] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [confirmAll, setConfirmAll] = useState(false)
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("newest")
  const [onlyFavs, setOnlyFavs] = useState(false)

  useEffect(() => {
    setBooks(getBooks())
    setLoaded(true)
  }, [])

  const favCount = books.filter((b) => b.favorite).length

  // search + favorites filter, then sort
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()

    const list = books.filter((b) => {
      if (onlyFavs && !b.favorite) return false
      if (!q) return true
      return [b.title, b.character_name, b.world, b.mood].some((value) =>
        String(value ?? "").toLowerCase().includes(q)
      )
    })

    // books are stored newest first, so "oldest" is just the reverse
    if (sort === "oldest") list.reverse()
    if (sort === "az") {
      list.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""))
    }
    return list
  }, [books, query, sort, onlyFavs])

  function handleDelete(id) {
    deleteBook(id)
    setBooks(getBooks())
    setConfirmId(null)
  }

  function handleFavorite(id) {
    toggleFavorite(id)
    setBooks(getBooks())
  }

  function handleDeleteAll() {
    deleteAllBooks()
    setBooks([])
    setConfirmId(null)
    setConfirmAll(false)
  }

  return (
    <main className="library">
      <Link className="top-link" href="/create">← Create</Link>

      <header className="library-head">
        <p className="library-eyebrow">Your library</p>
        <h1>
          My <span>Adventures</span>
        </h1>
        <p className="library-lead">Stories saved in this browser.</p>
      </header>

      {!loaded && <p className="library-note">Loading books...</p>}

      {loaded && books.length === 0 && (
        <div className="library-empty">
          <p>No adventures yet.</p>
          <Link className="library-button" href="/create">
            Create your first story →
          </Link>
        </div>
      )}

      {books.length > 0 && (
        <div className="library-toolbar">
          <input
            className="library-search"
            type="search"
            placeholder="Search title, hero, world, mood..."
            aria-label="Search adventures"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="library-select"
            aria-label="Sort adventures"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">A – Z</option>
          </select>

          <button
            className={`library-fav${onlyFavs ? " is-active" : ""}`}
            aria-pressed={onlyFavs}
            onClick={() => setOnlyFavs((v) => !v)}
          >
            ★ Favorites ({favCount})
          </button>
        </div>
      )}

      {books.length > 0 && visible.length === 0 && (
        <p className="library-note">
          {onlyFavs && !query
            ? "No favorites yet. Tap the ☆ on a book to add one."
            : "No books match your search."}
        </p>
      )}

      <div className="book-grid">
        {visible.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            confirming={confirmId === book.id}
            onAskDelete={() => setConfirmId(book.id)}
            onCancel={() => setConfirmId(null)}
            onDelete={() => handleDelete(book.id)}
            onFavorite={() => handleFavorite(book.id)}
          />
        ))}
      </div>

      {books.length > 0 && (
        <div className="library-actions">
          <Link className="library-button" href="/create">
            + New adventure
          </Link>

          {confirmAll ? (
            <div className="library-confirm">
              <span>Delete all {books.length} adventures?</span>
              <button className="library-yes" onClick={handleDeleteAll}>
                Yes, delete all
              </button>
              <button onClick={() => setConfirmAll(false)}>Cancel</button>
            </div>
          ) : (
            <button
              className="library-danger"
              onClick={() => setConfirmAll(true)}
            >
              🗑 Delete all
            </button>
          )}
        </div>
      )}
    </main>
  )
}
