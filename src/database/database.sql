CREATE SCHEMA IF NOT EXISTS dbo;

DROP TABLE IF EXISTS dbo."Offert";
DROP TABLE IF EXISTS dbo."OffertStatus";
DROP TABLE IF EXISTS dbo."Configuracion";
DROP TABLE IF EXISTS dbo."Favorite";
DROP TABLE IF EXISTS dbo."History";
DROP TABLE IF EXISTS dbo."Service";
DROP TABLE IF EXISTS dbo."Category";
DROP TABLE IF EXISTS dbo."User";
DROP TABLE IF EXISTS dbo."IdentificationType";
DROP TABLE IF EXISTS dbo."Role";

CREATE TABLE IF NOT EXISTS dbo."Role"(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS dbo."IdentificationType"(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS dbo."User"(
    id UUID PRIMARY KEY,
    identification VARCHAR(50) UNIQUE NOT NULL,
    identification_type_id INT NOT NULL,
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    email_verified BOOLEAN NOT NULL,
    registration_date TIMESTAMP NOT NULL,
    avatar_url VARCHAR(200),
    phone VARCHAR(20) NOT NULL,
    birthdate DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    provider BOOLEAN NOT NULL,
    email_code INT,
    email_code_generate BIGINT,
    available_days TEXT[] DEFAULT array[]::varchar[],
    FOREIGN KEY (role_id) REFERENCES dbo."Role"(id),
    FOREIGN KEY (identification_type_id) REFERENCES dbo."IdentificationType"(id)
);

CREATE TABLE IF NOT EXISTS dbo."Category"(
	id SERIAL PRIMARY KEY NOT NULL,
    name varchar(25) NOT NULL,
    description varchar(255)
);

CREATE TABLE IF NOT EXISTS dbo."Service"(
	id SERIAL PRIMARY KEY NOT NULL,
    price DECIMAL NOT NULL,
    calification DECIMAL NOT NULL,
    calification_acu DECIMAL NOT NULL,
    calification_count INT NOT NULL,
    description varchar(255),
    category_id INT NOT NULL,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES dbo."User"(id),
    FOREIGN KEY (category_id) REFERENCES dbo."Category"(id)
);

CREATE TABLE IF NOT EXISTS dbo."History"(
	id SERIAL PRIMARY KEY NOT NULL,
    created_fate DATE NOT NULL,
    user_id UUID NOT NULL,
    service_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES dbo."User"(id),
    FOREIGN KEY (service_id) REFERENCES dbo."Service"(id)
);

CREATE TABLE IF NOT EXISTS dbo."Favorite"(
	id SERIAL PRIMARY KEY NOT NULL,
    user_id UUID NOT NULL,
    service_provider_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES dbo."User"(id),
    FOREIGN KEY (service_provider_id) REFERENCES dbo."User"(id)
);

CREATE TABLE IF NOT EXISTS dbo."Configuracion"(
	id SERIAL PRIMARY KEY NOT NULL,
    system_notification BOOL NOT NULL,
    promotion_notification BOOL NOT NULL,
    user_id UUID NOT NULL,
    FOREIGN KEY (user_id) REFERENCES dbo."User"(id)
);

CREATE TABLE IF NOT EXISTS dbo."OffertStatus"(
	id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(20) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS dbo."Offert"(
	id SERIAL PRIMARY KEY NOT NULL,
    created_date TIMESTAMP NOT NULL,
    agended_date TIMESTAMP NOT NULL,
    user_id UUID NOT NULL,
    service_id INT NOT NULL,
    status_id INT NOT NULL,
    price DECIMAL NOT NULL,
    user_location POINT,
    user_provider_location POINT,
    FOREIGN KEY (user_id) REFERENCES dbo."User"(id),
    FOREIGN KEY (service_id) REFERENCES dbo."Service"(id),
    FOREIGN KEY (status_id) REFERENCES dbo."OffertStatus"(id)
);

INSERT INTO dbo."Category"(name) VALUES ('Aseo'), ('Informatica'), ('Transporte');

INSERT INTO dbo."OffertStatus"(name) VALUES ('Creado'), ('En curso'), ('Completado'), ('Cancelado'), ('Rechazado'), ('Aceptada');

INSERT INTO dbo."Role"(name) VALUES ('usuario'), ('admin');

INSERT INTO dbo."IdentificationType"(name) VALUES ('CC'), ('Pasaporte');


INSERT INTO dbo."User"(id, identification, identification_type_id, fullname, email, email_verified, provider, registration_date, phone, birthdate, password, role_id) VALUES 
	('97f99c61-a665-4eb5-9dd1-799fd82ffd34'::UUID, '1001369364', 1, 'Diego Cardenas', 'diegodaco08@gmail.com', false, false, CURRENT_TIMESTAMP, '573173887502', '2002-10-15', '$2b$10$Nyabob8uXAXdK6IGZNrPZOboaBvlM689VUtpgY3riRzXRWGLAeulm', 1),
	('1dde026b-8b82-49b9-a9ed-1ed2d7208e83'::UUID, '113456789', 1, 'Test Account', 'test@test.com', false, false, CURRENT_TIMESTAMP, '123456789', '2000-01-01', '$2b$10$Nyabob8uXAXdK6IGZNrPZOboaBvlM689VUtpgY3riRzXRWGLAeulm', 1),
	('1dde026b-8b82-49b9-a9ed-1ed2d7208e86'::UUID, '123456789', 1, 'Test Account 2', 'test2@test.com', false, false, CURRENT_TIMESTAMP, '123456789', '2000-01-01', '$2b$10$Nyabob8uXAXdK6IGZNrPZOboaBvlM689VUtpgY3riRzXRWGLAeulm', 1);

INSERT INTO dbo."Configuracion"(system_notification, promotion_notification, user_id) VALUES
    (true::BOOL, true::BOOL, '97f99c61-a665-4eb5-9dd1-799fd82ffd34'::UUID),
    (true::BOOL, true::BOOL, '1dde026b-8b82-49b9-a9ed-1ed2d7208e83'::UUID),
    (true::BOOL, true::BOOL, '1dde026b-8b82-49b9-a9ed-1ed2d7208e86'::UUID);

INSERT INTO dbo."Service"(id, price, calification, calification_acu, calification_count, description, category_id, user_id) VALUES
    (1, 10500, 5, 15, 3, '', 1, '97f99c61-a665-4eb5-9dd1-799fd82ffd34'::UUID),
    (2, 80000, 5, 0, 0, '', 2, '1dde026b-8b82-49b9-a9ed-1ed2d7208e83'::UUID),
    (3, 7500, 5, 0, 0, '', 3, '1dde026b-8b82-49b9-a9ed-1ed2d7208e86'::UUID);


SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'TaskLinkDev' AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS "TaskLinkDev";
SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'TaskLink' AND pid <> pg_backend_pid();
CREATE DATABASE "TaskLinkDev" WITH TEMPLATE "TaskLink" OWNER tasklinkadmin;