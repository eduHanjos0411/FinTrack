import '../../styles/ui/inputStyle.css'

interface InputProps {
  type: string
  placeholder: string
}

export function Input({ type, placeholder }: InputProps) {
  return (
    <input className='input-style' type={type} placeholder={placeholder}/>
  )
}