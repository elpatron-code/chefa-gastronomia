import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, Crown, User, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function BottomNav() {
  const location = useLocation();
  const { items } = useCartStore();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/cardapio', icon: UtensilsCrossed, label: 'Cardápio' },
    { path: '/carrinho', icon: ShoppingCart, label: 'Carrinho', badge: items.length },
    { path: '/clube', icon: Crown, label: 'Clube' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="container-mobile flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="relative">
                <Icon size={24} />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E61919] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
