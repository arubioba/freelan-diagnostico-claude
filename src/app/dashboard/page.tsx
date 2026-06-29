'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

interface Diagnosis {
  id: string
  createdAt: string
  status: string
  companyName: string
  companyUrl: string
  industry: string
  contactName: string
  user: { name: string }
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:     { label: 'Pendiente',    color: '#f39c12' },
  RESEARCHING: { label: 'Investigando', color: '#0A7E8C' },
  ENRICHING:   { label: 'Enriqueciendo',color: '#0A7E8C' },
  GENERATING:  { label: 'Generando',    color: '#E8611A' },
  COMPLETED:   { label: 'Completado',   color: '#27ae60' },
  ERROR:       { label: 'Error',        color: '#e74c3c' },
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/diagnoses')
      .then(r => r.json())
      .then(data => { setDiagnoses(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F7', fontFamily: '"DM Sans", sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* TOP NAV */}
      <nav style={{ background: '#0D2240', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 900, color: '#fff' }}>Freelan</span>
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: '#E8611A', fontWeight: 600 }}>Diagnóstico</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{session?.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,.2)', color: 'rgba(255,255,255,.7)', padding: '5px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* HEADER ROW */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 700, color: '#0D2240', margin: 0 }}>Diagnósticos</h1>
            <p style={{ fontSize: 12, color: '#7f8c8d', marginTop: 4 }}>Historial del equipo Freelan</p>
          </div>
          <Link href="/nuevo" style={{ background: '#E8611A', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7 }}>
            + Nuevo diagnóstico
          </Link>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total', value: diagnoses.length, color: '#0D2240' },
            { label: 'Completados', value: diagnoses.filter(d => d.status === 'COMPLETED').length, color: '#27ae60' },
            { label: 'En proceso', value: diagnoses.filter(d => ['RESEARCHING','ENRICHING','GENERATING'].includes(d.status)).length, color: '#0A7E8C' },
            { label: 'Con error', value: diagnoses.filter(d => d.status === 'ERROR').length, color: '#e74c3c' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '16px 18px', border: '1px solid #dde3ee', borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 1, color: '#7f8c8d', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 700, color: s.color, marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #dde3ee', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#7f8c8d', fontSize: 13 }}>Cargando diagnósticos…</div>
          ) : diagnoses.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#7f8c8d', marginBottom: 16 }}>No hay diagnósticos aún.</div>
              <Link href="/nuevo" style={{ background: '#E8611A', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Crear el primero
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#0D2240' }}>
                  {['Empresa', 'Industria', 'Contacto', 'Creado por', 'Fecha', 'Estado', ''].map(h => (
                    <th key={h} style={{ padding: '9px 14px', textAlign: 'left', color: '#fff', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .6 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {diagnoses.map((d, i) => {
                  const st = STATUS_LABEL[d.status] ?? { label: d.status, color: '#7f8c8d' }
                  return (
                    <tr key={d.id} style={{ borderBottom: '1px solid #dde3ee', background: i % 2 === 1 ? '#f8f9fb' : '#fff' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0D2240' }}>
                        {d.companyName}
                        <div style={{ fontSize: 10.5, color: '#7f8c8d', fontWeight: 400 }}>{d.companyUrl}</div>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#2C3E50' }}>{d.industry}</td>
                      <td style={{ padding: '10px 14px', color: '#2C3E50' }}>{d.contactName}</td>
                      <td style={{ padding: '10px 14px', color: '#2C3E50' }}>{d.user.name}</td>
                      <td style={{ padding: '10px 14px', color: '#7f8c8d' }}>{new Date(d.createdAt).toLocaleDateString('es-MX')}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: st.color + '22', color: st.color }}>{st.label}</span>
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {d.status === 'COMPLETED' && (
                          <Link href={`/diagnostico/${d.id}`} style={{ color: '#E8611A', fontWeight: 600, fontSize: 11, textDecoration: 'none' }}>Ver →</Link>
                        )}
                        {d.status === 'PENDING' && (
                          <Link href={`/nuevo?retry=${d.id}`} style={{ color: '#0A7E8C', fontWeight: 600, fontSize: 11, textDecoration: 'none' }}>Reanudar →</Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
