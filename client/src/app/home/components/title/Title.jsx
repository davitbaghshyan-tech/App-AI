import "./title.css"

export default function Title({ text, subtitle }) {
  return (
    <div className="title">
      <h1 className="title-text" aria-label={text}>
        {text.split("").map((letter, i) => (
          <span
            key={i}
            className="title-letter"
            aria-hidden="true"
            style={{
              animationDelay: `${i * 0.12}s, ${0.9 + i * 0.12}s`,
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </h1>
      {subtitle && <p className="title-subtitle">{subtitle}</p>}
    </div>
  )
}