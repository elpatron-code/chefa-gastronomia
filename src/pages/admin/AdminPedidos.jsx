import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, Search, Phone, MapPin, Clock, DollarSign, Check, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  // Carregar pedidos
  useEffect(() => {
    carregarPedidos();
    
    // Realtime - escutar novos pedidos
    const channel = supabase
      .channel('pedidos_realtime')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pedidos' }, 
        (payload) => {
          console.log('Mudança detectada:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Novo pedido - tocar som e mostrar notificação
            tocarSomNotificacao();
            toast.success('🔔 Novo pedido recebido!', {
              description: `Pedido #${payload.new.numero_pedido} - ${payload.new.cliente_nome}`,
              duration: 5000,
            });
            setPedidos(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Atualizar pedido existente
            setPedidos(prev => 
              prev.map(p => p.id === payload.new.id ? payload.new : p)
            );
          } else if (payload.eventType === 'DELETE') {
            // Remover pedido
            setPedidos(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const carregarPedidos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
    } else {
      setPedidos(data || []);
    }
    setLoading(false);
  };

  const tocarSomNotificacao = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKXh8LhjHAU2jdXwzn4yBSR0xO/ekj4KElyx6OyrWRYJQpzd8L90IwUogcvx24w4BxxqvvDlnU4NEU+j3+27ZB0FNIvU79B+MwUjcsLu45dCChFYr+frrVoXCj+Y2+6+eCUFJX7I8daOOQcbbLzv5qBPDBBNodzuul0jBTOI0+7RgDUGIW6+7uWaTwwQTZ/a7r1hJAUyi9Hu0oA2ByJuvu3lmU8NEEyf2e69YSQFMovP7tGANgYibr3t5ZlPDBBNn9ruvWEkBDKLzu/RgDUHI2+/7uWbUAwRTZ3a7r9jJQYzjNDv0oA1ByJuv+3lnFAMEE2d2e6/YyUGMorQ7tKBNQcibbzv5ZtPDBFMndnvwGUmBjOL0O/SgjUHImm77+WdUQwRTZzZ7sFkJgYyjNDu1IIzBiNqu+/moFEMEEyb2O/CZScHM4zQ7tSDNQciar3u56BSCxBMnNfu0GQmBzOM0e/UgjUHI2m97+ehUQsQS5zY7tFkJQczjNHu1II1ByNqvO/moVILEUub2e/QZCUGMozP79SCNgcjaLrv5qJSCxFKm9nv0GQnBjOL0O/SgjUHI2q97+egUwsRS5vY79FlJgYziM/v1II2ByNpu+/lpFMLEEqb2e/RZSYGM4jQ79SCNQcjabvv5qFSCxFLnNnv0WQnBjKI0O/UgzUHI2m87uedUQwRTJ/a78BkJQYyjdDv1II1BzKd0u7fZykGM4rS7tKDNgcibLrv5Z9QCxBNmdjvwGQmBjOM0O/UgjUGI2m77+WgUAsQS5zY7tFlJQYzidHv1II2ByNpvu/moVELEUuc2e/SZCUGMorR79SCNQcjabnv5qJSCxBLndnv0GQnBTOK0e/SgTYHI2q77+aiUwsRSpvZ79BkJwUyitHv0oE2ByNqu+/moVILEEqb2e/RZCcFM4rR79KCNgcjabvv5aJSCxBKm9nu0mQmBTOK0e/Sgjb/I2m77+WiUgsRS5vZ79FkJgYzidHv1II2ByNpu+/loVELEUuc2O/QZCcHM4rR79SBNQcjabvv5aFSCxFLm9nv0WQnBzOK0O/SgjYHI2m77+WhUQsRS5zY7tFlJwczitHv0oI2ByNpu+/lolELEUub2e/RZCcHM4rR79KCNgcjabvv5aFSCxFLnNju0WQnBzOK0O/SgjYHI2m77+WiUQsRS5vZ79FkJwczitHv0oE1ByNpve/loVILEUub2e/RZSYIM4rR79SCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpve/loVILEUub2e/RZSYIM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScIM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpve/loVILEUub2e/RZSYIM4rR79SCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScIM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScIM4rR79SCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScHM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScHM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScHM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScHM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScHM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScHM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScHM4rR79KCNgciabvv5aJRCxFLnNju0WQnBzOK0O/SgjYHI2m77+WhUQsRS5vZ79FkJwczitHv0oI2ByNpu+/lolILEUub2e/RZScHM4rR79KCNgciabrwJaLSixNLndjt0KQoBzSL0u/RgzUHJGm477+XikwsRS5zY7dFkJwczitHv0oI2ByJpu+/lolILEUub2e/RZScHM4rR79KCNgciabvv5aJSCxFLnNjt0WQnBzOK0e/SgjYHImm78CWi0osTS53Y7dCkKAc0i9Lv0YM1ByRpuO+/l4pMLEUuc2O3RZCcHM4rR79KCNgciabvv5aJSCxFLm9nv0WUnBzOK0e/SgjYHImm77+WiUgsRS5zY7dFkJwczitHv0oI2ByJpu/AlorKLE0ud2O3QpCgHNIvS79GDNQckabjvv5eKTC=');
    audio.play();
  };

  const mudarStatus = async (pedidoId, novoStatus) => {
    const { error } = await supabase
      .from('pedidos')
      .update({ 
        status: novoStatus,
        [`${novoStatus}_em`]: new Date().toISOString()
      })
      .eq('id', pedidoId);

    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      toast.success('Status atualizado!');
    }
  };

  const pedidosFiltrados = pedidos
    .filter(p => {
      if (filtroStatus === 'todos') return true;
      return p.status === filtroStatus;
    })
    .filter(p => {
      if (!busca) return true;
      return (
        p.numero_pedido?.toString().includes(busca) ||
        p.cliente_nome?.toLowerCase().includes(busca.toLowerCase()) ||
        p.cliente_telefone?.includes(busca)
      );
    });

  const contadores = {
    todos: pedidos.length,
    pendente: pedidos.filter(p => p.status === 'pendente').length,
    preparando: pedidos.filter(p => p.status === 'preparando').length,
    saindo: pedidos.filter(p => p.status === 'saindo').length,
    entregue: pedidos.filter(p => p.status === 'entregue').length,
  };

  const getStatusColor = (status) => {
    const colors = {
      pendente: 'bg-red-500',
      preparando: 'bg-yellow-500',
      saindo: 'bg-blue-500',
      entregue: 'bg-green-500',
      cancelado: 'bg-gray-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendente: 'PENDENTE',
      preparando: 'PREPARANDO',
      saindo: 'SAINDO',
      entregue: 'ENTREGUE',
      cancelado: 'CANCELADO',
    };
    return labels[status] || status.toUpperCase();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <div className="flex items-center gap-4">
            {contadores.pendente > 0 && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
                <Bell size={20} />
                <span className="font-bold">{contadores.pendente}</span>
              </div>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFiltroStatus('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroStatus === 'todos'
                ? 'bg-[#E8741A] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todos ({contadores.todos})
          </button>
          <button
            onClick={() => setFiltroStatus('pendente')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroStatus === 'pendente'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pendentes ({contadores.pendente})
          </button>
          <button
            onClick={() => setFiltroStatus('preparando')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroStatus === 'preparando'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Preparando ({contadores.preparando})
          </button>
          <button
            onClick={() => setFiltroStatus('saindo')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroStatus === 'saindo'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Saindo ({contadores.saindo})
          </button>
          <button
            onClick={() => setFiltroStatus('entregue')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filtroStatus === 'entregue'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Entregues ({contadores.entregue})
          </button>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por número, cliente ou telefone..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {pedidosFiltrados.map((pedido) => (
          <div
            key={pedido.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header do Card */}
            <div className={`${getStatusColor(pedido.status)} text-white px-4 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">#{pedido.numero_pedido}</span>
                <span className="text-sm opacity-90">{getStatusLabel(pedido.status)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Clock size={16} />
                <span>{new Date(pedido.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Dados do Cliente */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start gap-2 mb-2">
                <div className="text-gray-900 font-semibold">{pedido.cliente_nome}</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Phone size={16} />
                <span>{pedido.cliente_telefone}</span>
              </div>
              {pedido.cliente_endereco && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">
                    {pedido.cliente_endereco.rua}, {pedido.cliente_endereco.numero} - {pedido.cliente_endereco.bairro}
                  </span>
                </div>
              )}
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  pedido.tipo_pedido === 'delivery' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {pedido.tipo_pedido === 'delivery' ? '🚗 DELIVERY' : '🏪 RETIRADA'}
                </span>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="p-4 border-b border-gray-100 max-h-48 overflow-y-auto">
              {pedido.itens?.map((item, idx) => (
                <div key={idx} className="mb-3 last:mb-0">
                  <div className="font-medium text-gray-900">
                    {item.quantidade}x {item.nome}
                  </div>
                  {item.tamanho && (
                    <div className="text-sm text-gray-600 ml-4">Tamanho: {item.tamanho}</div>
                  )}
                  {item.adicionais && item.adicionais.length > 0 && (
                    <div className="text-sm text-gray-600 ml-4">
                      + {item.adicionais.map(a => a.nome).join(', ')}
                    </div>
                  )}
                  {item.observacao && (
                    <div className="text-sm text-gray-600 ml-4 italic">Obs: {item.observacao}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Total e Pagamento */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Forma de pagamento:</span>
                <span className="font-medium text-gray-900">{pedido.forma_pagamento?.toUpperCase()}</span>
              </div>
              {pedido.cupom_usado && (
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-green-600">Cupom: {pedido.cupom_usado}</span>
                  <span className="text-green-600">-R$ {pedido.desconto?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-bold text-lg">
                <span className="text-gray-900">Total:</span>
                <span className="text-[#E8741A]">R$ {pedido.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Ações */}
            <div className="p-4 flex gap-2">
              {pedido.status === 'pendente' && (
                <button
                  onClick={() => mudarStatus(pedido.id, 'preparando')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Confirmar
                </button>
              )}
              {pedido.status === 'preparando' && (
                <button
                  onClick={() => mudarStatus(pedido.id, 'saindo')}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Saiu pra Entrega
                </button>
              )}
              {pedido.status === 'saindo' && (
                <button
                  onClick={() => mudarStatus(pedido.id, 'entregue')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Marcar Entregue
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {pedidosFiltrados.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhum pedido encontrado</p>
        </div>
      )}
    </div>
  );
}
