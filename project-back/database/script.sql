CREATE DATABASE grupos_investigacion;

CREATE SCHEMA IF NOT EXISTS investigacion;
SET search_path TO investigacion, public;

-- =========================
--  Tablas
-- =========================
CREATE TABLE investigador (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    experiencia INT NOT NULL CHECK (experiencia >= 0)
);

CREATE TABLE linea_investigacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL
);

CREATE TABLE disponibilidad (
    id SERIAL PRIMARY KEY,
    franja_horaria VARCHAR(50) NOT NULL,
    modalidad VARCHAR(20) NOT NULL CHECK (modalidad IN ('Presencial','Virtual')),
    CONSTRAINT uq_disponibilidad UNIQUE (franja_horaria, modalidad)
);

CREATE TABLE investigador_linea_disponibilidad (
    investigador_id INT NOT NULL REFERENCES investigador(id) ON DELETE CASCADE,
    linea_id INT NOT NULL REFERENCES linea_investigacion(id) ON DELETE CASCADE,
    disponibilidad_id INT NOT NULL REFERENCES disponibilidad(id) ON DELETE CASCADE,
    PRIMARY KEY (investigador_id, linea_id, disponibilidad_id)
);

-- =========================
--  Índices
-- =========================
CREATE INDEX IF NOT EXISTS idx_ild_linea_disp
    ON investigador_linea_disponibilidad (linea_id, disponibilidad_id);

CREATE INDEX IF NOT EXISTS idx_ild_investigador
    ON investigador_linea_disponibilidad (investigador_id);

CREATE INDEX IF NOT EXISTS idx_linea_nombre ON linea_investigacion (nombre);
CREATE INDEX IF NOT EXISTS idx_linea_area   ON linea_investigacion (area);

-- =========================
--  FUNCIONES PL/pgSQL
-- =========================

-- ----- CRUD Investigador -----
CREATE OR REPLACE FUNCTION obtener_investigadores()
RETURNS SETOF investigador AS $$
BEGIN
    RETURN QUERY SELECT * FROM investigador ORDER BY id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_investigador_por_id(p_id INT)
RETURNS investigador AS $$
DECLARE
    res investigador;
BEGIN
    SELECT * INTO res FROM investigador WHERE id = p_id;
    RETURN res;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION crear_investigador(p_nombre VARCHAR, p_apellido VARCHAR, p_departamento VARCHAR, p_experiencia INT)
RETURNS investigador AS $$
DECLARE
    nuevo investigador;
BEGIN
    INSERT INTO investigador(nombre, apellido, departamento, experiencia)
    VALUES (TRIM(p_nombre), TRIM(p_apellido), TRIM(p_departamento), p_experiencia)
    RETURNING * INTO nuevo;
    RETURN nuevo;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION actualizar_investigador(p_id INT, p_nombre VARCHAR, p_apellido VARCHAR, p_departamento VARCHAR, p_experiencia INT)
RETURNS investigador AS $$
DECLARE
    act investigador;
BEGIN
    UPDATE investigador
    SET nombre = TRIM(p_nombre),
        apellido = TRIM(p_apellido),
        departamento = TRIM(p_departamento),
        experiencia = p_experiencia
    WHERE id = p_id
    RETURNING * INTO act;
    RETURN act;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION eliminar_investigador(p_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM investigador WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ----- CRUD Línea de Investigación -----
CREATE OR REPLACE FUNCTION obtener_lineas_investigacion()
RETURNS SETOF linea_investigacion AS $$
BEGIN
    RETURN QUERY SELECT * FROM linea_investigacion ORDER BY id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_linea_por_id(p_id INT)
RETURNS linea_investigacion AS $$
DECLARE
    res linea_investigacion;
BEGIN
    SELECT * INTO res FROM linea_investigacion WHERE id = p_id;
    RETURN res;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION crear_linea_investigacion(p_nombre VARCHAR, p_area VARCHAR)
RETURNS linea_investigacion AS $$
DECLARE
    existe INT;
    nueva linea_investigacion;
BEGIN
    SELECT COUNT(*) INTO existe
    FROM linea_investigacion
    WHERE UPPER(TRIM(nombre)) = UPPER(TRIM(p_nombre))
      AND UPPER(TRIM(area)) = UPPER(TRIM(p_area));
    IF existe > 0 THEN
        RAISE EXCEPTION 'Ya existe una línea con ese nombre y área';
    END IF;

    INSERT INTO linea_investigacion(nombre, area)
    VALUES (TRIM(p_nombre), TRIM(p_area))
    RETURNING * INTO nueva;
    RETURN nueva;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION actualizar_linea_investigacion(p_id INT, p_nombre VARCHAR, p_area VARCHAR)
RETURNS linea_investigacion AS $$
DECLARE
    existe INT;
    act linea_investigacion;
BEGIN
    SELECT COUNT(*) INTO existe
    FROM linea_investigacion
    WHERE UPPER(TRIM(nombre)) = UPPER(TRIM(p_nombre))
      AND UPPER(TRIM(area)) = UPPER(TRIM(p_area))
      AND id <> p_id;
    IF existe > 0 THEN
        RAISE EXCEPTION 'Otra línea con ese nombre y área ya existe';
    END IF;

    UPDATE linea_investigacion
    SET nombre = TRIM(p_nombre),
        area = TRIM(p_area)
    WHERE id = p_id
    RETURNING * INTO act;
    RETURN act;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION eliminar_linea_investigacion(p_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM linea_investigacion WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ----- CRUD Disponibilidad -----
CREATE OR REPLACE FUNCTION obtener_disponibilidades()
RETURNS SETOF disponibilidad AS $$
BEGIN
    RETURN QUERY SELECT * FROM disponibilidad ORDER BY id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_disponibilidad_por_id(p_id INT)
RETURNS disponibilidad AS $$
DECLARE
    res disponibilidad;
BEGIN
    SELECT * INTO res FROM disponibilidad WHERE id = p_id;
    RETURN res;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION crear_disponibilidad(p_franja VARCHAR, p_modalidad VARCHAR)
RETURNS disponibilidad AS $$
DECLARE
    existe INT;
    nueva disponibilidad;
BEGIN
    SELECT COUNT(*) INTO existe
    FROM disponibilidad
    WHERE UPPER(TRIM(franja_horaria)) = UPPER(TRIM(p_franja))
      AND UPPER(TRIM(modalidad)) = UPPER(TRIM(p_modalidad));
    IF existe > 0 THEN
        RAISE EXCEPTION 'Ya existe una disponibilidad con esa franja y modalidad';
    END IF;

    INSERT INTO disponibilidad(franja_horaria, modalidad)
    VALUES (TRIM(p_franja), TRIM(p_modalidad))
    RETURNING * INTO nueva;
    RETURN nueva;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION actualizar_disponibilidad(p_id INT, p_franja VARCHAR, p_modalidad VARCHAR)
RETURNS disponibilidad AS $$
DECLARE
    existe INT;
    act disponibilidad;
BEGIN
    SELECT COUNT(*) INTO existe
    FROM disponibilidad
    WHERE UPPER(TRIM(franja_horaria)) = UPPER(TRIM(p_franja))
      AND UPPER(TRIM(modalidad)) = UPPER(TRIM(p_modalidad))
      AND id <> p_id;
    IF existe > 0 THEN
        RAISE EXCEPTION 'Otra disponibilidad con esa franja y modalidad ya existe';
    END IF;

    UPDATE disponibilidad
    SET franja_horaria = TRIM(p_franja),
        modalidad = TRIM(p_modalidad)
    WHERE id = p_id
    RETURNING * INTO act;
    RETURN act;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION eliminar_disponibilidad(p_id INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM disponibilidad WHERE id = p_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ----- CRUD Relación -----
CREATE OR REPLACE FUNCTION asignar_investigador_linea_disponibilidad(p_investigador INT, p_linea INT, p_disponibilidad INT)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO investigador_linea_disponibilidad(investigador_id, linea_id, disponibilidad_id)
    VALUES (p_investigador, p_linea, p_disponibilidad)
    ON CONFLICT DO NOTHING;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION eliminar_asignacion(p_investigador INT, p_linea INT, p_disponibilidad INT)
RETURNS BOOLEAN AS $$
BEGIN
    DELETE FROM investigador_linea_disponibilidad
    WHERE investigador_id = p_investigador
      AND linea_id = p_linea
      AND disponibilidad_id = p_disponibilidad;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ----- Consulta para grupos -----
CREATE OR REPLACE FUNCTION obtener_grupos_formados()
RETURNS TABLE(
    linea_id INT,
    nombre_linea VARCHAR,
    area VARCHAR,
    disponibilidad_id INT,
    franja_horaria VARCHAR,
    modalidad VARCHAR,
    investigadores TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        li.id,
        li.nombre,
        li.area,
        d.id,
        d.franja_horaria,
        d.modalidad,
        STRING_AGG(CONCAT(inv.nombre, ' ', inv.apellido), ', ' ORDER BY inv.apellido) AS investigadores
    FROM investigador_linea_disponibilidad ild
    JOIN investigador inv ON inv.id = ild.investigador_id
    JOIN linea_investigacion li ON li.id = ild.linea_id
    JOIN disponibilidad d ON d.id = ild.disponibilidad_id
    GROUP BY li.id, li.nombre, li.area, d.id, d.franja_horaria, d.modalidad
    HAVING COUNT(DISTINCT inv.id) >= 3;
END;
$$ LANGUAGE plpgsql;

-- Insertar investigadores
INSERT INTO investigacion.investigador (nombre, apellido, departamento, experiencia) VALUES
('Juan', 'Pérez', 'Biología', 5),
('Ana', 'García', 'Química', 3),
('Luis', 'Martínez', 'Física', 7),
('María', 'Rodríguez', 'Matemáticas', 4);

-- Insertar líneas de investigación
INSERT INTO investigacion.linea_investigacion (nombre, area) VALUES
('Biología Molecular', 'Ciencias Naturales'),
('Química Orgánica', 'Ciencias Naturales'),
('Física Teórica', 'Ciencias Exactas'),
('Matemáticas Aplicadas', 'Ciencias Exactas');

-- Insertar disponibilidades
INSERT INTO investigacion.disponibilidad (franja_horaria, modalidad) VALUES
('Mañana', 'Presencial'),
('Tarde', 'Presencial'),
('Noche', 'Virtual'),
('Mañana', 'Virtual');

-- Asignar investigadores a líneas y disponibilidades
INSERT INTO investigacion.investigador_linea_disponibilidad (investigador_id, linea_id, disponibilidad_id) VALUES
(1, 1, 1),  -- Juan en Biología Molecular, Mañana Presencial
(2, 2, 2),  -- Ana en Química Orgánica, Tarde Presencial
(3, 3, 3),  -- Luis en Física Teórica, Noche Virtual
(4, 4, 4),  -- María en Matemáticas Aplicadas, Mañana Virtual
(1, 4, 2),  -- Juan también en Matemáticas Aplicadas, Tarde Presencial
(2, 1, 3);  -- Ana también en Biología Molecular, Noche Virtual
