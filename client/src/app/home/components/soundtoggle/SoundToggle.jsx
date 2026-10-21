"use client"

import { useEffect, useRef, useState } from "react"
import "./soundtoggle.css"

const SONG = "/audio/song.mp3"
const MAX_VOLUME = 0.6

export default function SoundToggle() {
  const [on, setOn] = useState(false)
  const audioRef = useRef(null)
  const fadeRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(SONG)
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio

    return () => {
      clearInterval(fadeRef.current)
      audio.pause()
    }
  }, [])

  // move the volume toward a target a little at a time
  const fadeTo = (target, onDone) => {
    const audio = audioRef.current
    clearInterval(fadeRef.current)

    fadeRef.current = setInterval(() => {
      const diff = target - audio.volume

      if (Math.abs(diff) < 0.02) {
        audio.volume = target
        clearInterval(fadeRef.current)
        if (onDone) onDone()
      } else {
        const next = audio.volume + Math.sign(diff) * 0.02
        audio.volume = Math.min(1, Math.max(0, next))
      }
    }, 50)
  }

  const toggle = async () => {
    const audio = audioRef.current

    if (on) {
      fadeTo(0, () => audio.pause())
      setOn(false)
      return
    }

    try {
      await audio.play()
      fadeTo(MAX_VOLUME)
      setOn(true)
    } catch (error) {
      // most likely the file is missing or has a different name
      console.error("Could not play the song:", error)
    }
  }

  return (
    <button
      className={`sound-toggle ${on ? "sound-toggle--on" : ""}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
    >
      <span className="sound-bars">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="sound-label">{on ? "Sound on" : "Sound off"}</span>
    </button>
  )
}