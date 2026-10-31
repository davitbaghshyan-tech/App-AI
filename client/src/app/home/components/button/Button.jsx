"use client"

import "./button.css"

export const Button = ({ children, onClick, disabled }) => {
  return (
    <button className="launch-button" onClick={onClick} disabled={disabled}>
      <span className="launch-button-text">{children}</span>
    </button>
  )
}