import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { MapPin, Search, ShoppingCart, Plus, Star, Flame, TrendingUp } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const { items, addItem } = useCartStore();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    
    const { data: cats } = await supabase
      .from('categorias')
      .select('*')
      .eq('ativo', true)
      .order('ordem');
    
    setCategorias(cats || []);

    const { data: prods } = await supabase
      .from('produtos')
      .select('*')
      .eq('ativo', true)
      .order('total_vendas', { ascending: false })
      .limit(20);
    
    setProdutos(prods || []);
    setLoading(false);
  };

  const produtosFiltrados = selectedCategory
    ? produtos.filter(p => p.categoria_id === selectedCategory)
    : produtos;

  const handleAddToCart = (produto) => {
    addItem({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      imagem_url: produto.imagem_url,
      quantidade: 1
    });
  };

  const categoriaIcons = {
    'Pizzas': '🍕',
    'Hambúrgueres': '🍔',
    'Bebidas': '🥤',
    'Sobremesas': '🍰',
    'Combos': '🎁'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header Sticky */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container-mobile py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#E61919]" />
              <div>
                <p className="text-xs text-gray-500">Entregar em</p>
                <p className="font-semibold text-sm">Araxá, MG</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/carrinho')}
              className="relative"
            >
              <ShoppingCart size={24} className="text-[#1A1A1A]" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E61919] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar pizzas, hambúrgueres..."
              className="w-full pl-11 pr-4 py-3 bg-[#F5F5F5] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#E61919]"
            />
          </div>
        </div>
      </header>

      {/* Banner Promocional VERMELHO */}
      <section className="container-mobile py-6">
        <div className="bg-gradient-to-r from-[#E61919] to-[#ff3333] rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={20} />
              <span className="text-sm font-semibold uppercase tracking-wide">Promoção</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Pizza no Cone</h2>
            <p className="text-sm opacity-90 mb-4">Peça 2 e ganhe 15% OFF</p>
            <button className="bg-white text-[#E61919] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors">
              Aproveitar
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white opacity-10 rounded-full transform translate-x-1/2"></div>
        </div>
      </section>

      {/* Categorias Circulares */}
      <section className="container-mobile py-4">
        <h3 className="text-lg font-bold mb-4">Categorias</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`category-icon flex-shrink-0 ${!selectedCategory ? 'ring-2 ring-[#FFC107]' : ''}`}
          >
            <span className="text-3xl">⭐</span>
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-icon flex-shrink-0 ${selectedCategory === cat.id ? 'ring-2 ring-[#FFC107]' : ''}`}
            >
              <span className="text-3xl">{categoriaIcons[cat.nome] || cat.icone || '🍽️'}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1 rounded-full text-sm font-medium flex-shrink-0 transition-colors ${
              !selectedCategory 
                ? 'bg-[#FFC107] text-[#1A1A1A]' 
                : 'bg-white text-gray-600'
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1 rounded-full text-sm font-medium flex-shrink-0 transition-colors ${
                selectedCategory === cat.id 
                  ? 'bg-[#FFC107] text-[#1A1A1A]' 
                  : 'bg-white text-gray-600'
              }`}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de Produtos */}
      <section className="container-mobile py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-[#E61919]" />
            Mais Vendidos
          </h3>
        </div>

        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado</p>
            <p className="text-sm text-gray-400 mt-2">Cadastre produtos no painel admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {produtosFiltrados.map((produto) => (
              <div key={produto.id} className="card overflow-hidden animate-slide-up">
                <div className="aspect-square bg-gray-100 relative">
                  {produto.imagem_url ? (
                    <img
                      src={produto.imagem_url}
                      alt={produto.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🍕
                    </div>
                  )}
                  {produto.preco_promocional && (
                    <span className="absolute top-2 right-2 bg-[#FFC107] text-[#1A1A1A] px-2 py-1 rounded-full text-xs font-bold">
                      PROMO
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2">{produto.nome}</h4>
                  {produto.descricao && (
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{produto.descricao}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div>
                      {produto.preco_promocional ? (
                        <>
                          <p className="text-xs text-gray-400 line-through">
                            R$ {produto.preco.toFixed(2)}
                          </p>
                          <p className="text-lg font-bold text-[#E61919]">
                            R$ {produto.preco_promocional.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-[#E61919]">
                          R$ {produto.preco.toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(produto)}
                      className="bg-[#E61919] text-white p-2 rounded-full hover:bg-[#cc1414] transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Banner Clube */}
      <section className="container-mobile py-6">
        <div className="bg-gradient-to-r from-[#1A1A1A] via-[#2d2d2d] to-[#1A1A1A] rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} className="text-[#FFD700]" />
              <span className="premium-badge">VIP</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Clube da Chefa</h2>
            <p className="text-sm opacity-90 mb-4">Descontos exclusivos e frete grátis</p>
            <button 
              onClick={() => navigate('/clube')}
              className="bg-[#FFD700] text-[#1A1A1A] px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#ffd000] transition-colors"
            >
              Ser Membro
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#FFD700] opacity-10 rounded-full transform translate-x-1/2"></div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
