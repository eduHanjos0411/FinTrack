import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type MouseEvent } from 'react'
import { cssVar } from '../lib/style'
import type { Category } from '../types'
import { PlusIcon } from './Icons'

const MENU_WIDTH = 220
const MENU_MAX_HEIGHT = 320

interface CategoryPickerProps {
  categories: Category[]
  value: string | null
  onChange: (categoryId: string | null) => void
  /** Cria a categoria e devolve o id dela. */
  onCreate: (name: string) => string
}

export function CategoryPicker({ categories, value, onChange, onCreate }: CategoryPickerProps) {
  // Posição fixa calculada na abertura: as listas rolam por dentro dos cartões,
  // e um menu absoluto seria cortado pelo overflow delas.
  const [menuPosition, setMenuPosition] = useState<CSSProperties | null>(null)
  const [newName, setNewName] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = categories.find((category) => category.id === value)
  const open = menuPosition !== null

  useEffect(() => {
    if (!open) return
    function close() {
      setMenuPosition(null)
    }
    function handlePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    function handleScroll(event: Event) {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', handlePointer)
    document.addEventListener('keydown', handleKey)
    document.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    if (open) {
      setMenuPosition(null)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - MENU_WIDTH - 8))
    const opensUp = window.innerHeight - rect.bottom < MENU_MAX_HEIGHT && rect.top > window.innerHeight - rect.bottom
    setMenuPosition(
      opensUp ? { left, bottom: window.innerHeight - rect.top + 6 } : { left, top: rect.bottom + 6 },
    )
  }

  function choose(categoryId: string | null) {
    onChange(categoryId)
    setMenuPosition(null)
  }

  function create(event: FormEvent) {
    event.preventDefault()
    const name = newName.trim()
    if (!name) return
    choose(onCreate(name))
    setNewName('')
  }

  return (
    <div className="picker" ref={rootRef}>
      <button
        type="button"
        className={`chip ${selected ? '' : 'chip--empty'}`}
        style={selected ? cssVar('--chip', selected.color) : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
      >
        {selected && <span className="chip__dot" />}
        {selected ? selected.name : 'Categoria'}
      </button>

      {open && (
        <div className="picker__menu" style={{ ...menuPosition, width: MENU_WIDTH }}>
          <div role="listbox" aria-label="Categorias">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                role="option"
                aria-selected={category.id === value}
                className="picker__option"
                style={cssVar('--chip', category.color)}
                onClick={() => choose(category.id)}
              >
                <span className="chip__dot" />
                {category.name}
              </button>
            ))}
            {value !== null && (
              <button type="button" className="picker__option picker__option--clear" onClick={() => choose(null)}>
                Sem categoria
              </button>
            )}
          </div>
          <form className="picker__create" onSubmit={create}>
            <input
              className="field"
              placeholder="Nova categoria"
              aria-label="Nome da nova categoria"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />
            <button type="submit" className="icon-button" aria-label="Criar categoria" disabled={!newName.trim()}>
              <PlusIcon size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
