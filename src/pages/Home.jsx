import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../lib/CartContext'
import ProductModal from '../components/ProductModal'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const { count, total } = useCart()
  const navigate = useNavigate()

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: cats } = await supabase.from('categories').select('*').eq('active', true).order('position')
    const { data: prods } = await supabase.from('products').select('*').eq('active', true).order('position')
    setCategories(cats || [])
    setProducts(prods || [])
    if (cats?.length > 0) setActiveCategory(cats[0].id)
    setLoading(false)
  }

  const filtered = activeCategory ? products.filter(p => p.category_id === activeCategory) : products

  return (
    <div style={{ minHeight: '100vh', paddingBottom: count > 0 ? '100px' : '20px' }}>

      <div style={{ background: 'linear-gradient(135deg, #8B1A0A 0%, #E8741A 100%)', padding: '20px 16px 24px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👩‍🍳</div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Chefa Gastronomia</h1>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>O melhor jeito de comer pizza 🍕</p>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '16px', fontSize: '13px' }}>
          <span>⏱ 40–50 min</span>
          <span>⭐ 4.7</span>
          <span>🛵 Delivery grátis</span>
        </div>
      </div>

      <div style={{ background: 'white', padding: '12px 0', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #eee', overflowX: 'auto', display: 'flex', gap: '8px', paddingLeft: '16px' }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '20px', border: 'none', background: activeCategory === cat.id ? '#E8741A' : '#f0f0f0', color: activeCategory === cat.id ? 'white' : '#555', fontWeight: activeCategory === cat.id ? '700' : '500', fontSize: '13px', cursor: 'pointer' }}>
            {cat.name}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
            <p>Carregando cardápio...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(product => (
              <div key={product.id} className="card" onClick={() => setSelected(product)}
                style={{ display: 'flex', padding: '14px', gap: '12px', cursor: 'pointer' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '12px', background: 'linear-gradient(135deg, #E8741A22, #E8741A44)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {product.image_url
                    ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '36px' }}>🍕</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{product.name}</h3>
                  {product.description && <p style={{ fontSize: '13px', color: '#777', marginBottom: '8px', lineHeight: '1.4' }}>{product.description}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '17px', fontWeight: '800', color: '#E8741A' }}>
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    <button onClick={e => { e.stopPropagation(); setSelected(product) }}
                      style={{ background: '#E8741A', color: 'white', width: '36px', height: '36px', borderRadius: '50%', fontSize: '22px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {count > 0 && (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 32px)', maxWidth: '448px', zIndex: 100 }}>
          <button onClick={() => navigate('/carrinho')}
            style={{ background: '#E8741A', color: 'white', width: '100%', padding: '16px 20px', borderRadius: '14px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(232,116,26,0.5)' }}>
            <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '8px', padding: '4px 10px', fontSize: '14px' }}>{count} {count === 1 ? 'item' : 'itens'}</span>
            <span>Ver carrinho</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      )}

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
