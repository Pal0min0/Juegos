import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ApiService from '../services/api';
import { showError } from '../utils/notifications';

// Importar imágenes desde la carpeta public/images
const gameImages = {
  ultrakill: '/images/B146s75E2sL._SX412_QL65_FMwebp_.webp',
  hollowKnight: '/images/Hollow_Knight_first_cover_art.webp.png',
  seaThieves: '/images/Sea_of_thieves_cover_art.jpg',
  minecraftLegends: '/images/Minecraft_Legends_Cover_Art.jpg',
  celeste: '/images/Celeste_box_art_full.png',
  fnaf: '/images/yo-so-can-someone-put-all-the-fnaf-games-in-release-date-v0-76twdndjwqie1.webp',
  gta: '/images/GTA-6.jpg',
  hytale:'/images/hytale.jpg',
  shovelKnight:'/images/shovel.jpg',
  blasphemous:'/images/blasphemous.jfif',
  mesmerizer:'/images/mesmerizer.png',
  

};

const figureImages = {
  anime: '/images/anime-icon.webp',
  robots: '/images/robots-icon.jpg',
  heroes: '/images/heroes-icon.jpg',
  hatsuneMiku: '/images/hatsune-miku-icon.png',
  starPlatinum: '/images/star-platinum-icon.jpg',
  Series:'/images/walte.jpg'
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();

  // Slides del carrusel configurados con las imágenes de tu estructura
  const slides = [
    {
      id: 1,
      type: 'games',
      title1: 'Tu Zona de',
      title2: 'Juegos',
      title3: 'Favorita!',
      subtitle: 'Descubre mundos, supera retos,\ncolecciona aventuras',
      buttonText: 'Explora lo mejor del gaming ahora →',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      gameItems: [
        { 
          name: 'ULTRAKILL', 
          image: gameImages.ultrakill,
          size: '1.5rem' 
        },
        { 
          name: 'Hollow Knight', 
          image: gameImages.hollowKnight,
          size: '1.2rem' 
        },
        { 
          name: 'Sea of Thieves', 
          image: gameImages.seaThieves,
          size: '1rem' 
        },
        { 
          name: 'Minecraft Legends', 
          image: gameImages.minecraftLegends,
          size: '1.3rem', 
          span: 2 
        },
        { 
          name: 'Celeste', 
          image: gameImages.celeste,
          size: '1rem' 
        },
        { 
          name: 'FNAF', 
          image: gameImages.fnaf,
          size: '1rem' 
        }
      ]
    },
    {
      id: 2,
      type: 'figures',
      title1: 'La aventura',
      title2: 'también se',
      title3: 'colecciona!',
      subtitle: 'Anime, videojuegos, sci-fi, ¡todo está\naquí!',
      buttonText: 'Encuentra desde clásicos hasta rarezas →',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
      figureItems: [
        { 
          name: 'Anime', 
          image: figureImages.anime 
        },
        { 
          name: 'Robots', 
          image: figureImages.robots 
        },
        { 
          name: 'Heroes', 
          image: figureImages.heroes 
        },
        { 
          name: 'Series', 
          image: figureImages.Series,
          
        },
        { 
          name: 'Hatsune Miku', 
          image: figureImages.hatsuneMiku,
          span: 2 
        },
        { 
          name: 'Star Platinum', 
          image: figureImages.starPlatinum,
          span: 2 
        }
      ]
    }
  ];

  // Cargar productos destacados al montar el componente
  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const loadFeaturedProducts = async () => {
    try {
      const response = await ApiService.getProducts();
      if (response.success) {
        const games = response.products.filter(p => p.categoria === 'videojuegos').slice(0, 3);
        const figures = response.products.filter(p => p.categoria === 'figuras').slice(0, 3);
        setFeaturedProducts([...games, ...figures]);
      }
    } catch (error) {
      showError('Error al cargar productos', 'DATABASE_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {/* Carrusel Hero Section */}
      <section style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Slides del carrusel */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: slide.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fff',
              transform: `translateX(${(index - currentSlide) * 100}%)`,
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: index === currentSlide ? 1 : 0.7
            }}
          >
            {/* Elementos decorativos del fondo */}
            <div style={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: '400px',
              height: '400px',
              background: slide.type === 'games' 
                ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' 
                : 'linear-gradient(45deg, #a8e6cf, #ffd93d)',
              borderRadius: '50%',
              opacity: '0.1',
              animation: 'float 6s ease-in-out infinite'
            }}></div>
            
            <div style={{
              position: 'absolute',
              bottom: '10%',
              left: '5%',
              width: '200px',
              height: '200px',
              background: slide.type === 'games' 
                ? 'linear-gradient(45deg, #a8e6cf, #ffd93d)' 
                : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              opacity: '0.1'
            }}></div>

            <div className="container" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4rem', 
              zIndex: 2,
              flexDirection: slide.type === 'figures' ? 'row-reverse' : 'row'
            }}>
              {/* Texto principal */}
              <div style={{ flex: 1 }}>
                <h1 style={{
                  fontSize: '4rem',
                  marginBottom: '1rem',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                  animation: index === currentSlide ? 'fadeInUp 1s ease-out' : 'none',
                  background: 'linear-gradient(45deg, #20b2aa, #4facfe)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1.1'
                }}>
                  {slide.title1}<br/>
                  {slide.title2}<br/>
                  {slide.title3}
                </h1>
                <p style={{
                  fontSize: '1.3rem',
                  marginBottom: '2rem',
                  opacity: 0.9,
                  animation: index === currentSlide ? 'fadeInUp 1s ease-out 0.3s both' : 'none',
                  whiteSpace: 'pre-line'
                }}>
                  {slide.subtitle}
                </p>
                <Link 
                  to="/products" 
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(45deg, #20b2aa, #4facfe)',
                    color: '#fff',
                    padding: '1rem 2rem',
                    textDecoration: 'none',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 10px 30px rgba(32, 178, 170, 0.4)',
                    animation: index === currentSlide ? 'fadeInUp 1s ease-out 0.6s both' : 'none'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 15px 40px rgba(32, 178, 170, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(32, 178, 170, 0.4)';
                  }}
                >
                  {slide.buttonText}
                </Link>
              </div>

              {/* Grid de elementos - Juegos o Figuras */}
              {slide.type === 'games' ? (
                <div style={{ 
                  flex: 1, 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  gap: '1rem',
                  height: '400px'
                }}>
                  {slide.gameItems.map((item, itemIndex) => (
                    <div key={itemIndex} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      gridColumn: item.span ? `span ${item.span}` : 'span 1',
                      animation: index === currentSlide ? `fadeInScale 0.8s ease-out ${itemIndex * 0.1}s both` : 'none',
                      padding: '1rem'
                    }}>
                      {/* Imagen del juego */}
                      <img 
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      {/* Fallback emoji */}
                      <div style={{ 
                        display: 'none',
                        fontSize: '2rem',
                        marginBottom: '0.5rem'
                      }}>
                        🎮
                      </div>
                      {/* Nombre del juego */}
                      <div style={{ 
                        textAlign: 'center', 
                        color: '#20b2aa', 
                        fontSize: item.size, 
                        fontWeight: 'bold' 
                      }}>
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  flex: 1, 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  gap: '1rem',
                  height: '400px'
                }}>
                  {slide.figureItems.map((item, itemIndex) => (
                    <div key={itemIndex} style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '15px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      gridColumn: item.span ? `span ${item.span}` : 'span 1',
                      animation: index === currentSlide ? `fadeInScale 0.8s ease-out ${itemIndex * 0.1}s both` : 'none',
                      padding: '1rem'
                    }}>
                      {/* Imagen o emoji */}
                      {item.image ? (
                        <img 
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                          {item.emoji}
                        </div>
                      )}
                      {/* Fallback emoji para imágenes que no cargan */}
                      <div style={{ 
                        display: item.image ? 'none' : 'block',
                        fontSize: '2rem', 
                        marginBottom: '0.5rem' 
                      }}>
                        🎭
                      </div>
                      {/* Nombre de la figura */}
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'white'
                      }}>
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Controles del carrusel */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(32, 178, 170, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10,
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(32, 178, 170, 1)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(32, 178, 170, 0.8)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ←
        </button>

        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(32, 178, 170, 0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10,
            backdropFilter: 'blur(10px)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(32, 178, 170, 1)';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(32, 178, 170, 0.8)';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          →
        </button>

        {/* Indicadores del carrusel */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '1rem',
          zIndex: 10
        }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentSlide 
                  ? 'rgba(32, 178, 170, 1)' 
                  : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>

      {/* Sección de acciones rápidas */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '4rem',
            flexWrap: 'wrap'
          }}>
            {/* Ofertas de compra */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#20b2aa',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1rem'
              }}>
                🏷️
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Ofertas de compra!
              </h3>
            </div>

            {/* Canjear Código */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#20b2aa',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1rem'
              }}>
                💻
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Canjear Código
              </h3>
            </div>

            {/* Lista deseados */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: 'white'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#20b2aa',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1rem'
              }}>
                💖
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Lista deseados
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Basado en página 5 del mockup */}
      <section className="section section-white">
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontSize: '3rem',
            color: '#20b2aa',
            marginBottom: '1rem'
          }}>
            Explora Juegos
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            color: '#2c5aa0',
            marginBottom: '3rem'
          }}>
            Explora Todos Los Juegos →
          </p>

          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{
              fontSize: '2rem',
              color: '#20b2aa',
              marginBottom: '2rem'
            }}>
              Nuevos Lanzamientos
              <span style={{ 
                float: 'right', 
                fontSize: '1.2rem', 
                color: '#2c5aa0',
                cursor: 'pointer'
              }}>
                Explora Todo →
              </span>
            </h3>
            
            <div className="grid grid-4" style={{ gap: '2rem' }}>
              {/* Juegos nuevos basados en el mockup */}
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'white',
                  marginBottom: '1rem',
                  borderRadius: '15px'
                }}>
                
                <img 
                    src={gameImages.gta}
                    alt="Grand Theft Auto VI"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                  }}>
                    
                  </div>
                </div>
                <h4 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Grand Theft Auto VI</h4>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={gameImages.hytale}
                    alt="Hytale"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                  }}>
                    
                  </div>
                </div>
                <h4 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Hytale</h4>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #f093fb, #f5576c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                    
                <img 
                    src={gameImages.hollowKnight}
                    alt="Hollow Knight Silksong"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                  }}>
                    ⚔️
                  </div>
                </div>
                <h4 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Hollow Knight Silksong</h4>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                
                  
                 <img 
                    src={gameImages.fnaf}
                    alt="FNAF Secrets Of The Mimic"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                  }}>
                    🤖
                  </div>
                </div>
                <h4 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>FNAF Secrets Of The Mimic</h4>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  borderRadius: '15px',
                  overflow: 'hidden'


                }}>
                 <img 
                    src={figureImages.hatsuneMiku}
                    alt="Mesmerizer FanGame"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                  }}>
                    
                  </div>
                </div>
                <h4 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Mesmerizer FanGame</h4>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #74b9ff, #0984e3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>


                <img 
                    src={gameImages.shovelKnight}
                    alt="Shovel Knight"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                  }}>
                    
                  </div>
                </div>
                <h4 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Shovel Knight</h4>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #e17055, #d63031)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                  
                 <img 
                    src={gameImages.ultrakill}
                    alt="ULTRAKILL"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                  }}>
                    
                  </div>
                </div>
                <h4 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>ULTRAKILL</h4>
              </div>

              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}>
                   <img 
                    src={gameImages.blasphemous}
                    alt="Blasphemous"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                  }}></div>
                </div>
                <h4 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Blasphemous</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title white">Productos Destacados en GameZone</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading"></div>
              <p style={{ color: '#fff', marginTop: '1rem' }}>Cargando productos...</p>
            </div>
          ) : (
            <div className="grid grid-3" style={{ marginTop: '3rem' }}>
              {featuredProducts.map(product => (
                <div key={product.id_producto} className="card">
                  <div style={{
                    height: '200px',
                    background: product.categoria === 'videojuegos' 
                      ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                      : 'linear-gradient(45deg, #f093fb, #f5576c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white',
                    marginBottom: '1rem',
                    borderRadius: '15px'
                  }}>
                    <img 
                      src={`/images/${product.imagen}`} 
                      alt={product.nombre}
                      style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                      onError={(e) => { 
                        e.target.style.display = 'none'; 
                        e.target.nextSibling.style.display = 'block'; 
                      }}
                    />
                    <span style={{ display: 'none' }}>
                      {product.categoria === 'videojuegos' ? '🎮' : '🎭'}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#2c3e50' }}>
                      {product.nombre}
                    </h3>
                    <p style={{ color: '#7f8c8d', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      {product.descripcion}
                    </p>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#20b2aa',
                      marginBottom: '1rem'
                    }}>
                      {new Intl.NumberFormat('es-CO').format(product.precio)}
                    </div>
                    <button 
                      className="btn"
                      style={{ 
                        width: '100%',
                        background: product.stock > 0 ? '#20b2aa' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '12px',
                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
                      }}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CSS para animaciones */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .grid {
          display: grid;
          gap: 2rem;
        }
        
        .grid-3 {
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        .grid-4 {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }
          
          h1 {
            font-size: 2.5rem !important;
          }
          
          .grid {
            grid-template-columns: 1fr !important;
          }
          
          /* Ocultar controles del carrusel en móvil */
          button[style*="position: absolute"] {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;