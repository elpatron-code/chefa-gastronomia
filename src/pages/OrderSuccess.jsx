import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function OrderSuccess() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(45)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pixKey = '34988306200'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', background: '#FFF8F4' }}>

      <div style={{ fontSize: '72px', marginBottom: '16px', animation: 'bounce 1s infinite' }}>🎉</div>
      <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A1A1A', marginBottom: '8px', textAlign: 'center' }}>
        Pedido confirmado!
      </h1>
      <p style={{ color: '#777', marginBottom: '24px', textAlign: 'center' }}>
        Obrigado, <strong>{state?.name}</strong>! Seu pedido foi recebido.
      </p>

      {state?.payment === 'pix' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '400px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>💚 Pagamento via PIX</p>
          <p style={{ fontSize: '13px', color: '#777', marginBottom: '12px' }}>Copie a chave abaixo e pague no seu banco</p>
          <div style={{ background: '#f5f5f5', borderRadius: '10px', padding: '12px', fontWeight: '700', fontSize: '18px', letterSpacing: '2px', marginBottom: '12px' }}>
            {pixKey}
          </div>
          <p style={{ fontSize: '12px', color: '#E8741A', fontWeight: '600' }}>Chave PIX — Telefone</p>
          <p style={{ fontSize: '12px', color: '#777', marginTop: '8px' }}>Após o pagamento, seu pedido entra em preparo automaticamente</p>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '400px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>⏱ Status do pedido</p>
        {[
          { label: '✅ Pedido recebido', done: true },
          { label: '👩‍🍳 Em preparo', done: false },
          { label: '🛵 Saiu para entrega', done: false },
          { label: '🏠 Entregue', done: false },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: step.done ? '#1D9E75' : '#ddd', flexShrink: 0 }} />
            <span style={{ fontSize: '14px', color: step.done ? '#1D9E75' : '#999', fontWeight: step.done ? '700' : '400' }}>{step.label}</span>
          </div>
        ))}
        <div style={{ marginTop: '16px', background: '#FFF8F4', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#777' }}>Tempo estimado</p>
          <p style={{ fontSize: '28px', fontWeight: '800', color: '#E8741A' }}>40–50 min</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', width: '100%', maxWidth: '400px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#777', marginBottom: '4px' }}>Dúvidas? Fale com a gente</p>
        <a href="https://wa.me/5534988306200" style={{ color: '#E8741A', fontWeight: '700', fontSize: '15px', textDecoration: 'none' }}>
          📱 WhatsApp: (34) 98830-6200
        </a>
      </div>

      <button className="btn-primary" style={{ maxWidth: '400px' }} onClick={() => navigate('/')}>
        Fazer novo pedido
      </button>
    </div>
  )
}
