import { useState } from 'react'
import { useCart } from '../lib/CartContext'

const EXTRAS = [
  { category: '🥩 Carnes', items: [
    { name: 'Frango Desfiado', price: 3.99 },
    { name: 'Carne Moída', price: 3.99 },
    { name: 'Bacon em Cubos', price: 4.99 },
    { name: 'Carne Desfiada', price: 3.99 },
    { name: 'Bacon em Fatias', price: 4.99 },
  ]},
  { category: '🧀 Queijos', items: [
    { name: 'Requeijão', price: 5.99 },
    { name: 'Cream Cheese', price: 4.99 },
    { name: 'Queijo Cheddar', price: 4.99 },
    { name: 'Queijo Minas', price: 3.99 },
    { name: 'Muçarela', price: 3.99 },
    { name: 'Parmesão', price: 3.99 },
  ]},
  { category: '🥦 Vegetais', items: [
    { name: 'Cheiro Verde', price: 1.99 },
    { name: 'Milho', price: 1.99 },
    { name: 'Palmito', price: 1.99 },
    { name: 'Brócolis', price: 1.99 },
    { name: 'Azeitona', price: 1.99 },
    { name: 'Cebola', price: 1.99 },
    { name: 'Pimentão', price: 1.99 },
    { name: 'Tomate Cereja', price: 1.99 },
    { name: 'Pimenta Biquinho', price: 1.99 },
    { name: 'Cenoura Ralada', price: 1.99 },
    { name: 'Manjericão', price: 1.99 },
  ]},
  { category: '🫙 Molhos', items: [
    { name: 'Molho Vermelho', price: 2.99 },
    { name: 'Molho Branco', price: 2.99 },
    { name: 'Molho Rosê', price: 2.99 },
    { name: 'Molho Shoyu', price: 2.99 },
    { name: 'Molho Cheddar', price: 2.99 },
    { name: 'Molho de Alho', price: 2.99 },
    { name: 'Molho da Chefa', price: 2.99 },
    { name: 'Molho Barbecue', price: 2.99 },
  ]},
]

const PIZZA_FLAVORS = [
  'Pizza Cone Chefa', 'Pizza Cone Frango com Catupiry',
  'Pizza Cone Frango c/ Palmito', 'Pizza Cone Calabresa',
  'Pizza Cone Brócolis', 'Pizza Cone Brócolis com Bacon',
  'Pizza Cone Presunto', 'Pizza Cone Nutella com Banana',
  'Pizza Cone Nutella com Ninho', 'Pizza Cone Kit Kat', 'Pizza Cone Laka Oreo'
]

const BURGER_FLAVORS = [
  'Mini Hambúrguer BBQ da Chefa', 'Mini Hambúrguer Bacon com Cheddar',
  'Mini Hambúrguer da Chefa', 'Mini Hambúrguer Carne da Chefa',
  'Mini Hambúrguer Gourmet da Chefa', 'Mini Hambúrguer Clássico da Chefa',
  'Mini Hambúrguer Bacon e Queijo'
]

function getFlavorConfig(product) {
  const name = product.name.toLowerCase()
  if (name.includes('super big combo')) return { type: 'pizza', qty: 10 }
  if (name.includes('big combo da chefa')) return { type: 'pizza', qty: 8 }
  if (name.includes('combo família')) return { type: 'pizza', qty: 4 }
  if (name.includes('combo perfeito')) return { type: 'pizza', qty: 4 }
  if (name.includes('combo duplo')) return { type: 'pizza', qty: 2 }
  if (name.includes('combo especial da chefa')) return { type: 'pizza', qty: 4 }
  if (name.includes('combo especial burguer')) return { type: 'both', pizzaQty: 2, burgerQty: 2 }
  if (name.includes('super big burg')) return { type: 'both', pizzaQty: 5, burgerQty: 5 }
  if (name.includes('combo de boas vindas')) return { type: 'burger', qty: 5 }
  return null
}

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [extras, setExtras] = useState([])
  const [observation, setObservation] = useState('')
  const [pizzaFlavors, setPizzaFlavors] = useState([])
  const [burgerFlavors, setBurgerFlavors] = useState([])

  const flavorConfig = getFlavorConfig(product)
  const extrasTotal = extras.reduce((s, e) => s + e.price, 0)
  const unitPrice = product.price + extrasTotal
  const totalPrice = unitPrice * qty

  const toggleExtra = (item) => {
    setExtras(prev =>
      prev.find(e => e.name === item.name)
        ? prev.filter(e => e.name !== item.name)
        : [...prev, item]
    )
  }

  const toggleFlavor = (flavor, list, setList, max) => {
    if (list.includes(flavor)) {
      setList(list.filter(f => f !== flavor))
    } else if (list.length < max) {
      setList([...list, flavor])
    }
  }

  const handleAdd = () => {
    addItem({
      ...product,
      price: unitPrice,
      extras,
      observation,
      flavors: [...pizzaFlavors, ...burgerFlavors],
      qty,
    })
    onClose()
  }

  const canAdd = !flavorConfig ||
    (flavorConfig.type === 'pizza' && pizzaFlavors.length === flavorConfig.qty) ||
    (flavorConfig.type === 'burger' && burgerFlavors.length === flavorConfig.qty) ||
    (flavorConfig.type === 'both' && pizzaFlavors.length === flavorConfig.pizzaQty && burgerFlavors.length === flavorConfig.burgerQty)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      {/* Overlay */}
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(0,0,0,0.5)' }} />

      {/* Sheet */}
      <div style={{ background: 'white', borderRadius: '20px 20px 0 0', maxHeight: '90vh', overflowY: 'auto', paddingBottom: '100px' }}>

        {/* Imagem / Header */}
        <div style={{ background: 'linear-gradient(135deg, #8B1A0A, #E8741A)', padding: '24px 16px 20px', position: 'relative', color: 'white', borderRadius: '20px 20px 0 0' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer' }}>✕</button>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🍕</div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{product.name}</h2>
          {product.description && <p style={{ fontSize: '13px', opacity: 0.9 }}>{product.description}</p>}
          <p style={{ fontSize: '20px', fontWeight: '800', marginTop: '8px' }}>R$ {product.price.toFixed(2).replace('.', ',')}</p>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Escolha de sabores — Pizzas */}
          {flavorConfig && (flavorConfig.type === 'pizza' || flavorConfig.type === 'both') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ fontWeight: '700', fontSize: '15px' }}>🍕 Escolha os sabores de pizza</p>
                <span style={{ background: pizzaFlavors.length === (flavorConfig.pizzaQty || flavorConfig.qty) ? '#1D9E75' : '#E8741A', color: 'white', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: '700' }}>
                  {pizzaFlavors.length}/{flavorConfig.pizzaQty || flavorConfig.qty}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {PIZZA_FLAVORS.map(flavor => (
                  <button key={flavor} onClick={() => toggleFlavor(flavor, pizzaFlavors, setPizzaFlavors, flavorConfig.pizzaQty || flavorConfig.qty)}
                    style={{ padding: '12px 14px', borderRadius: '10px', border: `2px solid ${pizzaFlavors.includes(flavor) ? '#E8741A' : '#eee'}`, background: pizzaFlavors.includes(flavor) ? '#FFF8F4' : 'white', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: pizzaFlavors.includes(flavor) ? '700' : '400', color: pizzaFlavors.includes(flavor) ? '#E8741A' : '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {flavor}
                    {pizzaFlavors.includes(flavor) && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Escolha de sabores — Hambúrguers */}
          {flavorConfig && (flavorConfig.type === 'burger' || flavorConfig.type === 'both') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <p style={{ fontWeight: '700', fontSize: '15px' }}>🍔 Escolha os hambúrguers</p>
                <span style={{ background: burgerFlavors.length === (flavorConfig.burgerQty || flavorConfig.qty) ? '#1D9E75' : '#E8741A', color: 'white', fontSize: '12px', padding: '3px 10px', borderRadius: '20px', fontWeight: '700' }}>
                  {burgerFlavors.length}/{flavorConfig.burgerQty || flavorConfig.qty}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BURGER_FLAVORS.map(flavor => (
                  <button key={flavor} onClick={() => toggleFlavor(flavor, burgerFlavors, setBurgerFlavors, flavorConfig.burgerQty || flavorConfig.qty)}
                    style={{ padding: '12px 14px', borderRadius: '10px', border: `2px solid ${burgerFlavors.includes(flavor) ? '#E8741A' : '#eee'}`, background: burgerFlavors.includes(flavor) ? '#FFF8F4' : 'white', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: burgerFlavors.includes(flavor) ? '700' : '400', color: burgerFlavors.includes(flavor) ? '#E8741A' : '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {flavor}
                    {burgerFlavors.includes(flavor) && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Turbine seu pedido */}
          {EXTRAS.map(group => (
            <div key={group.category}>
              <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '10px' }}>{group.category}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.items.map(item => (
                  <button key={item.name} onClick={() => toggleExtra(item)}
                    style={{ padding: '12px 14px', borderRadius: '10px', border: `2px solid ${extras.find(e => e.name === item.name) ? '#E8741A' : '#eee'}`, background: extras.find(e => e.name === item.name) ? '#FFF8F4' : 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '14px', fontWeight: extras.find(e => e.name === item.name) ? '700' : '400', color: extras.find(e => e.name === item.name) ? '#E8741A' : '#333' }}>{item.name}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#E8741A' }}>+ R$ {item.price.toFixed(2).replace('.', ',')}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Observação */}
          <div>
            <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>💬 Alguma observação?</p>
            <textarea
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="Ex: sem cebola, molho à parte, bem passado..."
              rows={3}
              style={{ width: '100%', padding: '12px', border: '1.5px solid #ddd', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', resize: 'none', outline: 'none' }}
            />
          </div>

        </div>

        {/* Footer fixo */}
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: 'white', padding: '16px', borderTop: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f0', border: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: '700' }}>−</button>
            <span style={{ fontWeight: '800', fontSize: '20px', minWidth: '32px', textAlign: 'center' }}>{qty}</span>
            <button onClick={() => setQty(qty + 1)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E8741A', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer', fontWeight: '700' }}>+</button>
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              style={{ flex: 1, background: canAdd ? '#E8741A' : '#ccc', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '800', cursor: canAdd ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '20px', paddingRight: '20px' }}
            >
              <span>Adicionar</span>
              <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </button>
          </div>
          {!canAdd && flavorConfig && (
            <p style={{ fontSize: '12px', color: '#E8741A', textAlign: 'center', fontWeight: '600' }}>
              ⚠️ Selecione todos os sabores para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
