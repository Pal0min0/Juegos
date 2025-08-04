import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import { showSuccess, showError } from '../utils/notifications';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getOrderData 
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log('🛒 Cart Component - Datos del carrito:', {
    cartItems,
    cartItemsLength: cartItems?.length,
    isAuthenticated: isAuthenticated(),
    user: user
  });

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleFinalizePurchase = async () => {
    if (!user) {
      showError('Debes iniciar sesión para finalizar la compra');
      return;
    }

    setLoading(true);
    try {
      const orderData = getOrderData(user.id);
      const response = await ApiService.createOrder(orderData);
      
      if (response.success) {
        showSuccess('¡Pedido realizado exitosamente!');
        clearCart();
        navigate('/');
      }
    } catch (error) {
      console.error('Error al crear pedido:', error);
      if (error.message.includes('Stock insuficiente')) {
        showError('Stock insuficiente para algunos productos', 'STOCK_ERROR');
      } else {
        showError('Error al procesar el pedido', error.type || 'ORDER_ERROR');
      }
    } finally {
      setLoading(false);
    }
  };

  // SIEMPRE mostrar algo, independientemente del estado
  return (
    <div className="section" style={{ 
      minHeight: '80vh', 
      paddingTop: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        {/* Header con estilo GameZone */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          <div style={{
            background: '#20b2aa',
            borderRadius: '50%',
            padding: '1rem',
            fontSize: '2rem'
          }}>
            🛒
          </div>
          <h1 style={{ 
            color: '#20b2aa', 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            margin: 0
          }}>
            LISTA DE PRODUCTOS
          </h1>
        </div>

        {/* Verificar autenticación */}
        {!isAuthenticated() ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Debes iniciar sesión</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
              Para ver tu carrito y realizar compras en GameZone, necesitas iniciar sesión.
            </p>
            <Link 
              to="/login" 
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                padding: '12px 30px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block'
              }}
            >
              Iniciar Sesión
            </Link>
          </div>
        ) : !cartItems || cartItems.length === 0 ? (
          /* Carrito vacío */
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
            <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Tu carrito está vacío</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
              ¡Descubre mundos increíbles y colecciona aventuras épicas!
            </p>
            <Link 
              to="/products" 
              style={{
                background: '#20b2aa',
                color: 'white',
                padding: '12px 30px',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block'
              }}
            >
              Explorar GameZone
            </Link>
          </div>
        ) : (
          /* Carrito con productos - Estilo del mockup página 12 */
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* Lista de productos en carrito */}
            <div style={{ marginBottom: '2rem' }}>
              {cartItems.map(item => (
                <div key={item.id_producto} style={{
                  background: 'linear-gradient(135deg, #2c5aa0, #4facfe)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  color: 'white'
                }}>
                  {/* Imagen del producto */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={`/images/${item.imagen}`} 
                      alt={item.nombre}
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                      onError={(e) => { 
                        e.target.style.display = 'none'; 
                        e.target.nextSibling.style.display = 'flex'; 
                      }}
                    />
                    <div style={{ 
                      display: 'none',
                      width: '60px',
                      height: '60px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      {item.categoria === 'videojuegos' ? '🎮' : '🎭'}
                    </div>
                  </div>

                  {/* Información del producto */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      color: '#20b2aa', 
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}>
                      {item.nombre}
                    </h3>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontSize: '0.9rem',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {item.descripcion}
                    </p>
                    <div style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold',
                      color: '#20b2aa'
                    }}>
                      {new Intl.NumberFormat('es-CO').format(item.precio)}
                    </div>
                  </div>

                  {/* Controles de cantidad */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    padding: '0.5rem'
                  }}>
                    <button
                      onClick={() => handleQuantityChange(item.id_producto, item.cantidad - 1)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#20b2aa',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      -
                    </button>
                    <span style={{ 
                      minWidth: '30px', 
                      textAlign: 'center', 
                      fontSize: '1.1rem', 
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id_producto, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        border: 'none',
                        background: item.cantidad >= item.stock ? '#ccc' : '#20b2aa',
                        color: 'white',
                        cursor: item.cantidad >= item.stock ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Precio total y botón eliminar */}
                  <div style={{ 
                    textAlign: 'right',
                    minWidth: '120px'
                  }}>
                    <div style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold',
                      color: '#20b2aa',
                      marginBottom: '0.5rem'
                    }}>
                      {new Intl.NumberFormat('es-CO').format(item.precio * item.cantidad)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id_producto)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>

                  {/* Checkbox de selección (estilo mockup) */}
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid #20b2aa',
                    background: '#20b2aa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>
                    ✓
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen y botón de compra */}
            <div style={{
              background: 'linear-gradient(135deg, #20b2aa, #4facfe)',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                Total: {new Intl.NumberFormat('es-CO').format(getCartTotal())}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={handleFinalizePurchase}
                  disabled={loading}
                  style={{ 
                    background: '#20b2aa',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Procesando...
                    </>
                  ) : (
                    'Comprar'
                  )}
                </button>

                <button
                  onClick={clearCart}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '25px',
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS para la animación de carga */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Cart;