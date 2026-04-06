import { useNavigate } from 'react-router-dom'
import { useCart } from '../lib/CartContext'
import { useState } from 'react'

const UPSELLS = [
  { id: 'up1', name: 'Pizza no Cone Chefa', price: 19.99, emoji: '🍕' },
  { id: 'up2', name: 'Pizza no Cone Frango com Catupiry', price: 19.99, emoji: '🍕' },
  { id: 'up3', name: 'Mini Cone de Fritas da Chefa', price: 6.99, emoji: '🍟' },
  { id: 'up4', name: 'Coca-Cola Lata 350ml', price: 7.99, emoji: '🥤' },
  { id: 'up5', name: 'Mini Hambúrguer da Chefa', price: 25.98, emoji: '🍔' },
  { id: 'up6', name: 'Cone Grande de Fritas da Chefa', price: 9.99, emoji: '🍟' },
  { id: 'up7', name: 'Guaraná Antarctica 350ml', price: 7.99, emoji: '🥤' },
  { id: 'up8', name: 'Mini Cone de Bacon em Tiras', price: 9.99, emoji: '🥓' },
]

export default function Cart() {
  const { items, updateQty, removeItem, total, addItem } = useCart()
  const navigate = useNavigate()
  const [added, setAdded] = useState({})

  function handleUpsell(item) {
    addItem({ ...item, qty: 1 })
    setAdded(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))
  }

  if (items.length === 0) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '16px' }}>
      <div style={{ fontSize: '64px' }}>🛒</div>
      <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Carrinho vazio</h2>
      <p style={{ color: '#777', textAlign: 'center' }}>Adicione itens do cardápio para continuar</p>
      <button className="btn-primary" style={{ maxWidth: '280px' }} onClick={() => navigate('/')}>Ver cardápio</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '120px' }}>

      <div style={{ background: 'linear-gradient(135deg, #8B1A0A, #E8741A)', padding: '20px 16px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Meu Carrinho</h1>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {items.map((item, idx) => (
          <div key={idx} className="card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#E8741A22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>🍕</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '2px' }}>{item.name}</p>
                {item.extras?.length > 0 && (
                  <p style={{ fontSize: '12px', color: '#E8741A', marginBottom: '2px' }}>+ {item.extras.map(e => e.name).join(', ')}</p>
                )}
                {item.flavors?.length > 0 && (
                  <p style={{ fontSize: '12px', color: '#777', marginBottom: '2px' }}>Sabores: {item.flavors.join(', ')}</p>
                )}
                {item.observation && (
                  <p style={{ fontSize: '12px', color: '#777', fontStyle: 'italic', marginBottom: '4px' }}>Obs: {item.observation}</p>
                )}
                <p style={{ fontSize: '15px', fontWeight: '800', color: '#E8741A' }}>
                  R$ {((item.price + (item.extras?.reduce((s, e) => s + e.price, 0) || 0)) * item.qty).toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', background: item.qty === 1 ? '#ffeeee' : '#f0f0f0', border: 'none', fontSize: '16px', cursor: 'pointer', fontWeight: '700', color: item.qty === 1 ? '#e74c3c' : '#333' }}>−</button>
                  <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#E8741A', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer', fontWeight: '700' }}>+</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* UPSELL FUNCIONANDO */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ fontWeight: '800', fontSize: '15px', marginBottom: '4px' }}>🔥 Adicionar mais ao pedido</p>
          <p style={{ fontSize: '12px', color: '#777', marginBottom: '12px' }}>Clique para adicionar — o valor entra no total automaticamente</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {UPSELLS.map((u) => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: added[u.id] ? '#F0FFF4' : '#FFF8F4', borderRadius: '10px', border: `1.5px ${added[u.id] ? 'solid #1D9E75' : 'dashed #E8741A'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{u.emoji}</span>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{u.name}</p>
                    <p style={{ fontSize: '12px', color: '#E8741A', fontWeight: '700' }}>R$ {u.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {added[u.id] > 0 && (
                    <span style={{ background: '#1D9E75', color: 'white', borderRadius: '20px', padding: '2px 8px', fontSize: '12px', fontWeight: '700' }}>{added[u.id]}x</span>
                  )}
                  <button
                    onClick={() => handleUpsell(u)}
                    style={{ background: '#E8741A', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESUMO */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#777' }}>
            <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} itens)</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
            <span style={{ color: '#777' }}>Taxa de entrega</span>
            <span style={{ color: '#1D9E75', fontWeight: '700' }}>Grátis 🎉</span>
          </div>
          <div style={{ borderTop: '2px solid #eee', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800' }}>
            <span>Total</span>
            <span style={{ color: '#E8741A' }}>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

      </div>

      {/* BOTÃO FINALIZAR */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', padding: '16px', background: 'white', borderTop: '1px solid #eee', zIndex: 50 }}>
        <button
          className="btn-primary"
          onClick={() => navigate('/checkout')}
          style={{ fontSize: '16px', fontWeight: '800', padding: '18px' }}
        >
          ✅ Finalizar pedido • R$ {total.toFixed(2).replace('.', ',')}
        </button>
      </div>

    </div>
  )
}
