-- ===============================
-- BASE DE DATOS DEL NEGOCIO
-- React + Node + MySQL
-- ===============================

DROP DATABASE IF EXISTS negocio;
CREATE DATABASE negocio CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE negocio;

-- ===============================
-- SUCURSALES
-- ===============================
CREATE TABLE sucursales (
  id_sucursal INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(150),
  activo BOOLEAN DEFAULT 1
);

-- ===============================
-- CATEGORIAS
-- ===============================
CREATE TABLE categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  activo BOOLEAN DEFAULT 1
);

-- ===============================
-- GENEROS
-- ===============================
CREATE TABLE generos (
  id_genero INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- ===============================
-- TIPOS DE PRODUCTO
-- ===============================
CREATE TABLE tipos_producto (
  id_tipo INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

-- ===============================
-- PRODUCTOS
-- ===============================
CREATE TABLE productos (
  id_producto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio_venta DECIMAL(10,2) NOT NULL,
  precio_compra DECIMAL(10,2),
  id_categoria INT NOT NULL,
  id_genero INT NULL,
  id_tipo INT NULL,
  activo BOOLEAN DEFAULT 1,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
  FOREIGN KEY (id_genero) REFERENCES generos(id_genero),
  FOREIGN KEY (id_tipo) REFERENCES tipos_producto(id_tipo)
);

-- ===============================
-- INVENTARIO POR SUCURSAL
-- ===============================
CREATE TABLE inventario (
  id_inventario INT AUTO_INCREMENT PRIMARY KEY,
  id_producto INT NOT NULL,
  id_sucursal INT NOT NULL,
  stock INT DEFAULT 0,
  stock_minimo INT DEFAULT 0,
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
  FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
  UNIQUE (id_producto, id_sucursal)
);

-- ===============================
-- CLIENTES
-- ===============================
CREATE TABLE clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(20),
  direccion VARCHAR(150),
  saldo DECIMAL(10,2) DEFAULT 0,
  activo BOOLEAN DEFAULT 1
);

-- ===============================
-- METODOS DE PAGO
-- ===============================
CREATE TABLE metodos_pago (
  id_metodo INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

-- ===============================
-- VENTAS
-- ===============================
CREATE TABLE ventas (
  id_venta INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  id_cliente INT NULL,
  id_sucursal INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  total_final DECIMAL(10,2) NOT NULL,
  estado ENUM('pagada','credito') DEFAULT 'pagada',
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
  FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- ===============================
-- DETALLE DE VENTA
-- (ajustes de precio aquí)
-- ===============================
CREATE TABLE detalle_venta (
  id_detalle INT AUTO_INCREMENT PRIMARY KEY,
  id_venta INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio_original DECIMAL(10,2) NOT NULL,
  precio_vendido DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- ===============================
-- ABONOS
-- ===============================
CREATE TABLE abonos (
  id_abono INT AUTO_INCREMENT PRIMARY KEY,
  id_venta INT NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  monto DECIMAL(10,2) NOT NULL,
  id_metodo INT,
  FOREIGN KEY (id_venta) REFERENCES ventas(id_venta),
  FOREIGN KEY (id_metodo) REFERENCES metodos_pago(id_metodo)
);

-- ===============================
-- USUARIOS
-- ===============================
CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin','vendedor') DEFAULT 'vendedor',
  id_sucursal INT NOT NULL,
  activo BOOLEAN DEFAULT 1,
  FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- ===============================
-- DESCUENTOS (OPCIONAL)
-- ===============================
CREATE TABLE descuentos (
  id_descuento INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  tipo_descuento ENUM('porcentaje','monto'),
  valor DECIMAL(10,2),
  fecha_inicio DATE,
  fecha_fin DATE,
  activo BOOLEAN DEFAULT 1
);
