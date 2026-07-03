-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 03-07-2026 a las 13:41:10
-- Versión del servidor: 11.8.8-MariaDB-log
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u622044135_pos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Categoria`
--

CREATE TABLE `Categoria` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Cliente`
--

CREATE TABLE `Cliente` (
  `Id` int(11) NOT NULL,
  `TipoDocumento` varchar(20) DEFAULT NULL,
  `NumeroDocumento` varchar(20) DEFAULT NULL,
  `Nombre` varchar(200) NOT NULL,
  `Direccion` varchar(300) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Correo` varchar(150) DEFAULT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `CompraCabecera`
--

CREATE TABLE `CompraCabecera` (
  `Id` int(11) NOT NULL,
  `Fecha` datetime NOT NULL,
  `NumeroDocumento` varchar(30) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `Observacion` varchar(300) DEFAULT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `CompraDetalle`
--

CREATE TABLE `CompraDetalle` (
  `Id` int(11) NOT NULL,
  `IdCompraCabecera` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `Cantidad` decimal(10,2) NOT NULL,
  `PrecioUnitario` decimal(10,2) NOT NULL,
  `Total` decimal(10,2) NOT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `FormaPago`
--

CREATE TABLE `FormaPago` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Kardex`
--

CREATE TABLE `Kardex` (
  `Id` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `Fecha` datetime NOT NULL,
  `IdTipoMovimiento` int(11) NOT NULL,
  `Cantidad` decimal(10,2) NOT NULL,
  `CostoUnitario` decimal(10,2) DEFAULT NULL,
  `StockAnterior` decimal(10,2) DEFAULT NULL,
  `StockActual` decimal(10,2) DEFAULT NULL,
  `Referencia` varchar(50) DEFAULT NULL,
  `Observacion` varchar(300) DEFAULT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Marca`
--

CREATE TABLE `Marca` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Producto`
--

CREATE TABLE `Producto` (
  `Id` int(11) NOT NULL,
  `Codigo` varchar(30) DEFAULT NULL,
  `CodigoBarras` varchar(50) DEFAULT NULL,
  `Nombre` varchar(200) NOT NULL,
  `Descripcion` varchar(300) DEFAULT NULL,
  `IdMarca` int(11) NOT NULL,
  `PrecioCompra` decimal(10,2) NOT NULL,
  `PrecioVenta` decimal(10,2) NOT NULL,
  `StockMinimo` decimal(10,2) DEFAULT 0.00,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ProductoCategoria`
--

CREATE TABLE `ProductoCategoria` (
  `Id` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `IdCategoria` int(11) NOT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `TipoDocumento`
--

CREATE TABLE `TipoDocumento` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `TipoMovimiento`
--

CREATE TABLE `TipoMovimiento` (
  `Id` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuario`
--

CREATE TABLE `Usuario` (
  `Id` int(11) NOT NULL,
  `Nombres` varchar(150) NOT NULL,
  `Apellidos` varchar(150) NOT NULL,
  `Correo` varchar(150) DEFAULT NULL,
  `Celular` varchar(20) DEFAULT NULL,
  `Usuario` varchar(50) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `VentaCabecera`
--

CREATE TABLE `VentaCabecera` (
  `Id` int(11) NOT NULL,
  `NumeroVenta` varchar(20) DEFAULT NULL,
  `Fecha` datetime NOT NULL,
  `IdCliente` int(11) NOT NULL,
  `IdUsuario` int(11) NOT NULL,
  `IdTipoDocumento` int(11) NOT NULL,
  `IdFormaPago` int(11) NOT NULL,
  `Subtotal` decimal(10,2) DEFAULT NULL,
  `IGV` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `VentaDetalle`
--

CREATE TABLE `VentaDetalle` (
  `Id` int(11) NOT NULL,
  `IdVentaCabecera` int(11) NOT NULL,
  `IdProducto` int(11) NOT NULL,
  `Cantidad` decimal(10,2) DEFAULT NULL,
  `PrecioUnitario` decimal(10,2) DEFAULT NULL,
  `Total` decimal(10,2) DEFAULT NULL,
  `FechaCreacion` datetime NOT NULL,
  `UsuarioCreacion` int(11) NOT NULL,
  `FechaModificacion` datetime DEFAULT NULL,
  `UsuarioModificacion` int(11) DEFAULT NULL,
  `Estado` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Categoria`
--
ALTER TABLE `Categoria`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Nombre` (`Nombre`);

--
-- Indices de la tabla `Cliente`
--
ALTER TABLE `Cliente`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `CompraCabecera`
--
ALTER TABLE `CompraCabecera`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `CompraDetalle`
--
ALTER TABLE `CompraDetalle`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `FormaPago`
--
ALTER TABLE `FormaPago`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `Kardex`
--
ALTER TABLE `Kardex`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `Marca`
--
ALTER TABLE `Marca`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Nombre` (`Nombre`);

--
-- Indices de la tabla `Producto`
--
ALTER TABLE `Producto`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_Producto_Marca` (`IdMarca`);

--
-- Indices de la tabla `ProductoCategoria`
--
ALTER TABLE `ProductoCategoria`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_PC_Producto` (`IdProducto`),
  ADD KEY `FK_PC_Categoria` (`IdCategoria`);

--
-- Indices de la tabla `TipoDocumento`
--
ALTER TABLE `TipoDocumento`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `TipoMovimiento`
--
ALTER TABLE `TipoMovimiento`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `Usuario`
--
ALTER TABLE `Usuario`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Usuario` (`Usuario`);

--
-- Indices de la tabla `VentaCabecera`
--
ALTER TABLE `VentaCabecera`
  ADD PRIMARY KEY (`Id`);

--
-- Indices de la tabla `VentaDetalle`
--
ALTER TABLE `VentaDetalle`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Categoria`
--
ALTER TABLE `Categoria`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Cliente`
--
ALTER TABLE `Cliente`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `CompraCabecera`
--
ALTER TABLE `CompraCabecera`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `CompraDetalle`
--
ALTER TABLE `CompraDetalle`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `FormaPago`
--
ALTER TABLE `FormaPago`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Kardex`
--
ALTER TABLE `Kardex`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Marca`
--
ALTER TABLE `Marca`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Producto`
--
ALTER TABLE `Producto`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ProductoCategoria`
--
ALTER TABLE `ProductoCategoria`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `TipoDocumento`
--
ALTER TABLE `TipoDocumento`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `TipoMovimiento`
--
ALTER TABLE `TipoMovimiento`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Usuario`
--
ALTER TABLE `Usuario`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `VentaCabecera`
--
ALTER TABLE `VentaCabecera`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `VentaDetalle`
--
ALTER TABLE `VentaDetalle`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Producto`
--
ALTER TABLE `Producto`
  ADD CONSTRAINT `FK_Producto_Marca` FOREIGN KEY (`IdMarca`) REFERENCES `Marca` (`Id`);

--
-- Filtros para la tabla `ProductoCategoria`
--
ALTER TABLE `ProductoCategoria`
  ADD CONSTRAINT `FK_PC_Categoria` FOREIGN KEY (`IdCategoria`) REFERENCES `Categoria` (`Id`),
  ADD CONSTRAINT `FK_PC_Producto` FOREIGN KEY (`IdProducto`) REFERENCES `Producto` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
