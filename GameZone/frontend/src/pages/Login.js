import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirigir según el rol del usuario
      if (result.user.role === 'administrador') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `
        radial-gradient(circle at 20% 50%, rgba(32, 178, 170, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(79, 172, 254, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(240, 147, 251, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #764ba2 100%)
      `,
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Elementos decorativos del fondo */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '100px',
        height: '100px',
        background: 'rgba(32, 178, 170, 0.1)',
        borderRadius: '20px',
        transform: 'rotate(45deg)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '80px',
        height: '80px',
        background: 'rgba(79, 172, 254, 0.1)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      {/* Formulario de Login - Basado en página 2 del mockup */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(32, 178, 170, 0.95), rgba(79, 172, 254, 0.95))',
        padding: '3rem',
        borderRadius: '25px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '450px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative'
      }}>
        {/* Título del formulario */}
        <h2 style={{
          marginBottom: '2rem',
          textAlign: 'center',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Inicio Sesión
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Campo de Correo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Correo"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '3px solid #ff6b9d',
                borderRadius: '25px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#20b2aa';
                e.target.style.transform = 'scale(1.02)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.borderColor = '#ff6b9d';
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>

          {/* Campo de Contraseña */}
          <div style={{ marginBottom: '2rem' }}>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Contraseña"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                border: '3px solid #ff6b9d',
                borderRadius: '25px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#20b2aa';
                e.target.style.transform = 'scale(1.02)';
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.borderColor = '#ff6b9d';
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>

          {/* Botón de Iniciar */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #ff6b9d, #4facfe)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              padding: '1rem 2rem',
              width: '100%',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              boxShadow: '0 8px 20px rgba(255, 107, 157, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 30px rgba(255, 107, 157, 0.4)';
                e.target.style.background = 'linear-gradient(135deg, #4facfe, #00f2fe)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 20px rgba(255, 107, 157, 0.3)';
                e.target.style.background = 'linear-gradient(135deg, #ff6b9d, #4facfe)';
              }
            }}
          >
            {loading ? (
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem' 
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid transparent',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Ingresando...
              </span>
            ) : (
              'Iniciar'
            )}
          </button>
        </form>

        {/* Logo GameZone */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'white'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>
              🎮
            </div>
            <div>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '1.2rem',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
              }}>
                GAMEZONE
              </div>
            </div>
          </div>
        </div>

        {/* Enlaces del footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '1.5rem',
          fontSize: '0.9rem'
        }}>
          <Link
            to="/help"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'white'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
          >
            Ayuda
          </Link>
          <Link
            to="/terms"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'white'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
          >
            Términos de uso
          </Link>
          <Link
            to="/privacy"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'white'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
          >
            Privacidad y cookies
          </Link>
        </div>

        {/* Enlace a registro */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          fontSize: '0.95rem'
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            ¿No tienes una cuenta?{' '}
          </span>
          <Link
            to="/register"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.textDecoration = 'underline';
              e.target.style.color = '#20b2aa';
            }}
            onMouseOut={(e) => {
              e.target.style.textDecoration = 'none';
              e.target.style.color = 'white';
            }}
          >
            Regístrate aquí
          </Link>
        </div>
      </div>

      {/* CSS para animaciones */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-20px) rotate(45deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;