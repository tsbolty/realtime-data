DROP DATABASE IF EXISTS vehicle_position_db;

CREATE DATABASE vehicle_position_db;

USE vehicle_position_db;

CREATE TABLE historical_position (
  id VARCHAR(100) PRIMARY KEY NOT NULL,
  trip_id VARCHAR(20) NOT NULL,
  route_id VARCHAR(30) NOT NULL,
  direction_id INT NOT NULL,
  latitude DECIMAL(19, 15) NOT NULL,
  longitude DECIMAL(19, 15) NOT NULL,
  bearing INT NOT NULL,
  current_status INT NOT NULL,
  stop_id VARCHAR(5) NOT NULL,
  vehicle_id VARCHAR(30) NOT NULL,
  vehicle_label VARCHAR(4) NOT NULL
);

SELECT * FROM historical_position;