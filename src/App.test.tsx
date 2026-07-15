import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('ProfIA', () => {
  it('mostra la pagina di accesso', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByRole('heading', { name: /accedi al tuo spazio/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^accedi$/i })).toBeInTheDocument()
  })
})
