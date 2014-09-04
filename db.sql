 CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
  `nombre` TEXT, 
  `user` TEXT, 
  `password` TEXT, 
  `ts` DATETIME);
 
 CREATE TABLE IF NOT EXISTS `insumos` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
  `nombre` TEXT,
  `marca` VARCHAR DEFAULT ('generica') ,
  `descripcion` TEXT,
  `unidad` TEXT,
  `costo_unidad` INTEGER UNSIGNED,
  `stock` INTEGER DEFAULT (0) ,
  `ts` DATETIME);
  
 CREATE TABLE IF NOT EXISTS `insumos_productos` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
  `insumo_id` INTEGER UNSIGNED,
  `producto_id` INTEGER UNSIGNED,
  `cantidad` INTEGER DEFAULT (1) ,
  `ts` DATETIME);
  
CREATE TABLE IF NOT EXISTS `productos` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
  `nombre` TEXT, 
  `descripcion` TEXT, 
  `precio` INTEGER UNSIGNED,
  `stock` INTEGER, 
  `ts` DATETIME);

CREATE TABLE IF NOT EXISTS `ventas` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
  `jornada_id` INTEGER UNSIGNED,
  `nombre` TEXT,
  `usuario_id` INTEGER UNSIGNED,
  `estado` TEXT,
  `activa` INTEGER UNSIGNED,
  `ts` DATETIME
  );
  
CREATE TABLE IF NOT EXISTS `lineas` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
  `venta_id` INTEGER UNSIGNED,
  `producto_id` INTEGER UNSIGNED,
  `cantidad` INTEGER UNSIGNED,
  `precio` INTEGER UNSIGNED,
  `estado` TEXT,
  `ts` DATETIME);
  
CREATE TABLE IF NOT EXISTS `jornadas` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
  `creador` INTEGER UNSIGNED,
  `estado` TEXT,
  `activa` INTEGER UNSIGNED,
  `ts` DATETIME
  );
  
INSERT INTO `usuarios` (`nombre`,`user`,`password`,`ts`) VALUES ('Administrador','admin','abrazo1313',datetime());

INSERT INTO `productos` (`nombre`,`descripcion`,`precio`,`stock`,`ts`) VALUES ('CLOVER CLUB','Gin, jugo de limón, granadina y clara de huevo',3000,20,datetime());
INSERT INTO `productos` (`nombre`,`descripcion`,`precio`,`stock`,`ts`) VALUES ('GIN FIZZ','Gin, sour mix y soda',3000,20,datetime());
INSERT INTO `productos` (`nombre`,`descripcion`,`precio`,`stock`,`ts`) VALUES ('JOHN COLLINS','Gin, limón y soda',3500,20,datetime());
INSERT INTO `productos` (`nombre`,`descripcion`,`precio`,`stock`,`ts`) VALUES ('DRY MARTINI','Gin, vermouth y aceitunas',3500,20,datetime());   
INSERT INTO `productos` (`nombre`,`descripcion`,`precio`,`stock`,`ts`) VALUES ('MONKEY GLAND','Gin, absenta, jugo de naranja y granadina',3500,20,datetime()); 
 