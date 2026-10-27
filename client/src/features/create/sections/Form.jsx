"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { worlds, moods } from "@/features/create/data"
import { createStory } from "@/services/api"
import { saveBook } from "@/services/storage"
import StoryLoader from "./StoryLoader"

const initialValues = {
  characterName: "",
  scene: "",
  world: worlds[0],
  pageCount: 8,
  mood: "Magical",
}

export default function Form() {
  const router = useRouter()
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({
      ...current,
      [name]: name === "pageCount" ? Number(value) : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const storyData = {
        character_name: values.characterName,
        scene: values.scene,
        world: values.world,
        page_count: values.pageCount,
        mood: values.mood,
      }

      const generated = await createStory(storyData)

      const book = {
        id: crypto.randomUUID(),
        ...storyData,
        title: generated.title,
        pages: generated.pages,
      }

      saveBook(book)
      router.push(`/book/${book.id}`)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      {loading && <StoryLoader />}

      <label className="create-field">
        <span>Character name</span>
        <input
          name="characterName"
          type="text"
          required
          placeholder="Luna the Wanderer"
          value={values.characterName}
          onChange={handleChange}
        />
      </label>

      <label className="create-field">
        <span>Description of the scene</span>
        <textarea
          name="scene"
          required
          rows={4}
          placeholder="A magical castle in the clouds..."
          value={values.scene}
          onChange={handleChange}
        />
      </label>

      <fieldset className="create-field">
        <legend>World</legend>
        <div className="world-chips">
          {worlds.map((item) => (
            <button
              key={item}
              type="button"
              className={`world-chip${values.world === item ? " is-selected" : ""}`}
              aria-pressed={values.world === item}
              onClick={() =>
                setValues((current) => ({ ...current, world: item }))
              }
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="create-field">
        <span>Page count</span>
        <input
          name="pageCount"
          type="number"
          min={3}
          max={20}
          value={values.pageCount}
          onChange={handleChange}
        />
      </label>

      <label className="create-field">
        <span>Mood</span>
        <select name="mood" value={values.mood} onChange={handleChange}>
          {moods.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p className="create-error" role="alert">
          {error}
        </p>
      )}

      <button className="start-button" type="submit" disabled={loading}>
        {loading ? "Generating your story..." : "Begin the Story"}
        {!loading && <span aria-hidden="true">→</span>}
      </button>
    </form>
  )
}
