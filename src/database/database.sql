CREATE SCHEMA IF NOT EXISTS dbo;

DROP TABLE IF EXISTS dbo.User;
DROP TABLE IF EXISTS dbo.Role;

CREATE TABLE IF NOT EXISTS dbo.Role(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS dbo.IdentificationType(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

INSERT INTO dbo.Role(name) VALUES ('usuario');
INSERT INTO dbo.Role(name) VALUES ('admin');

INSERT INTO dbo.IdentificationType(name) VALUES ('CC');
INSERT INTO dbo.IdentificationType(name) VALUES ('Pasaporte');

CREATE TABLE IF NOT EXISTS dbo.User(
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
    FOREIGN KEY (role_id) REFERENCES dbo.Role(id),
    FOREIGN KEY (identification_type_id) REFERENCES dbo.IdentificationType(id)
);

INSERT INTO dbo.User(id, identification, identification_type_id, fullname, email, email_verified, registration_date, phone, birthdate, password, role_id) VALUES ('97f99c61-a665-4eb5-9dd1-799fd82ffd34', '1001369364', 1, 'Diego Cardenas', 'diegodaco08@gmail.com', false, CURRENT_TIMESTAMP, '573173887502', '2002-10-15', '$2b$10$Nyabob8uXAXdK6IGZNrPZOboaBvlM689VUtpgY3riRzXRWGLAeulm', 1);
INSERT INTO dbo.User(id, identification, identification_type_id, fullname, email, email_verified, registration_date, phone, birthdate, password, role_id) VALUES ('1dde026b-8b82-49b9-a9ed-1ed2d7208e83', '9647637690636008', 1, 'Diego Cardenas', 'diegodaco09@gmail.com', false, CURRENT_TIMESTAMP, '573173887502', '2002-10-15', '$2b$10$Nyabob8uXAXdK6IGZNrPZOboaBvlM689VUtpgY3riRzXRWGLAeulm', 1);
INSERT INTO dbo.User(id, identification, identification_type_id, fullname, email, email_verified, registration_date, phone, birthdate, password, role_id) VALUES ('1dde026b-8b82-49b9-a9ed-1ed2d7208e86', '9647637690636009', 1, 'Diego Cardenas', 'god@gmail.com', false, CURRENT_TIMESTAMP, '573173887502', '2002-10-15', '$2b$10$Nyabob8uXAXdK6IGZNrPZOboaBvlM689VUtpgY3riRzXRWGLAeulm', 1);