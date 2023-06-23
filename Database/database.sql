CREATE SCHEMA IF NOT EXISTS `booking-app` ;

CREATE TABLE IF NOT EXISTS `booking-app`.`appointemts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `number` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `reg` VARCHAR(6) NULL,
  `date` VARCHAR(15) NULL,
  `time` VARCHAR(15) NULL,
  PRIMARY KEY (`id`));