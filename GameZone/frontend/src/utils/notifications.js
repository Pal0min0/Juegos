// Sistema de notificaciones personalizado para diferentes tipos de errores

export const showNotification = (message, type = 'info') => {
  // Remover notificación anterior si existe
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Iconos y colores según el tipo
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    SERVER_ERROR: '🔴',
    DATABASE_ERROR: '🗃️',
    USER_NOT_FOUND: '👤',
    USER_EXISTS: '🟡',
    INVALID_CREDENTIALS: '🔐',
    STOCK_ERROR: '📦',
    PRODUCT_NOT_FOUND: '🔍'
  };

  const colors = {
    success: '#4CAF50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196F3',
    SERVER_ERROR: '#f44336',
    DATABASE_ERROR: '#ff5722',
    USER_NOT_FOUND: '#ff9800',
    USER_EXISTS: '#ffeb3b',
    INVALID_CREDENTIALS: '#f44336',
    STOCK_ERROR: '#ff5722',
    PRODUCT_NOT_FOUND: '#ff9800'
  };

  // Mensajes más amigables
  const friendlyMessages = {
    SERVER_ERROR: '🔴 Error del servidor, intenta más tarde',
    DATABASE_ERROR: '🗃️ Error en la base de datos',
    USER_NOT_FOUND: '👤 Usuario no encontrado',
    USER_EXISTS: '🟡 Este usuario ya existe',
    INVALID_CREDENTIALS: '🔐 Credenciales incorrectas',
    STOCK_ERROR: '📦 Stock insuficiente',
    PRODUCT_NOT_FOUND: '🔍 Producto no encontrado'
  };

  const displayMessage = friendlyMessages[type] || message;
  const icon = icons[type] || icons.info;
  const color = colors[type] || colors.info;

  // Estilos de la notificación
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    font-weight: 500;
    max-width: 350px;
    animation: slideIn 0.3s ease-out;
    cursor: pointer;
  `;

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 16px;">${icon}</span>
      <span>${displayMessage}</span>
      <span style="margin-left: auto; font-size: 18px; cursor: pointer;">&times;</span>
    </div>
  `;

  // Agregar animación CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Función para cerrar notificación
  const closeNotification = () => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  };

  // Event listeners
  notification.addEventListener('click', closeNotification);

  // Auto-cerrar después de 5 segundos
  setTimeout(closeNotification, 5000);

  // Agregar al DOM
  document.body.appendChild(notification);
};

// Funciones específicas para cada tipo
export const showSuccess = (message) => showNotification(message, 'success');
export const showError = (message, type = 'error') => showNotification(message, type);
export const showWarning = (message) => showNotification(message, 'warning');
export const showInfo = (message) => showNotification(message, 'info');

// Función para manejar errores de la API
export const handleApiError = (error) => {
  if (error.response && error.response.data) {
    const { message, type } = error.response.data;
    showError(message, type);
  } else if (error.message) {
    showError(error.message);
  } else {
    showError('Ha ocurrido un error inesperado');
  }
};