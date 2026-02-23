import type React from 'react'
import '../../styles/ui/buttonStyle.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type: "button" | "submit" | "reset"
  size?: "sma" | "md" | "lg"
  variant?: string
}

export function Button({ type, children, variant, ...props }: ButtonProps) {
  return (
    <button className={`btn ${variant ? `btn-${variant}` : ""}`} type={type} {...props}>
      {children}
    </button>
  )
}