"use client"

import { useState, useEffect } from "react"
import './home.css'
import Starfield from './components/starfield/Starfield'
import ShootingStars from './components/shootingstars/ShootingStars'
import Planet from './components/planet/Planet'
import Title from './components/title/Title'
import SoundToggle from './components/soundtoggle/SoundToggle'
import { Button } from './components/button/Button'

const PLANETS = ["gas", "aqua", "ember", "frost"]

const Home = () => {
  const [launching, setLaunching] = useState(false)
  const [planetIndex, setPlanetIndex] = useState(0)

  useEffect(() => {
    if (!launching) return

    const swap = setTimeout(() => {
      setPlanetIndex((i) => (i + 1) % PLANETS.length)
    }, 2000)

    const end = setTimeout(() => setLaunching(false), 4000)

    return () => {
      clearTimeout(swap)
      clearTimeout(end)
    }
  }, [launching])

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2
    e.currentTarget.style.setProperty('--mx', x)
    e.currentTarget.style.setProperty('--my', y)
  }

  return (
    <div className='home' onMouseMove={handleMouseMove}>
      <Starfield speed={launching ? 45 : 3} />
      <ShootingStars />
      <Planet variant={PLANETS[planetIndex]} hidden={launching} />
      <div className='nebula' />
      <SoundToggle />
      <div className={`home-content ${launching ? 'launching' : ''}`}>
        <Title text="ODYSSEY" subtitle="A journey beyond time" />
        <Button onClick={() => setLaunching(true)} disabled={launching}>
          Launch
        </Button>
      </div>
    </div>
  )
}

export default Home