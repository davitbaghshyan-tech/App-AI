import "./shootingstars.css"

const STARS = [
  { top: "8%", left: "15%", delay: "1s" },
  { top: "20%", left: "55%", delay: "4s" },
  { top: "5%", left: "75%", delay: "7s" },
]

export default function ShootingStars() {
  return (
    <div className="shooting-stars" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="shooting-star"
          style={{ top: s.top, left: s.left, animationDelay: s.delay }}
        />
      ))}
    </div>
  )
}