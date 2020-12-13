DROP DATABASE IF EXISTS vehicle_position_db

CREATE DATABASE vehicle_position_db

USE vehicle_position_db

CREATE TABLE historical_position (
  id VARCHAR PRIMARY KEY NOT NULL,
  trip_id INT NOT NULL,
  schedule_relationship INT NOT NULL,
  route_id VARCHAR NOT NULL,
  direction_id INT NOT NULL
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  bearing INT NOT NULL
  current_status INT NOT NULL,
  time_stamp ,
  stop_id ,
  id VARCHAR NOT NULL,
  label VARCHAR
)