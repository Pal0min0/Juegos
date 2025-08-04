import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import ApiService from '../services/api';
import { showError } from '../utils/notifications';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  const categories = [
    { value: 'all', label: 'Todos los productos', icon: '🎮' },
    { value: 'videojuegos', label: 'Videojuegos', icon: '🎮' },
    { value: 'figuras', label: 'Figuras', icon: '🎭' }
  ];

  // 🖼️ Función para obtener imagen por nombre de producto
  const getProductImage = (product) => {
    const imageMap = {
      // ========== VIDEOJUEGOS ==========
      'Mesmerizer FanGame': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Mesmerizer_song.jpg/250px-Mesmerizer_song.jpg',
      'Shovel Knight': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000029168/4690229e4696dc693a9edb823cdbb5193717de984d0ee2efba9ed91f1e15a8a6',
      'ULTRAKILL': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1229490/capsule_616x353.jpg?t=1740623813',
      'Blasphemous': 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2019/09/blasphemous.jpg',
      'Grand Theft Auto VI': 'https://gaming-cdn.com/images/products/2462/orig/grand-theft-auto-vi-pc-juego-rockstar-cover.jpg?v=1746543065',
      'Hytale': 'https://i.ytimg.com/vi/o77MzDQT1cg/maxresdefault.jpg',
      'Hollow Knight Silksong': 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000003208/4643fb058642335c523910f3a7910575f56372f612f7c0c9a497aaae978d3e51',
      'FNAF Secrets Of The Mimic': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215390/527bbebaa5764de58528487b3f2142c44a58b267/header.jpg?t=1749834013',
      
      // ========== FIGURAS ==========
      'Figura Hatsune Miku': 'https://www.1001hobbies.es/2631894-large_default/furyu-fryu36714-hatsune-miku-pvc-statuette-noodle-stopper-hatsune-miku.jpg',
      'Figura Star Platinum': 'https://m.media-amazon.com/images/I/71RmQInOZmL.jpg',
      'Figura Iron Man': 'https://bleedingcool.com/wp-content/uploads/2023/01/HT-Iron-Man-MK6-V2-Diecast-014-1200x628.jpg',
      'Figura V1 (ULTRAKILL)': 'https://preview.redd.it/v1-ultrakill-figure-v0-hruqvomwd5kd1.jpeg?auto=webp&s=914b98bcfe800029fb7815bf70d7c1a869e12705',
      'Figura Master Chief': 'https://m.media-amazon.com/images/I/71ugrrkR3jS._AC_SL1500_.jpg',
      'Figura Dr. House': 'https://www.machinegun.fr/products_img/4483/C_1.jpg'
    };
    
    // Si existe la imagen específica, la usa, sino usa un placeholder personalizado
    return imageMap[product.nombre] || 
           `https://via.placeholder.com/400x400/${getPlaceholderColor(product.categoria)}/FFFFFF?text=${encodeURIComponent(product.nombre.substring(0, 10))}`;
  };

  // 🎨 Función para obtener color del placeholder según categoría
  const getPlaceholderColor = (categoria) => {
    const colors = {
      'videojuegos': '4A90E2',
      'figuras': 'FF6B9D',
      'consolas': '00D4AA',
      'accesorios': 'FFA502'
    };
    return colors[categoria] || '4A90E2';
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Filtrar productos cuando cambie la categoría o término de búsqueda
  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const loadProducts = async () => {
    try {
      const response = await ApiService.getProducts();
      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      showError('Error al cargar productos', 'DATABASE_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      videojuegos: '🎮',
      figuras: '🎭'
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category) => {
    const colors = {
      videojuegos: 'linear-gradient(135deg, #667eea, #764ba2)',
      figuras: 'linear-gradient(135deg, #f093fb, #f5576c)'
    };
    return colors[category] || 'linear-gradient(135deg, #20b2aa, #4facfe)';
  };

  // 🖼️ Componente de imagen con mejor manejo de errores
  const ProductImage = ({ product }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    return (
      <div style={{
        height: '220px',
        background: getCategoryColor(product.categoria),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '4rem',
        color: 'white',
        marginBottom: '1.5rem',
        borderRadius: '15px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Loader mientras carga la imagen */}
        {!imageLoaded && !imageError && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '1rem'
          }}>
            <div style={{
              width: '30px',
              height: '30px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 0.5rem'
            }}></div>
            Cargando...
          </div>
        )}

        {/* Imagen del producto */}
        {!imageError && (
          <img 
            src={getProductImage(product)}
            alt={product.nombre}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '15px',
              transition: 'all 0.3s ease',
              opacity: imageLoaded ? 1 : 0
            }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}

        {/* Fallback si hay error en la imagen */}
        {imageError && (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '1rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
              {getCategoryIcon(product.categoria)}
            </div>
            <div style={{ 
              fontSize: '0.9rem', 
              opacity: 0.9,
              fontWeight: 'bold'
            }}>
              {product.nombre}
            </div>
          </div>
        )}
        
        {/* Badge de categoría */}
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#333',
          padding: '0.4rem 1rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          textTransform: 'capitalize',
          backdropFilter: 'blur(10px)'
        }}>
          {getCategoryIcon(product.categoria)} {product.categoria}
        </div>

        {/* Badge de stock */}
        {product.stock <= 5 && (
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            background: product.stock === 0 ? '#ff4757' : '#ffa502',
            color: 'white',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            animation: product.stock === 0 ? 'pulse 2s infinite' : 'none',
            backdropFilter: 'blur(10px)'
          }}>
            {product.stock === 0 ? '❌ Agotado' : `⚠️ Solo ${product.stock}`}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid transparent',
            borderTop: '4px solid #20b2aa',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 2rem'
          }}></div>
          <p style={{ fontSize: '1.2rem' }}>Cargando la GameZone...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #764ba2 100%)',
      paddingTop: '2rem'
    }}>
      <div className="container">
        {/* Header de la página */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #20b2aa, #4facfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem'
          }}>
            Explora GameZone
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: 0.9,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
            Tu zona de juegos favorita
          </p>
        </div>

        {/* Filtros gaming */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '25px',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Categorías como botones gaming */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                style={{
                  background: selectedCategory === category.value 
                    ? 'linear-gradient(135deg, #20b2aa, #4facfe)' 
                    : 'linear-gradient(135deg, #e9ecef, #f8f9fa)',
                  color: selectedCategory === category.value ? 'white' : '#666',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '150px',
                  justifyContent: 'center',
                  boxShadow: selectedCategory === category.value 
                    ? '0 8px 20px rgba(32, 178, 170, 0.3)' 
                    : '0 4px 10px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  if (selectedCategory !== category.value) {
                    e.target.style.background = 'linear-gradient(135deg, #20b2aa, #4facfe)';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedCategory !== category.value) {
                    e.target.style.background = 'linear-gradient(135deg, #e9ecef, #f8f9fa)';
                    e.target.style.color = '#666';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Barra de búsqueda gaming */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar juegos, figuras, marcas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  border: '3px solid #20b2aa',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4facfe';
                  e.target.style.boxShadow = '0 0 20px rgba(32, 178, 170, 0.3)';
                  e.target.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#20b2aa';
                  e.target.style.boxShadow = 'none';
                  e.target.style.transform = 'scale(1)';
                }}
              />
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              style={{
                background: 'linear-gradient(135deg, #ff6b9d, #4facfe)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(255, 107, 157, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🗑️ Limpiar
            </button>
          </div>

          <div style={{ 
            marginTop: '1rem', 
            color: '#666',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}>
            <span style={{ fontWeight: 'bold', color: '#20b2aa' }}>
              {filteredProducts.length}
            </span> productos encontrados de <span style={{ fontWeight: 'bold' }}>
              {products.length}
            </span> totales
          </div>
        </div>

        {/* Lista de productos */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '4rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '25px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              No se encontraron productos
            </h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
              Intenta cambiar los filtros o buscar algo diferente
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
            paddingBottom: '3rem'
          }}>
            {filteredProducts.map(product => (
              <div key={product.id_producto} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
              }}
              >
                {/* Decoración de categoría */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '100px',
                  height: '100px',
                  background: getCategoryColor(product.categoria),
                  borderRadius: '50%',
                  opacity: 0.1
                }}></div>

                {/* ✨ Imagen mejorada del producto */}
                <ProductImage product={product} />

                <div>
                  <h3 style={{ 
                    fontSize: '1.4rem', 
                    marginBottom: '0.8rem', 
                    color: '#2c3e50',
                    fontWeight: 'bold'
                  }}>
                    {product.nombre}
                  </h3>
                  
                  <p style={{ 
                    color: '#7f8c8d', 
                    marginBottom: '1rem', 
                    fontSize: '0.95rem',
                    lineHeight: '1.4'
                  }}>
                    {product.descripcion}
                  </p>

                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(32, 178, 170, 0.1)',
                    borderRadius: '10px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>
                        Desarrollador/Marca
                      </div>
                      <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        {product.marca}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>
                        Disponibles
                      </div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        color: product.stock > 10 ? '#27ae60' : product.stock > 0 ? '#f39c12' : '#e74c3c'
                      }}>
                        {product.stock} unidades
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#20b2aa',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
                  }}>
                    ${new Intl.NumberFormat('es-CO').format(product.precio)}
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    style={{
                      width: '100%',
                      background: product.stock > 0 
                        ? 'linear-gradient(135deg, #20b2aa, #4facfe)' 
                        : 'linear-gradient(135deg, #bdc3c7, #95a5a6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseOver={(e) => {
                      if (product.stock > 0) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 20px rgba(32, 178, 170, 0.4)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (product.stock > 0) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {product.stock > 0 ? (
                      <>
                        🛒 Agregar al Carrito
                      </>
                    ) : (
                      <>
                        ❌ Sin Stock
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS para animaciones */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
      `}</style>
    </div>
  );
};

export default Products;