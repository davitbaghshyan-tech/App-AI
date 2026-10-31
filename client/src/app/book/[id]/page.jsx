"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import { getBookById, toggleFavorite } from "@/services/storage"
import { getTheme } from "@/features/books/theme"
import "./reader.css"

function BookReader({ book }) {
  const [page, setPage] = useState(0)
  const [favorite, setFavorite] = useState(Boolean(book.favorite))
  const [speaking, setSpeaking] = useState(false)
  const [canSpeak, setCanSpeak] = useState(false)
  const [notice, setNotice] = useState("")
  const readId = useRef(0)
  const voiceRef = useRef(null)

  const { title, pages, world, character_name } = book
  const theme = getTheme(world)
  const last = pages.length - 1

  // the browser's text-to-speech is not available everywhere
  useEffect(() => {
    if (!("speechSynthesis" in window)) return
    setCanSpeak(true)

    const synth = window.speechSynthesis

    // voices load a moment after the page opens, so we listen for them
    function loadVoices() {
      const voices = synth.getVoices()
      voiceRef.current =
        voices.find((v) => v.lang.toLowerCase().startsWith("en") && v.default) ||
        voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
        null
    }

    loadVoices()
    synth.addEventListener("voiceschanged", loadVoices)
    return () => synth.removeEventListener("voiceschanged", loadVoices)
  }, [])

  // arrow keys turn the pages
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, last))
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 0))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [last])

  // stop reading when the page changes or the reader closes
  useEffect(() => {
    return () => {
      readId.current += 1
      if ("speechSynthesis" in window) window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [page])

  function stopReading() {
    readId.current += 1
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  function startReading() {
    const synth = window.speechSynthesis
    setNotice("")

    readId.current += 1
    const myId = readId.current
    if (synth.speaking || synth.pending) synth.cancel()

    // reading sentence by sentence avoids Chrome cutting off long text
    const text = pages[page]
    const sentences = text.match(/[^.!?]+[.!?]+["”')]*\s*|[^.!?]+$/g) ?? [text]
    const voice = voiceRef.current

    sentences.forEach((sentence, i) => {
      const utterance = new SpeechSynthesisUtterance(sentence.trim())
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
      } else {
        utterance.lang = "en-US"
      }
      utterance.rate = 0.95

      utterance.onerror = (event) => {
        if (readId.current !== myId) return
        if (event.error !== "canceled" && event.error !== "interrupted") {
          setNotice(
            `Read aloud failed (${event.error}). Try Chrome or Edge, and check that an English voice is installed.`
          )
        }
        setSpeaking(false)
      }

      if (i === sentences.length - 1) {
        utterance.onend = () => {
          if (readId.current === myId) setSpeaking(false)
        }
      }

      synth.speak(utterance)
    })

    setSpeaking(true)

    // if nothing started, say so instead of failing silently
    setTimeout(() => {
      if (readId.current === myId && !synth.speaking && !synth.pending) {
        setSpeaking(false)
        setNotice(
          "No sound started. Your browser may have no English voice installed."
        )
      }
    }, 1500)
  }

  function handleFavorite() {
    toggleFavorite(book.id)
    setFavorite((value) => !value)
  }

  function downloadTxt() {
    try {
      const lines = [title, `${character_name} · ${world}`, ""]
      pages.forEach((text, i) => lines.push(`Page ${i + 1}`, text, ""))

      // BOM + Windows line breaks so Notepad shows the text correctly
      const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {
        type: "text/plain;charset=utf-8",
      })
      const url = URL.createObjectURL(blob)
      const slug =
        title
          .toLowerCase()
          .replace(/[^\p{L}\p{N}]+/gu, "-")
          .replace(/^-|-$/g, "") || "story"
      const fileName = `${slug}.txt`

      // the link must be in the page for some browsers to start the download
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)

      setNotice(`Saved as ${fileName}. Check your Downloads folder.`)
    } catch (error) {
      console.error(error)
      setNotice("Download failed. Check that your browser allows downloads.")
    }
  }

  return (
    <article
      className="reader-book"
      style={{ "--c1": theme.c1, "--c2": theme.c2 }}
    >
      <header className="reader-head">
        <span className="reader-emoji" aria-hidden="true">{theme.emoji}</span>
        <h1>{title}</h1>
        <p>
          {character_name} · {world}
        </p>
      </header>

      <div className="reader-tools">
        <button
          className={favorite ? "is-on" : ""}
          aria-pressed={favorite}
          onClick={handleFavorite}
        >
          {favorite ? "★ Favorite" : "☆ Favorite"}
        </button>

        {canSpeak && (
          <button onClick={speaking ? stopReading : startReading}>
            {speaking ? "⏹ Stop" : "🔊 Read aloud"}
          </button>
        )}

        <button onClick={downloadTxt}>⬇ Download .txt</button>
        <button onClick={() => window.print()}>🖨 Print / PDF</button>
      </div>

      {notice && (
        <p className="reader-notice" role="status">
          {notice}
        </p>
      )}

      <div className="reader-paper">
        <p key={page} className="reader-text">
          {pages[page]}
        </p>
        <span className="reader-count">
          Page {page + 1} of {pages.length}
        </span>
      </div>

      <div className="reader-progress" aria-hidden="true">
        <div
          className="reader-progress-bar"
          style={{ width: `${((page + 1) / pages.length) * 100}%` }}
        />
      </div>

      <div className="reader-controls">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          ← Previous
        </button>
        <button disabled={page === last} onClick={() => setPage((p) => p + 1)}>
          Next →
        </button>
      </div>

      {page === last && (
        <p className="reader-end">
          ✦ The End ✦
          <Link href="/create">Write another adventure</Link>
        </p>
      )}

      {/* only visible when printing: the whole story on plain paper */}
      <div className="print-story">
        <h1>{title}</h1>
        <p className="print-sub">
          {character_name} · {world}
        </p>
        {pages.map((text, i) => (
          <section key={i}>
            <h2>Page {i + 1}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
    </article>
  )
}

function BookContent() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setBook(getBookById(id))
    setLoaded(true)
  }, [id])

  return (
    <>
      {!loaded && <p className="reader-note">Loading book...</p>}
      {loaded && !book && (
        <p className="reader-note" role="alert">
          Book not found in this browser.
        </p>
      )}
      {loaded && book && <BookReader key={book.id} book={book} />}
    </>
  )
}

export default function BookPage() {
  return (
    <main className="reader-wrap">
      <Link className="top-link" href="/adventures">← My Adventures</Link>
      <Suspense fallback={<p className="reader-note">Loading book...</p>}>
        <BookContent />
      </Suspense>
    </main>
  )
}
