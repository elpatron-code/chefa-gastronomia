import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Star } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Clube() {
  const navigate = useNavigate();

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

        <button className="btn-primary bg-[#FFD700] hover:bg-[#ffd000] text-[#1A1A1A]">
          <Crown size={24} className="inline mr-2" />
          Tornar-se Membro VIP
        </button>
      </section>

      <BottomNav />
    </div>
  );
}
