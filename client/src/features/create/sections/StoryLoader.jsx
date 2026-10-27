"use client"

import { useEffect, useState } from "react"
import "./loader.css"

const messages = [
  "Waking up your hero...",
  "Setting the scene...",
  "Sharpening the plot twists...",
  "Writing the first pages...",
  "Adding a touch of magic...",
  "Finding the perfect ending...",
]

// little golden sparks that float up from the book
const sparks = [
  { x: "20%", d: "0s" },
  { x: "34%", d: "0.6s" },
  { x: "48%", d: "1.2s" },
  { x: "60%", d: "1.8s" },
  { x: "74%", d: "2.4s" },
  { x: "86%", d: "0.3s" },
]

export default function StoryLoader() {
  const [index, setIndex] = useState(0)
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const rotate = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      2800
    )
    const slowTimer = setTimeout(() => setSlow(true), 25000)

    return () => {
      clearInterval(rotate)
      clearTimeout(slowTimer)
    }
  }, [])

  return (
    <div className="loader" role="status">
      <span className="loader-sr">Generating your story, please wait.</span>

      <div className="loader-book" aria-hidden="true">
        {sparks.map((spark, i) => (
          <span
            key={i}
            className="loader-spark"
            style={{ "--x": spark.x, "--d": spark.d }}
          />
        ))}

        <div className="loader-stage">
          <div className="loader-cover" />
          <div className="loader-half left" />
          <div className="loader-half right" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="loader-leaf" style={{ "--i": i }} />
          ))}
          <div className="loader-spine" />
        </div>
      </div>

      <p className="loader-message" key={index} aria-hidden="true">
        {messages[index]}
      </p>
      <p className="loader-hint" aria-hidden="true">
        {slow
          ? "Still writing... longer stories take a little more time."
          : "This usually takes 10–20 seconds."}
      </p>
    </div>
  )
}
