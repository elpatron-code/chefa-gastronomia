import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Star, Truck, Tag, Zap, CheckCircle, Gift, TrendingUp } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Clube() {
  const navigate = useNavigate();
  const [planoSelecionado, setPlanoSelecionado] = useState('mensal');

  const planos = {
    mensal: { valor: 39.90, economia: 0, label: 'Mensal' },
    trimestral: { valor: 107.70, economia: 10, label: 'Trimestral', destaque: 'Economize 10%' },
    anual: { valor: 383.04, economia: 20, label: 'Anual', destaque: 'Economize 20%' }
  };

  const beneficios = [
    {
      icon: Tag,
      titulo: '10% OFF em Tudo',
      descricao: 'Desconto em todos os pedidos, sem exceção',
      cor: '#E61919'
    },
    {
      icon: Truck,
      titulo: 'Frete Grátis',
      descricao: 'Entrega grátis em todos os seus pedidos',
      cor: '#FFC107'
    },
    {
      icon: Zap,
      titulo: 'Prioridade no Preparo',
      descricao: 'Seus pedidos têm prioridade na cozinha',
      cor: '#E61919'
    },
    {
      icon: Gift,
      titulo: 'Cupons Exclusivos',
      descricao: 'Acesso a promoções especiais só para membros',
      cor: '#FFD700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] to-[#2d2d2d] pb-24">
      <header className="sticky top-0 z-40 bg-[#1A1A1A]/95 backdrop-blur">
        <div className="container-mobile py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Crown size={24} className="text-[#FFD700]" />
            <h1 className="text-xl font-bold text-white">Clube da Chefa</h1>
          </div>
          <div className="w-6"></div>
        </div>
      </header>

      <section className="container-mobile py-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 px-4 py-2 rounded-full mb-4">
          <Star size={16} className="text-[#FFD700]" />
          <span className="text-[#FFD700] font-bold text-sm uppercase tracking-wide">Premium</span>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-3">Seja Membro VIP</h2>
        <p className="text-gray-300 text-lg mb-6">Descontos exclusivos, frete grátis e muito mais!</p>

        <div className="inline-flex items-center gap-2 bg-[#E61919] text-white px-6 py-3 rounded-full">
          <TrendingUp size={20} />
          <span className="font-bold">Economize até R$ 150/mês</span>
        </div>
      </section>

      <section className="container-mobile py-6">
        <h3 className="text-xl font-bold text-white mb-4">Benefícios Exclusivos</h3>
        <div className="grid grid-cols-1 gap-3">
          {beneficios.map((beneficio, index) => {
            const Icon = beneficio.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${beneficio.cor}20` }}>
                  <Icon size={24} style={{ color: beneficio.cor }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">{beneficio.titulo}</h4>
                  <p className="text-sm text-gray-300">{beneficio.descricao}</p>
                </div>
                <CheckCircle size={20} className="text-[#FFD700] flex-shrink-0 mt-1" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-mobile py-6">
        <h3 className="text-xl font-bold text-white mb-4">Escolha Seu Plano</h3>
        <div className="space-y-3">
          {Object.entries(planos).map(([key, plano]) => (
            <button key={key} onClick={() => setPlanoSelecionado(key)} className={`w-full p-5 rounded-2xl border-2 transition-all ${planoSelecionado === key ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-white/20 bg-white/5'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${planoSelecionado === key ? 'border-[#FFD700]' : 'border-white/40'}`}>
                    {planoSelecionado === key && <div className="w-3 h-3 rounded-full bg-[#FFD700]"></div>}
                  </div>
                  <span className="font-bold text-white text-lg">{plano.label}</span>
                </div>
                {plano.destaque && <span className="premium-badge text-xs">{plano.destaque}</span>}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold text-white">R$ {plano.valor.toFixed(2)}</span>
                  <span className="text-gray-400 text-sm ml-2">/{key === 'mensal' ? 'mês' : key === 'trimestral' ? 'trimestre' : 'ano'}</span>
                </div>
                {plano.economia > 0 && <span className="text-[#FFD700] font-bold text-sm">-{plano.economia}%</span>}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A] to-transparent pt-6 pb-4 z-30">
        <div className="container-mobile">
          <button className="btn-primary w-full text-lg py-4 bg-[#FFD700] hover:bg-[#ffd000] text-[#1A1A1A] shadow-lg">
            <Crown size={24} className="inline mr-2" />
            Tornar-se Membro VIP
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Cancele quando quiser • Sem fidelidade</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
