CREATE DATABASE IF NOT EXISTS GameShop;

USE GameShop;

CREATE TABLE usuario(
  id_usuario INT(5) PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100),
  email VARCHAR(150),
  contraseña VARCHAR(255),
  direccion VARCHAR(150),
  telefono VARCHAR(15),
  rol ENUM('usuario','administrador') NOT NULL DEFAULT 'usuario'
);

CREATE TABLE producto(
  id_producto INT(5) PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50),
  descripcion VARCHAR(255),
  precio DECIMAL(10, 2),
  stock INT(10),
  marca VARCHAR(50),
  categoria VARCHAR(50),
  imagen VARCHAR(255),
  id_usuario INT(5),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE pedido (
  id_pedido INT(5) PRIMARY KEY AUTO_INCREMENT,
  fecha DATE,
  estado VARCHAR(50) DEFAULT 'pendiente',
  total DECIMAL(10, 2),
  id_usuario INT(5),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE detalle_pedido (
  id_detalle INT(5) PRIMARY KEY AUTO_INCREMENT,
  id_pedido INT(5),
  id_producto INT(5),
  cantidad INT(3),
  precio_unitario DECIMAL(10, 2),
  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE pago(
    monto DECIMAL(10, 2),
    metodo VARCHAR(20),
    fecha DATE,
    id_pedido INT(5),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);

-- Datos de usuarios actualizados para GameZone
INSERT INTO usuario (nombre, email, contraseña, direccion, telefono, rol) VALUES 
('Admin', 'admin@gamezone.com', 'admin123', 'Calle Gamer 123', '1234567890', 'administrador'),
('Usuario', 'usuario@email.com', 'user123', 'Calle Usuario 456', '0987654321', 'usuario');

-- Datos de productos actualizados basados en el mockup de GameZone
INSERT INTO producto (nombre, descripcion, precio, stock, marca, categoria, imagen, id_usuario) VALUES 
-- Videojuegos (basados en las páginas 5-7 del mockup)
('Mesmerizer FanGame', 'Juego fan-made inspirado en el hit viral Mesmerizer', 25000, 50, 'Indie', 'videojuegos', 'mesmerizer.png', 1),
('Shovel Knight', 'Aventura retro de plataformas con caballero pala', 31000, 40, 'Yacht Club Games', 'videojuegos', 'shovel_knight.png', 1),
('ULTRAKILL', 'FPS de acción rápida con combate sanguinario', 58800, 30, 'New Blood', 'videojuegos', 'ultrakill.png', 1),
('Blasphemous', 'Metroidvania oscuro con temática religiosa', 63900, 35, 'Team17', 'videojuegos', 'blasphemous.png', 1),
('Grand Theft Auto VI', 'La esperada secuela de la saga GTA', 299000, 20, 'Rockstar Games', 'videojuegos', 'gta6.png', 1),
('Hytale', 'Sandbox de aventuras y construcción', 45000, 25, 'Hypixel Studios', 'videojuegos', 'hytale.png', 1),
('Hollow Knight Silksong', 'Secuela del aclamado metroidvania', 85000, 15, 'Team Cherry', 'videojuegos', 'silksong.png', 1),
('FNAF Secrets Of The Mimic', 'Nueva entrega de Five Nights at Freddys', 42000, 30, 'Steel Wool Studios', 'videojuegos', 'fnaf_mimic.png', 1);

-- Figuras coleccionables (basadas en la página 8 del mockup)
INSERT INTO producto (nombre, descripcion, precio, stock, marca, categoria, imagen, id_usuario) VALUES 
('Figura Hatsune Miku', 'Figura coleccionable de la vocaloid más famosa', 75000, 10, 'Good Smile Company', 'figuras', 'hatsune_miku.png', 1),
('Figura Star Platinum', 'Stand de Jotaro Kujo de JoJos Bizarre Adventure', 65000, 8, 'Medicos Entertainment', 'figuras', 'star_platinum.png', 1),
('Figura Iron Man', 'Armadura Mark 85 de los Vengadores', 80000, 12, 'Hot Toys', 'figuras', 'iron_man.png', 1),
('Figura V1 (ULTRAKILL)', 'Robot sanguinario del videojuego ULTRAKILL', 55000, 15, 'Indie Collectibles', 'figuras', 'v1_ultrakill.png', 1),
('Figura Master Chief', 'Spartan-117 de la saga Halo', 80000, 18, 'McFarlane Toys', 'figuras', 'master_chief.png', 1),
('Figura Dr. House', 'Gregory House de la serie médica', 120000, 5, 'Sideshow Collectibles', 'figuras', 'dr_house.png', 1);