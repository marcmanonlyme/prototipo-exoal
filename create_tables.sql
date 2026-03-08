-- Script SQL para crear tablas del prototipo EXOAL
-- Ejecutar en Azure SQL Database

-- Tabla SEDE
CREATE TABLE SEDE (
    id_sede INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL UNIQUE,
    tipo NVARCHAR(20) NOT NULL CHECK (tipo IN ('plantel', 'unidad', 'centro')),
    direccion NVARCHAR(255),
    telefono NVARCHAR(20),
    correo_contacto NVARCHAR(100)
);

-- Tabla USUARIO
CREATE TABLE USUARIO (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    tipo_usuario NVARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('estudiante', 'docente', 'administrador', 'visitante')),
    estado NVARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'bloqueado')),
    fecha_registro DATETIME2 DEFAULT GETDATE(),
    id_sede INT,
    FOREIGN KEY (id_sede) REFERENCES SEDE(id_sede)
);

-- Tabla ACTIVIDAD
CREATE TABLE ACTIVIDAD (
    id_actividad INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(200) NOT NULL,
    descripcion NVARCHAR(MAX),
    tipo NVARCHAR(20) NOT NULL CHECK (tipo IN ('cultural', 'academica', 'extraacademica', 'administrativa', 'economica')),
    fecha_inicio DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    ubicacion NVARCHAR(200),
    capacidad INT CHECK (capacidad > 0),
    asistentes_registrados INT DEFAULT 0,
    estado NVARCHAR(20) DEFAULT 'programada' CHECK (estado IN ('programada', 'en_curso', 'cancelada', 'finalizada')),
    id_sede INT NOT NULL,
    id_responsable INT,
    fecha_creacion DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (id_sede) REFERENCES SEDE(id_sede),
    FOREIGN KEY (id_responsable) REFERENCES USUARIO(id_usuario)
);

-- Datos de prueba
INSERT INTO SEDE (nombre, tipo, direccion, telefono, correo_contacto) VALUES
('Plantel Centro', 'plantel', 'Av. Universidad 123, Ciudad', '555-0101', 'centro@univ.edu'),
('Unidad Norte', 'unidad', 'Calle Norte 456, Ciudad', '555-0202', 'norte@univ.edu'),
('Centro Investigación Sur', 'centro', 'Blvd. Sur 789, Ciudad', '555-0303', 'sur@univ.edu');

INSERT INTO USUARIO (nombre, email, password, tipo_usuario, id_sede) VALUES
('Admin Principal', 'admin@univ.edu', '$2a$10$hashedpassword', 'administrador', 1),
('Estudiante Juan', 'juan@univ.edu', '$2a$10$hashedpassword', 'estudiante', 1),
('Docente María', 'maria@univ.edu', '$2a$10$hashedpassword', 'docente', 2);

INSERT INTO ACTIVIDAD (titulo, descripcion, tipo, fecha_inicio, hora_inicio, hora_fin, ubicacion, capacidad, id_sede, id_responsable) VALUES
('Conferencia de IA', 'Introducción a Inteligencia Artificial', 'academica', '2026-03-15', '10:00', '12:00', 'Auditorio A', 100, 1, 3),
('Taller de Programación', 'Desarrollo web con Java', 'extraacademica', '2026-03-20', '14:00', '16:00', 'Laboratorio 5', 30, 2, 3),
('Reunión Administrativa', 'Planificación del semestre', 'administrativa', '2026-03-10', '09:00', '11:00', 'Sala de Juntas', 20, 1, 1);