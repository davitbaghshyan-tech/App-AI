"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import './home.css'
import Starfield from './components/starfield/Starfield'
import ShootingStars from './components/shootingstars/ShootingStars'
import Planet from './components/planet/Planet'
import Title from './components/title/Title'
import SoundToggle from './components/soundtoggle/SoundToggle'
import { Button } from './components/button/Button'

const Home = () => {
  const router = useRouter()
  const [launching, setLaunching] = useState(false)

  useEffect(() => {
    if (!launching) return

    // after the launch animation, go to the create page
    const end = setTimeout(() => router.push("/create"), 4000)

    return () => clearTimeout(end)
  }, [launching, router])

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
      <Planet variant="gas" hidden={launching} />
      <div className='nebula' />
      <SoundToggle />
      {!launching && (
        <Link className="top-link" href="/adventures">📚 My Adventures</Link>
      )}
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
