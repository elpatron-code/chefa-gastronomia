import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Clube from './pages/Clube';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminPedidos from './pages/admin/AdminPedidos';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido-confirmado" element={<OrderSuccess />} />
        <Route path="/clube" element={<Clube />} />
        
        {/* Login admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Rotas admin protegidas */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPedidos />} />
          <Route path="cardapio" element={<div className="p-8">Cardápio (Em desenvolvimento)</div>} />
          <Route path="cupons" element={<div className="p-8">Cupons (Em desenvolvimento)</div>} />
          <Route path="clube" element={<div className="p-8">Clube (Em desenvolvimento)</div>} />
          <Route path="clientes" element={<div className="p-8">Clientes (Em desenvolvimento)</div>} />
          <Route path="relatorios" element={<div className="p-8">Relatórios (Em desenvolvimento)</div>} />
          <Route path="remarketing" element={<div className="p-8">Remarketing (Em desenvolvimento)</div>} />
          <Route path="configuracoes" element={<div className="p-8">Configurações (Em desenvolvimento)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
