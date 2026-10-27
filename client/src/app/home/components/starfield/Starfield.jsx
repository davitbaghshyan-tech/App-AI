"use client"

import { useEffect, useRef } from "react"
import "./starfield.css"

const STAR_COUNT = 500
const COLORS = ["#ffffff", "#aee1ff", "#ffd9a8", "#c9b5ff"]

export default function Starfield({ speed = 3 }) {
  const canvasRef = useRef(null)
  const speedRef = useRef(speed)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let width = 0
    let height = 0
    let stars = []
    let frameId
    let current = speedRef.current

    const randomStar = () => ({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: Math.random() * width,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    })

    const project = (x, y, z) => ({
      px: (x / z) * width * 0.5 + width / 2,
      py: (y / z) * width * 0.5 + height / 2,
    })

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      stars = Array.from({ length: STAR_COUNT }, randomStar)
    }

    const animate = () => {
      // move a small part of the way toward the target speed each frame
      current += (speedRef.current - current) * 0.04

      ctx.fillStyle = "rgba(2, 3, 10, 0.3)"
      ctx.fillRect(0, 0, width, height)

      for (const star of stars) {
        star.z -= current

        if (star.z <= 1) {
          Object.assign(star, randomStar(), { z: width })
        }

        const head = project(star.x, star.y, star.z)
        const tail = project(star.x, star.y, star.z + current * 6)
        const size = (1 - star.z / width) * 2.5

        ctx.strokeStyle = star.color
        ctx.lineWidth = size
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(tail.px, tail.py)
        ctx.lineTo(head.px, head.py)
        ctx.stroke()
      }

      frameId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener("resize", resize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" />
}