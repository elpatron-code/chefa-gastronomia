import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../lib/CartContext'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', address: '',
    notes: '', payment: 'pix',
    cardType: 'credito', troco: ''
  })

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  function isValidUUID(str) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
  }

  async function handleSubmit() {
    if (!form.name || !form.phone || !form.address) {
      alert('Preencha nome, telefone e endereço')
      return
    }
    if (form.payment === 'dinheiro' && !form.troco) {
      alert('Informe o valor do troco')
      return
    }
    setLoading(true)
    try {
      let userId = null

      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('phone', form.phone)
        .maybeSingle()

      if (existing) {
        userId = existing.id
      } else {
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({ name: form.name, phone: form.phone })
          .select('id')
          .single()
        if (userError) throw userError
        userId = newUser.id
      }

      const paymentDetail = form.payment === 'cartao'
        ? `Cartão ${form.cardType}`
        : form.payment === 'dinheiro'
        ? `Dinheiro — troco para R$ ${form.troco}`
        : 'PIX'

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total,
          address: form.address,
          notes: form.notes,
          payment_method: paymentDetail,
          status: 'pending'
        })
        .select('id')
        .single()

      if (orderError) throw orderError

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: isValidUUID(item.id) ? item.id : null,
        quantity: item.qty,
        unit_price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      await supabase
        .from('users')
        .update({ last_order_at: new Date().toISOString() })
        .eq('id', userId)

      clear()
      navigate('/pedido-confirmado', {
        state: {
          orderId: order.id,
          name: form.name,
          payment: form.payment,
          troco: form.troco,
          cardType: form.cardType
        }
      })
    } catch (err) {
      console.error(err)
      alert('Erro: ' + (err.message || 'Tente novamente'))
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '120px' }}>

      <div style={{ background: 'linear-gradient(135deg, #8B1A0A, #E8741A)', padding: '20px 16px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate('/carrinho')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: '20px', fontWeight: '800' }}>Finalizar Pedido</h1>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '14px' }}>👤 Seus dados</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Seu nome completo" value={form.name} onChange={e => set('name', e.target.value)} />
            <input placeholder="WhatsApp com DDD — ex: 34999990000" value={form.phone} onChange={e => set('phone', e.target.value)} type="tel" />
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '14px' }}>📍 Endereço de entrega</p>
          <textarea
            placeholder="Rua, número, bairro, complemento..."
            value={form.address}
            onChange={e => set('address', e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '12px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', resize: 'none', outline: 'none' }}
          />
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '14px' }}>💳 Forma de pagamento</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

            <button onClick={() => set('payment', 'pix')}
              style={{ padding: '14px', borderRadius: '10px', border: `2px solid ${form.payment === 'pix' ? '#E8741A' : '#eee'}`, background: form.payment === 'pix' ? '#FFF8F4' : 'white', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '700', fontSize: '14px', color: form.payment === 'pix' ? '#E8741A' : '#333' }}>💚 PIX</p>
                <p style={{ fontSize: '12px', color: '#777' }}>Aprovação instantânea</p>
              </div>
              {form.payment === 'pix' && <span style={{ color: '#E8741A', fontSize: '18px' }}>✓</span>}
            </button>

            <button onClick={() => set('payment', 'cartao')}
              style={{ padding: '14px', borderRadius: '10px', border: `2px solid ${form.payment === 'cartao' ? '#E8741A' : '#eee'}`, background: form.payment === 'cartao' ? '#FFF8F4' : 'white', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '700', fontSize: '14px', color: form.payment === 'cartao' ? '#E8741A' : '#333' }}>💳 Cartão na entrega</p>
                <p style={{ fontSize: '12px', color: '#777' }}>Débito ou crédito</p>
              </div>
              {form.payment === 'cartao' && <span style={{ color: '#E8741A', fontSize: '18px' }}>✓</span>}
            </button>

            {form.payment === 'cartao' && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                {['debito', 'credito'].map(type => (
                  <button key={type} onClick={() => set('cardType', type)}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${form.cardType === type ? '#E8741A' : '#eee'}`, background: form.cardType === type ? '#FFF8F4' : 'white', fontWeight: '700', fontSize: '14px', color: form.cardType === type ? '#E8741A' : '#555', cursor: 'pointer' }}>
                    {type === 'debito' ? '💳 Débito' : '💳 Crédito'}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => set('payment', 'dinheiro')}
              style={{ padding: '14px', borderRadius: '10px', border: `2px solid ${form.payment === 'dinheiro' ? '#E8741A' : '#eee'}`, background: form.payment === 'dinheiro' ? '#FFF8F4' : 'white', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: '700', fontSize: '14px', color: form.payment === 'dinheiro' ? '#E8741A' : '#333' }}>💵 Dinheiro na entrega</p>
                <p style={{ fontSize: '12px', color: '#777' }}>Informe o valor para troco</p>
              </div>
              {form.payment === 'dinheiro' && <span style={{ color: '#E8741A', fontSize: '18px' }}>✓</span>}
            </button>

            {form.payment === 'dinheiro' && (
              <div style={{ marginTop: '4px' }}>
                <p style={{ fontSize: '13px', color: '#555', marginBottom: '8px', fontWeight: '600' }}>
                  💰 Troco para quanto? (pedido: R$ {total.toFixed(2).replace('.', ',')})
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {['20', '50', '100', '200'].map(val => (
                    <button key={val} onClick={() => set('troco', val)}
                      style={{ padding: '10px 16px', borderRadius: '10px', border: `2px solid ${form.troco === val ? '#E8741A' : '#eee'}`, background: form.troco === val ? '#FFF8F4' : 'white', fontWeight: '700', color: form.troco === val ? '#E8741A' : '#555', cursor: 'pointer', fontSize: '14px' }}>
                      R$ {val}
                    </button>
                  ))}
                </div>
                <input
                  placeholder="Ou digite o valor exato"
                  value={form.troco}
                  onChange={e => set('troco', e.target.value)}
                  type="number"
                  style={{ padding: '12px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', width: '100%', outline: 'none' }}
                />
              </div>
            )}

          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>💬 Observação geral</p>
          <textarea
            placeholder="Alguma instrução para a entrega?"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={2}
            style={{ width: '100%', padding: '12px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', resize: 'none', outline: 'none' }}
          />
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '12px' }}>🧾 Resumo do pedido</p>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
              <span style={{ color: '#555' }}>{item.qty}x {item.name}</span>
              <span style={{ fontWeight: '600' }}>R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800' }}>
            <span>Total</span>
            <span style={{ color: '#E8741A' }}>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', padding: '16px', background: 'white', borderTop: '1px solid #eee' }}>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? '⏳ Enviando pedido...' : `✅ Confirmar pedido • R$ ${total.toFixed(2).replace('.', ',')}`}
        </button>
      </div>
    </div>
  )
}
