'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const INDUSTRIES = [
  'Tecnología', 'Salud y Biotecnología', 'Retail / E-commerce', 'Servicios Financieros',
  'Educación', 'Manufactura', 'Alimentos y Bebidas', 'Construcción e Inmobiliaria',
  'Logística y Transporte', 'Turismo y Hospitalidad', 'Medios y Entretenimiento',
  'Consultoría y Servicios Profesionales', 'Agro e Industria', 'Otro',
]

export default function NuevoDiagnosticoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    contactName: '', contactEmail: '', contactRole: '',
    companyName: '', companyUrl: '', industry: '',
    meetingNotes: '',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/diagnoses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear diagnóstico')
      router.push(`/diagnostico/${data.id}/proceso`)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const field = (label: string, key: string, placeholder: string, type = 'text') => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#2C3E50', display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type={type} value={(form as any)[key]} onChange={set(key)} required placeholder={placeholder}
        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde3ee', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#2C3E50' }}
      />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F7', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <nav style={{ background: '#0D2240', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, textDecoration: 'none' }}>← Dashboard</Link>
        <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 900, color: '#fff' }}>Nuevo Diagnóstico</span>
      </nav>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '36px 24px' }}>
        <form onSubmit={handleSubmit}>

          {/* CONTACTO */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #dde3ee', padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '2px solid #dde3ee' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#E8611A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 900, color: '#fff' }}>1</div>
              <div>
                <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 700, color: '#0D2240' }}>Contacto principal</div>
                <div style={{ fontSize: 11, color: '#7f8c8d', marginTop: 2 }}>Persona con quien se tuvo la reunión</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              {field('Nombre completo', 'contactName', 'Ej. Juan Pérez')}
              {field('Correo electrónico', 'contactEmail', 'juan@empresa.com', 'email')}
            </div>
            {field('Puesto / Rol', 'contactRole', 'Ej. Director de Marketing')}
          </div>

          {/* EMPRESA */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #dde3ee', padding: '24px 28px', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '2px solid #dde3ee' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#0A7E8C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 900, color: '#fff' }}>2</div>
              <div>
                <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 700, color: '#0D2240' }}>Datos de la empresa</div>
                <div style={{ fontSize: 11, color: '#7f8c8d', marginTop: 2 }}>Información del prospecto</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              {field('Nombre de la empresa', 'companyName', 'Ej. Nomad Genetics')}
              {field('Sitio web (URL)', 'companyUrl', 'https://www.empresa.com', 'url')}
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, color: '#2C3E50', display: 'block', marginBottom: 6 }}>Industria</label>
              <select value={form.industry} onChange={set('industry')} required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #dde3ee', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#2C3E50', background: '#fff' }}>
                <option value="">Selecciona una industria</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {/* NOTAS */}
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #dde3ee', padding: '24px 28px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '2px solid #dde3ee' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 900, color: '#fff' }}>3</div>
              <div>
                <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 700, color: '#0D2240' }}>Notas de reunión</div>
                <div style={{ fontSize: 11, color: '#7f8c8d', marginTop: 2 }}>Pega aquí tus notas, puntos clave, dolores del cliente, KPIs mencionados</div>
              </div>
            </div>
            <textarea
              value={form.meetingNotes} onChange={set('meetingNotes')} required
              placeholder="Ej. El cliente mencionó que su principal dolor es la falta de leads calificados. Tienen un equipo de 3 personas en marketing. Su sitio web no convierte bien. Quieren duplicar sus ventas en 12 meses..."
              rows={10}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #dde3ee', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', color: '#2C3E50', lineHeight: 1.7, boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fff5f5', border: '1px solid #e74c3c', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#7B1F1F', marginBottom: 16 }}>{error}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Link href="/dashboard" style={{ padding: '12px 24px', borderRadius: 8, border: '1.5px solid #dde3ee', color: '#2C3E50', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              Cancelar
            </Link>
            <button type="submit" disabled={loading}
              style={{ background: loading ? '#ccc' : '#E8611A', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Iniciando…' : 'Generar diagnóstico →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
