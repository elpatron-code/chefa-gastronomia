import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft,
  MapPin, 
  User, 
  Phone, 
  Home,
  CreditCard,
  Smartphone,
  Banknote,
  Truck,
  Store,
  CheckCircle
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [tipoPedido, setTipoPedido] = useState('delivery');
  const [trocoPara, setTrocoPara] = useState('');
  
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cep, setCep] = useState('');

  const taxaEntrega = tipoPedido === 'delivery' ? 5.00 : 0;
  const totalComTaxa = total + taxaEntrega;

  const handleFinalizarPedido = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    setLoading(true);

    try {
      let clienteId = null;
      
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('telefone', telefone)
        .single();

      if (clienteExistente) {
        clienteId = clienteExistente.id;
        await supabase
          .from('clientes')
          .update({
            nome,
            email: email || null,
            ultima_compra: new Date().toISOString(),
            total_pedidos: supabase.raw('total_pedidos + 1'),
            total_gasto: supabase.raw(`total_gasto + ${totalComTaxa}`)
          })
          .eq('id', clienteId);
      } else {
        const { data: novoCliente, error: erroCliente } = await supabase
          .from('clientes')
          .insert({
            nome,
            telefone,
            email: email || null,
            total_pedidos: 1,
            total_gasto: totalComTaxa,
            primeira_compra: new Date().toISOString(),
            ultima_compra: new Date().toISOString()
          })
          .select()
          .single();

        if (erroCliente) throw erroCliente;
        clienteId = novoCliente.id;
      }

      const enderecoData = tipoPedido === 'delivery' ? {
        rua, numero, bairro, complemento, cep
      } : null;

      const itensFormatados = items.map(item => ({
        produto_id: item.id,
        nome: item.nome,
        quantidade: item.quantidade,
        preco_unitario: item.preco,
        tamanho: item.tamanho || null,
        adicionais: item.adicionais || [],
        observacao: item.observacao || null,
        subtotal: item.preco * item.quantidade
      }));

      const { data: pedido, error: erroPedido } = await supabase
        .from('pedidos')
        .insert({
          cliente_id: clienteId,
          cliente_nome: nome,
          cliente_telefone: telefone,
          cliente_endereco: enderecoData,
          itens: itensFormatados,
          subtotal: total,
          taxa_entrega: taxaEntrega,
          desconto: 0,
          total: totalComTaxa,
          forma_pagamento: formaPagamento,
          troco_para: formaPagamento === 'dinheiro' && trocoPara ? parseFloat(trocoPara) : null,
          status_pagamento: 'pendente',
          tipo_pedido: tipoPedido,
          status: 'pendente',
          whatsapp_enviado: false,
          impresso: false,
          nfe_emitida: false,
          is_clube: false
        })
        .select()
        .single();

      if (erroPedido) throw erroPedido;

      clearCart();
      navigate('/pedido-confirmado', { 
        state: { 
          numeroPedido: pedido.numero_pedido,
          total: totalComTaxa 
        } 
      });

    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      alert('Erro ao finalizar pedido. Tente novamente!');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Carrinho Vazio</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Voltar ao Cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container-mobile py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} className="text-[#1A1A1A]" />
          </button>
          <h1 className="text-xl font-bold">Finalizar Pedido</h1>
        </div>
      </header>

      <form onSubmit={handleFinalizarPedido} className="container-mobile py-6 space-y-4">
        {/* Tipo de Pedido */}
        <section className="card p-5">
          <h2 className="text-lg font-bold mb-4">Tipo de Pedido</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipoPedido('delivery')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                tipoPedido === 'delivery'
                  ? 'border-[#E61919] bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <Truck className={`mx-auto mb-2 ${tipoPedido === 'delivery' ? 'text-[#E61919]' : 'text-gray-400'}`} size={32} />
              <span className="font-semibold text-sm">Delivery</span>
              <p className="text-xs text-gray-500 mt-1">R$ 5,00</p>
            </button>
            <button
              type="button"
              onClick={() => setTipoPedido('retirada')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                tipoPedido === 'retirada'
                  ? 'border-[#E61919] bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <Store className={`mx-auto mb-2 ${tipoPedido === 'retirada' ? 'text-[#E61919]' : 'text-gray-400'}`} size={32} />
              <span className="font-semibold text-sm">Retirada</span>
              <p className="text-xs text-gray-500 mt-1">Grátis</p>
            </button>
          </div>
        </section>

        {/* Dados Pessoais */}
        <section className="card p-5">
          <h2 className="text-lg font-bold mb-4">Seus Dados</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline mr-2" size={16} />
                Nome Completo *
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 bg-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E61919]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline mr-2" size={16} />
                WhatsApp *
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 bg-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E61919]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (opcional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E61919]"
              />
            </div>
          </div>
        </section>

        {/* Endereço */}
        {tipoPedido === 'delivery' && (
          <section className="card p-5">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-[#E61919]" />
              Endereço de Entrega
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <input
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  placeholder="Rua"
                  className="col-span-3 px-4 py-3 bg-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E61919]"
                  required={tipoPedido === 'delivery'}
                />
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Nº"
                  className="px-4 py-3 bg-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E61919]"
                  required={tipoPedido === 'delivery'}
                />
              </div>

              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Bairro"
                className="w-full px-4 py-3 bg-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E61919]"
                required={tipoPedido === 'delivery'}
              />

              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Complemento (opcional)"
                className="w-full px-4 py-3 bg-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E61919]"
              />

              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="CEP"
                className="w-full px-4 py-3 bg-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E61919]"
                required={tipoPedido === 'delivery'}
              />
            </div>
          </section>
        )}

        {/* Forma de Pagamento */}
        <section className="card p-5">
          <h2 className="text-lg font-bold mb-4">Pagamento</h2>
          <div className="space-y-2">
            {[
              { id: 'pix', icon: Smartphone, label: 'PIX' },
              { id: 'credito', icon: CreditCard, label: 'Crédito' },
              { id: 'debito', icon: CreditCard, label: 'Débito' },
              { id: 'dinheiro', icon: Banknote, label: 'Dinheiro' }
            ].map((forma) => {
              const Icon = forma.icon;
              return (
                <button
                  key={forma.id}
                  type="button"
                  onClick={() => setFormaPagamento(forma.id)}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    formaPagamento === forma.id
                      ? 'border-[#E61919] bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Icon size={24} className={formaPagamento === forma.id ? 'text-[#E61919]' : 'text-gray-400'} />
                  <span className="font-semibold">{forma.label}</span>
                </button>
              );
            })}

            {formaPagamento === 'dinheiro' && (
              <input
                type="number"
                value={trocoPara}
                onChange={(e) => setTrocoPara(e.target.value)}
                placeholder="Troco para quanto? (opcional)"
                className="w-full px-4 py-3 bg-[#F5F5F5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E61919] mt-3"
              />
            )}
          </div>
        </section>

        {/* Resumo */}
        <section className="card p-5">
          <h2 className="text-lg font-bold mb-4">Resumo</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            {tipoPedido === 'delivery' && (
              <div className="flex justify-between text-gray-600">
                <span>Entrega</span>
                <span>R$ {taxaEntrega.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-[#E61919]">
              R$ {totalComTaxa.toFixed(2)}
            </span>
          </div>
        </section>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="spinner !w-5 !h-5 !border-2"></div>
              Finalizando...
            </>
          ) : (
            <>
              <CheckCircle size={24} />
              Finalizar Pedido
            </>
          )}
        </button>
      </form>

      <BottomNav />
    </div>
  );
}
