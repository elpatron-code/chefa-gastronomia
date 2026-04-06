import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabase';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  MapPin, 
  User, 
  Phone, 
  Home,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  
  const [loading, setLoading] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [tipoPedido, setTipoPedido] = useState('delivery');
  const [trocoPara, setTrocoPara] = useState('');
  
  // Dados do cliente
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  
  // Endereço (só se for delivery)
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
      // 1. Buscar ou criar cliente
      let clienteId = null;
      
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('telefone', telefone)
        .single();

      if (clienteExistente) {
        clienteId = clienteExistente.id;
        
        // Atualizar dados do cliente
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
        // Criar novo cliente
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

      // 2. Preparar dados do endereço (se delivery)
      const enderecoData = tipoPedido === 'delivery' ? {
        rua,
        numero,
        bairro,
        complemento,
        cep
      } : null;

      // 3. Preparar itens do pedido
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

      // 4. Criar pedido
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

      // 5. Limpar carrinho e redirecionar
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Carrinho Vazio</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-[#E8741A] text-white px-6 py-3 rounded-lg hover:bg-[#d66515] transition-colors"
          >
            Voltar ao Cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Finalizar Pedido</h1>
        </div>

        <form onSubmit={handleFinalizarPedido} className="space-y-6">
          {/* Tipo de Pedido */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tipo de Pedido</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTipoPedido('delivery')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  tipoPedido === 'delivery'
                    ? 'border-[#E8741A] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MapPin className="mx-auto mb-2" size={24} />
                <span className="font-medium">Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setTipoPedido('retirada')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  tipoPedido === 'retirada'
                    ? 'border-[#E8741A] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Home className="mx-auto mb-2" size={24} />
                <span className="font-medium">Retirada</span>
              </button>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Seus Dados</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline mr-2" size={16} />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Endereço (só se delivery) */}
          {tipoPedido === 'delivery' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Endereço de Entrega</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rua *</label>
                    <input
                      type="text"
                      value={rua}
                      onChange={(e) => setRua(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
                      required={tipoPedido === 'delivery'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
                      required={tipoPedido === 'delivery'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
                    required={tipoPedido === 'delivery'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                  <input
                    type="text"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Apto, bloco, etc..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP *</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
                    required={tipoPedido === 'delivery'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Forma de Pagamento */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Forma de Pagamento</h2>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setFormaPagamento('pix')}
                className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                  formaPagamento === 'pix'
                    ? 'border-[#E8741A] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone size={24} />
                <span className="font-medium">PIX</span>
              </button>

              <button
                type="button"
                onClick={() => setFormaPagamento('credito')}
                className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                  formaPagamento === 'credito'
                    ? 'border-[#E8741A] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard size={24} />
                <span className="font-medium">Cartão de Crédito</span>
              </button>

              <button
                type="button"
                onClick={() => setFormaPagamento('debito')}
                className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                  formaPagamento === 'debito'
                    ? 'border-[#E8741A] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard size={24} />
                <span className="font-medium">Cartão de Débito</span>
              </button>

              <button
                type="button"
                onClick={() => setFormaPagamento('dinheiro')}
                className={`w-full p-4 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                  formaPagamento === 'dinheiro'
                    ? 'border-[#E8741A] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Banknote size={24} />
                <span className="font-medium">Dinheiro</span>
              </button>

              {formaPagamento === 'dinheiro' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Troco para quanto? (opcional)
                  </label>
                  <input
                    type="number"
                    value={trocoPara}
                    onChange={(e) => setTrocoPara(e.target.value)}
                    placeholder="R$ 50,00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E8741A] focus:border-transparent outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo do Pedido</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              {tipoPedido === 'delivery' && (
                <div className="flex justify-between text-gray-600">
                  <span>Taxa de Entrega</span>
                  <span>R$ {taxaEntrega.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span className="text-[#E8741A]">R$ {totalComTaxa.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botão Finalizar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E8741A] hover:bg-[#d66515] text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
      </div>
    </div>
  );
}
