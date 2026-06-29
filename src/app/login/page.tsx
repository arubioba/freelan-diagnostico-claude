'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) setError('Credenciales incorrectas')
    else router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0D2240', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ width: 420, background: '#fff', borderRadius: 16, padding: '40px 44px', boxShadow: '0 24px 64px rgba(0,0,0,.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 900, color: '#0D2240', lineHeight: 1 }}>
            Freelan
          </div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2.5, color: '#E8611A', fontWeight: 600, marginTop: 4 }}>
            Portal de Diagnóstico
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#2C3E50', display: 'block', marginBottom: 6 }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde3ee', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              placeholder="tu@freelan.com.mx"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#2C3E50', display: 'block', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde3ee', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #e74c3c', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#7B1F1F', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#ccc' : '#E8611A', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', letterSpacing: .5 }}
          >
            {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 10.5, color: '#7f8c8d', marginTop: 24, lineHeight: 1.6 }}>
          La sesión se cierra al cerrar la ventana del navegador.<br />
          Solo usuarios autorizados de Freelan.
        </p>
      </div>
    </div>
  )
}
