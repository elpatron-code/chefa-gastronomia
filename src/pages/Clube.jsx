import { useNavigate } from 'react-router-dom';

export default function Clube() {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1A1A1A', 
      color: 'white',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <button 
        onClick={() => navigate('/')}
        style={{
          background: '#FFD700',
          color: '#1A1A1A',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '2rem'
        }}
      >
        ← Voltar
      </button>
      
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        👑 Clube da Chefa
      </h1>
      
      <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
        Em breve: benefícios VIP exclusivos!
      </p>
    </div>
  );
}
