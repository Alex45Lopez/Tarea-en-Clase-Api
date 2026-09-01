CREATE DATABASE IF NOT EXISTS bolsa_senati;
USE bolsa_senati;

CREATE TABLE aprendices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombres_apellidos VARCHAR(255) NOT NULL,
  correo_institucional VARCHAR(255) UNIQUE NOT NULL,
  correo_personal VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  telefono_movil VARCHAR(20),
  carrera VARCHAR(100),
  ciclo INT,
  distrito_residencia VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE palabras_clave (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aprendiz_id INT NOT NULL,
  palabra VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (aprendiz_id) REFERENCES aprendices(id) ON DELETE CASCADE,
  UNIQUE KEY unique_palabra (aprendiz_id, palabra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE distritos_adicionales (
  id INT PRIMARY KEY AUTO_INCREMENT,
  aprendiz_id INT NOT NULL,
  orden INT NOT NULL,
  distrito VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (aprendiz_id) REFERENCES aprendices(id) ON DELETE CASCADE,
  UNIQUE KEY unique_distrito (aprendiz_id, orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_aprendiz_correo ON aprendices(correo_institucional);
CREATE INDEX idx_palabras_aprendiz ON palabras_clave(aprendiz_id);
CREATE INDEX idx_distritos_aprendiz ON distritos_adicionales(aprendiz_id);

CREATE USER IF NOT EXISTS 'senati_app'@'localhost' IDENTIFIED BY 'senati_pass_2026';
GRANT ALL PRIVILEGES ON bolsa_senati.* TO 'senati_app'@'localhost';
FLUSH PRIVILEGES;
