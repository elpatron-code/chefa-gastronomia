import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Credenciais fixas
    if (username === 'admin' && password === 'chefa2025') {
      localStorage.setItem('admin_authenticated', 'true');
      navigate('/admin');
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] to-[#8B1A0A] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#E8741A] rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">🍕</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Chefa Admin</h1>
          <p className="text-gray-600 mt-2">Painel Administrativo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#E8741A] hover:bg-[#d66515] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Credenciais padrão:</p>
          <p className="font-mono mt-1">admin / chefa2025</p>
        </div>
      </div>
    </div>
  );
}
