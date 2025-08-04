import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';
import { showSuccess, showError } from '../utils/notifications';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    marca: '',
    categoria: 'videojuegos',
    imagen: ''
  });

  useEffect(() => {
    if (isAdmin()) {
      if (activeTab === 'products') loadProducts();
      if (activeTab === 'users') loadUsers();
      if (activeTab === 'orders') loadOrders();
    }
  }, [activeTab]);

  if (!isAdmin()) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', color: 'white' }}>
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden acceder a esta página</p>
        </div>
      </div>
    );
  }

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getProducts();
      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      showError('Error al cargar productos', error.type);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productData = {
        ...productForm,
        precio: parseFloat(productForm.precio),
        stock: parseInt(productForm.stock),
        id_usuario: user.id
      };

      let response;
      if (editingProduct) {
        response = await ApiService.updateProduct(editingProduct.id_producto, productData);
      } else {
        response = await ApiService.createProduct(productData);
      }

      if (response.success) {
        showSuccess(editingProduct ? 'Producto actualizado' : 'Producto creado');
        setShowProductForm(false);
        setEditingProduct(null);
        setProductForm({
          nombre: '', descripcion: '', precio: '', stock: '', marca: '', categoria: 'videojuegos', imagen: ''
        });
        loadProducts();
      }
    } catch (error) {
      showError('Error al guardar producto', error.type);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio.toString(),
      stock: product.stock.toString(),
      marca: product.marca,
      categoria: product.categoria,
      imagen: product.imagen
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    try {
      const response = await ApiService.deleteProduct(id);
      if (response.success) {
        showSuccess('Producto eliminado');
        loadProducts();
      }
    } catch (error) {
      showError('Error al eliminar producto', error.type);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getUsers();
      if (response.success) {
        setUsers(response.users);
        
        const stats = {};
        for (const userItem of response.users) {
          try {
            const userStatsResponse = await ApiService.getUserStats(userItem.id_usuario);
            if (userStatsResponse.success) {
              stats[userItem.id_usuario] = userStatsResponse.stats;
            }
          } catch (error) {
            console.error('Error al cargar stats del usuario:', error);
          }
        }
        setUserStats(stats);
      }
    } catch (error) {
      showError('Error al cargar usuarios', error.type);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, userName) => {
    const stats = userStats[id];
    
    let confirmMessage = `¿Estás seguro de que quieres eliminar al usuario "${userName}"?`;
    
    if (stats && (stats.products > 0 || stats.orders > 0)) {
      confirmMessage += `\n\n⚠️ ATENCIÓN: Esta acción eliminará PERMANENTEMENTE:\n`;
      if (stats.products > 0) confirmMessage += `- ${stats.products} producto(s) creado(s) por este usuario\n`;
      if (stats.orders > 0) confirmMessage += `- ${stats.orders} pedido(s) realizado(s) por este usuario\n`;
      confirmMessage += `\n¿Continuar con la eliminación en cascada?`;
    }
    
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const response = await ApiService.deleteUser(id);
      if (response.success) {
        showSuccess(response.message);
        loadUsers();
        
        if (response.deleted && response.deleted.products > 0) {
          loadProducts();
        }
        
        if (response.deleted && response.deleted.orders > 0) {
          loadOrders();
        }
      }
    } catch (error) {
      if (error.type === 'LAST_ADMIN_ERROR') {
        showError(error.message, 'LAST_ADMIN_ERROR');
      } else {
        showError('Error al eliminar usuario', error.type);
      }
    }
  };

  const handleChangeUserRole = async (id, newRole) => {
    try {
      const response = await ApiService.updateUserRole(id, newRole);
      if (response.success) {
        showSuccess(response.message);
        loadUsers();
      }
    } catch (error) {
      if (error.type === 'LAST_ADMIN_ERROR') {
        showError(error.message, 'LAST_ADMIN_ERROR');
      } else {
        showError('Error al actualizar rol', error.type);
      }
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllOrders();
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (error) {
      showError('Error al cargar pedidos', error.type);
    } finally {
      setLoading(false);
    }
  };

  // Separar productos por categoría
  const gameProducts = products.filter(p => p.categoria === 'videojuegos');
  const figureProducts = products.filter(p => p.categoria === 'figuras');

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title white">Bienvenido ADMIN</h1>

        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setActiveTab('products')}
              className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Productos
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Pedidos
            </button>
          </div>
        </div>

        {activeTab === 'products' && (
          <div>
            {/* Vista principal con categorías - similar al mockup página 9 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Juegos */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, #8B0000, #DC143C)',
                  borderRadius: '20px',
                  padding: '3rem',
                  color: 'white',
                  textAlign: 'center',
                  cursor: 'pointer',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={() => setActiveTab('games')}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Juegos</h2>
              </div>

              {/* Figuras */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, #8B0000, #DC143C)',
                  borderRadius: '20px',
                  padding: '3rem',
                  color: 'white',
                  textAlign: 'center',
                  cursor: 'pointer',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={() => setActiveTab('figures')}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Figuras</h2>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem' 
            }}>
              <h2 style={{ color: '#20b2aa', fontSize: '2rem', fontWeight: 'bold' }}>
                LISTA DE JUEGOS
              </h2>
              <button
                onClick={() => {
                  setShowProductForm(!showProductForm);
                  setEditingProduct(null);
                  setProductForm({
                    nombre: '', descripcion: '', precio: '', stock: '', marca: '', categoria: 'videojuegos', imagen: ''
                  });
                }}
                className="btn"
                style={{
                  background: '#20b2aa',
                  color: 'white',
                  borderRadius: '25px',
                  padding: '10px 20px',
                  border: 'none',
                  fontSize: '1rem'
                }}
              >
                AGREGAR
              </button>
            </div>

            {showProductForm && (
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>{editingProduct ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h3>
                <form onSubmit={handleProductSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={productForm.nombre}
                        onChange={(e) => setProductForm({...productForm, nombre: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Desarrollador/Marca</label>
                      <input
                        type="text"
                        value={productForm.marca}
                        onChange={(e) => setProductForm({...productForm, marca: e.target.value})}
                        placeholder="Ej: New Blood, Team Cherry"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Precio</label>
                      <input
                        type="number"
                        value={productForm.precio}
                        onChange={(e) => setProductForm({...productForm, precio: e.target.value})}
                        placeholder="25000"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Imagen (nombre del archivo)</label>
                      <input
                        type="text"
                        value={productForm.imagen}
                        onChange={(e) => setProductForm({...productForm, imagen: e.target.value})}
                        placeholder="ultrakill.png"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      value={productForm.descripcion}
                      onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})}
                      rows="3"
                      placeholder="FPS de acción rápida con combate sanguinario"
                      required
                    />
                  </div>
                  <input type="hidden" value="videojuegos" />
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear Juego')}
                  </button>
                </form>
              </div>
            )}

            <div style={{ background: 'white', borderRadius: '15px', padding: '2rem' }}>
              {gameProducts.map(product => (
                <div key={product.id_producto} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: '2px solid #ddd'
                }}>
                  <img 
                    src={`/images/${product.imagen}`} 
                    alt={product.nombre}
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '50%',
                      marginRight: '2rem',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#2c5aa0', margin: 0 }}>{product.nombre}</h4>
                  </div>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    color: '#2c5aa0',
                    marginRight: '2rem'
                  }}>
                    {new Intl.NumberFormat('es-CO').format(product.precio)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        background: '#2c5aa0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 16px'
                      }}
                    >
                      EDITAR
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id_producto)}
                      style={{
                        background: '#8B0000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 16px'
                      }}
                    >
                      ELIMINAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'figures' && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem' 
            }}>
              <h2 style={{ color: '#20b2aa', fontSize: '2rem', fontWeight: 'bold' }}>
                LISTA DE FIGURAS
              </h2>
              <button
                onClick={() => {
                  setShowProductForm(!showProductForm);
                  setEditingProduct(null);
                  setProductForm({
                    nombre: '', descripcion: '', precio: '', stock: '', marca: '', categoria: 'figuras', imagen: ''
                  });
                }}
                className="btn"
                style={{
                  background: '#20b2aa',
                  color: 'white',
                  borderRadius: '25px',
                  padding: '10px 20px',
                  border: 'none',
                  fontSize: '1rem'
                }}
              >
                AGREGAR
              </button>
            </div>

            {showProductForm && (
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>{editingProduct ? 'Editar Figura' : 'Agregar Nueva Figura'}</h3>
                <form onSubmit={handleProductSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={productForm.nombre}
                        onChange={(e) => setProductForm({...productForm, nombre: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Fabricante/Marca</label>
                      <input
                        type="text"
                        value={productForm.marca}
                        onChange={(e) => setProductForm({...productForm, marca: e.target.value})}
                        placeholder="Ej: Good Smile Company, Hot Toys"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Precio</label>
                      <input
                        type="number"
                        value={productForm.precio}
                        onChange={(e) => setProductForm({...productForm, precio: e.target.value})}
                        placeholder="75000"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Stock</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Imagen (nombre del archivo)</label>
                      <input
                        type="text"
                        value={productForm.imagen}
                        onChange={(e) => setProductForm({...productForm, imagen: e.target.value})}
                        placeholder="hatsune_miku.png"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      value={productForm.descripcion}
                      onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})}
                      rows="3"
                      placeholder="Figura coleccionable de la vocaloid más famosa"
                      required
                    />
                  </div>
                  <input type="hidden" value="figuras" />
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear Figura')}
                  </button>
                </form>
              </div>
            )}

            <div style={{ background: 'white', borderRadius: '15px', padding: '2rem' }}>
              {figureProducts.map(product => (
                <div key={product.id_producto} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 0',
                  borderBottom: '2px solid #ddd'
                }}>
                  <img 
                    src={`/images/${product.imagen}`} 
                    alt={product.nombre}
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      borderRadius: '8px',
                      marginRight: '2rem',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#2c5aa0', margin: 0 }}>{product.nombre}</h4>
                  </div>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    color: '#2c5aa0',
                    marginRight: '2rem'
                  }}>
                    {new Intl.NumberFormat('es-CO').format(product.precio)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        background: '#2c5aa0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 16px'
                      }}
                    >
                      EDITAR
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id_producto)}
                      style={{
                        background: '#8B0000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 16px'
                      }}
                    >
                      ELIMINAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <h3>Gestión de Usuarios</h3>
            <div style={{
              background: '#e8f4fd',
              border: '1px solid #bee5eb',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              <strong>ℹ️ Información:</strong> Al eliminar un usuario, se eliminarán automáticamente todos sus productos creados y pedidos realizados.
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center' }}>
                <div className="loading"></div>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Productos</th>
                    <th>Pedidos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(userItem => {
                    const stats = userStats[userItem.id_usuario] || { products: 0, orders: 0 };
                    return (
                      <tr key={userItem.id_usuario}>
                        <td>{userItem.nombre}</td>
                        <td>{userItem.email}</td>
                        <td>
                          <select
                            value={userItem.rol}
                            onChange={(e) => handleChangeUserRole(userItem.id_usuario, e.target.value)}
                            style={{
                              padding: '0.3rem',
                              border: '1px solid #ccc',
                              borderRadius: '4px'
                            }}
                          >
                            <option value="usuario">Usuario</option>
                            <option value="administrador">Administrador</option>
                          </select>
                        </td>
                        <td>
                          <span className={`badge ${stats.products > 0 ? 'badge-warning' : 'badge-success'}`}>
                            {stats.products}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${stats.orders > 0 ? 'badge-warning' : 'badge-success'}`}>
                            {stats.orders}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteUser(userItem.id_usuario, userItem.nombre)}
                            className="btn btn-danger"
                            style={{ padding: '0.3rem 0.8rem' }}
                            disabled={userItem.id_usuario === user.id}
                            title={userItem.id_usuario === user.id ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario y todas sus dependencias'}
                          >
                            {userItem.id_usuario === user.id ? 'Tú' : 'Eliminar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card">
            <h3>Pedidos</h3>
            {loading ? (
              <div style={{ textAlign: 'center' }}>
                <div className="loading"></div>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Productos</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id_pedido}>
                      <td>#{order.id_pedido}</td>
                      <td>{order.usuario_nombre}</td>
                      <td>{new Date(order.fecha).toLocaleDateString()}</td>
                      <td>${parseFloat(order.total || 0).toLocaleString('es-CO')}</td>
                      <td>
                        <span className={`badge ${order.estado === 'pendiente' ? 'badge-warning' : 'badge-success'}`}>
                          {order.estado}
                        </span>
                      </td>
                      <td style={{ maxWidth: '200px', fontSize: '0.8rem' }}>
                        {order.productos || 'Sin productos'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;