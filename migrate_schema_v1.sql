-- Migration script: v1 - Remove id_responsable and add id_institucional
-- This script transforms the schema by:
-- 1. Adding id_institucional column to USUARIO table
-- 2. Dropping the FK constraint from ACTIVIDAD.id_responsable
-- 3. Removing the id_responsable column from ACTIVIDAD table

-- Step 1: Add id_institucional column to USUARIO table (if not exists)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='usuario' AND COLUMN_NAME='id_institucional')
BEGIN
    ALTER TABLE USUARIO
    ADD id_institucional NVARCHAR(50) UNIQUE;
    PRINT 'Added id_institucional column to USUARIO table';
END
ELSE
BEGIN
    PRINT 'id_institucional column already exists in USUARIO table';
END

-- Step 2: Drop the FK constraint from ACTIVIDAD table for id_responsable
IF EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
    WHERE TABLE_NAME = 'actividad' AND CONSTRAINT_NAME LIKE '%responsable%'
)
BEGIN
    DECLARE @fk_name NVARCHAR(128);
    SELECT @fk_name = CONSTRAINT_NAME FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
    WHERE TABLE_NAME = 'actividad' AND CONSTRAINT_NAME LIKE '%responsable%';
    
    EXEC ('ALTER TABLE ACTIVIDAD DROP CONSTRAINT ' + @fk_name);
    PRINT 'Dropped FK constraint: ' + @fk_name;
END

-- Step 3: Remove id_responsable column from ACTIVIDAD table
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='actividad' AND COLUMN_NAME='id_responsable')
BEGIN
    ALTER TABLE ACTIVIDAD
    DROP COLUMN id_responsable;
    PRINT 'Removed id_responsable column from ACTIVIDAD table';
END
ELSE
BEGIN
    PRINT 'id_responsable column does not exist in ACTIVIDAD table';
END

-- Step 4: Seed demo data with id_institucional values (if no data exists)
IF NOT EXISTS (SELECT 1 FROM USUARIO WHERE id_institucional IS NOT NULL)
BEGIN
    UPDATE USUARIO SET id_institucional = 'EMP-' + CONVERT(NVARCHAR(10), id_usuario) 
    WHERE tipoUsuario IN ('administrador', 'docente');
    PRINT 'Seeded id_institucional for admin/docente users';
    
    UPDATE USUARIO SET id_institucional = 'MAT-' + CONVERT(NVARCHAR(10), id_usuario) 
    WHERE tipoUsuario IN ('estudiante', 'visitante');
    PRINT 'Seeded id_institucional for estudiante/visitante users';
END

PRINT 'Migration v1 completed successfully!';
