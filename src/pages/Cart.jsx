import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Crown } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pb-24">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container-mobile py-4 flex items-center gap-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft size={24} className="text-[#1A1A1A]" />
            </button>
            <h1 className="text-xl font-bold">Carrinho</h1>
          </div>
        </header>

        {/* Empty State */}
        <div className="container-mobile flex flex-col items-center justify-center py-20 text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Carrinho Vazio</h2>
          <p className="text-gray-500 mb-6">Adicione produtos deliciosos ao seu carrinho!</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Ver Cardápio
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container-mobile py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft size={24} className="text-[#1A1A1A]" />
            </button>
            <h1 className="text-xl font-bold">Carrinho</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-[#E61919] font-medium"
          >
            Limpar
          </button>
        </div>
      </header>

      <div className="container-mobile py-6 space-y-6">
        {/* Lista de Itens */}
        <section>
          <h2 className="text-lg font-bold mb-4">Seus Itens ({items.length})</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="card p-4 animate-slide-up">
                <div className="flex gap-4">
                  {/* Imagem */}
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                    {item.imagem_url ? (
                      <img
                        src={item.imagem_url}
                        alt={item.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🍕
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.nome}</h3>
                    {item.tamanho && (
                      <p className="text-xs text-gray-500 mb-1">Tamanho: {item.tamanho}</p>
                    )}
                    {item.adicionais && item.adicionais.length > 0 && (
                      <p className="text-xs text-gray-500 mb-2">
                        + {item.adicionais.map(a => a.nome).join(', ')}
                      </p>
                    )}
                    <p className="text-lg font-bold text-[#E61919]">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </p>
                  </div>

                  {/* Controles */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-[#E61919] transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="flex items-center gap-2 bg-[#F5F5F5] rounded-full px-2 py-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)}
                        className="text-[#E61919] font-bold"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-semibold text-sm w-6 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)}
                        className="text-[#E61919] font-bold"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Banner Clube */}
        <section>
          <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2d2d2d] rounded-2xl p-5 text-white">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Crown size={32} className="text-[#FFD700]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">Clube da Chefa</h3>
                  <span className="premium-badge text-xs">VIP</span>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  Ganhe <span className="text-[#FFD700] font-bold">10% OFF</span> em todos os pedidos + frete grátis
                </p>
                <button
                  onClick={() => navigate('/clube')}
                  className="bg-[#FFD700] text-[#1A1A1A] px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#ffd000] transition-colors"
                >
                  Conhecer Clube
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Resumo */}
        <section className="card p-5">
          <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxa de entrega</span>
              <span className="text-[#E61919] font-medium">Calcular no checkout</span>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-[#E61919]">
              R$ {total.toFixed(2)}
            </span>
          </div>
        </section>

        {/* Botão Finalizar */}
        <button
          onClick={() => navigate('/checkout')}
          className="btn-primary w-full text-lg py-4"
        >
          Finalizar Pedido
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
