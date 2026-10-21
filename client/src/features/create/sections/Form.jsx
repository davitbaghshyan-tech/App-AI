"use client"

import { useState } from "react"
import { worlds, moods } from "@/features/create/data"

const API_URL = "http://127.0.0.1:8000/create"

const initialValues = {
  characterName: "",
  scene: "",
  world: worlds[0],
  pageCount: 8,
  mood: "Magical",
}

export default function Form() {
  const [values, setValues] = useState(initialValues)
  const [story, setStory] = useState(null)
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
    setStory(null)

    try {
      // the form field names are different from what the backend expects,
      // so we translate them here:
      // scene -> description, pageCount -> steps, mood -> genre
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: values.characterName,
          genre: values.mood,
          world: values.world,
          description: values.scene,
          steps: values.pageCount,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      setStory(data.story)
    } catch (err) {
      console.error(err)
      setError("Could not create the story. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form className="create-form" onSubmit={handleSubmit}>
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
                onClick={() => {
                  setValues((current) => ({
                    ...current,
                    world: item,
                  }))
                }}
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

        <button className="start-button" type="submit" disabled={loading}>
          {loading ? "Writing your story..." : "Begin the Story"}
          {!loading && <span aria-hidden="true">→</span>}
        </button>
      </form>

      {error && (
        <p className="create-error" role="alert">
          {error}
        </p>
      )}

      {story && (
        <article className="story">
          <h2 className="story__title">{story.title}</h2>

          {story.scenes.map((scene, index) => (
            <section className="story__scene" key={index}>
              <p className="story__text">{scene.text}</p>

              <ul className="story__choices">
                {scene.choices.map((choice) => (
                  <li key={choice}>{choice}</li>
                ))}
              </ul>
            </section>
          ))}
        </article>
      )}
    </>
  )
}
