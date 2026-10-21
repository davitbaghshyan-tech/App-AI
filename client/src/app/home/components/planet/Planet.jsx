import "./planet.css"

export default function Planet({ variant = "gas", hidden = false }) {
  const hasRing = variant === "gas"
  const hasClouds = variant === "aqua" || variant === "ember"

  return (
    <div
      className={`planet planet--${variant} ${hidden ? "planet--hidden" : ""}`}
    >
      <div className="planet-body">
        {hasRing && <div className="planet-ring planet-ring--back" />}
        <div className="planet-sphere">
          <div className="planet-texture" />
          {hasClouds && <div className="planet-clouds" />}
        </div>
        {hasRing && <div className="planet-ring planet-ring--front" />}
      </div>
    </div>
  )
}