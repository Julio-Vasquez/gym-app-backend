CREATE DATABASE gymdb;

SET GLOBAL event_scheduler = ON;

DELIMITER //

CREATE PROCEDURE procedure_check_suscription()
BEGIN
	DECLARE done INT DEFAULT FALSE;
  DECLARE idsuscription VARCHAR(36);
  DECLARE endtime DATE;
  DECLARE cur1 CURSOR FOR SELECT id, end FROM gymdb.suscription WHERE state = 'active' AND concept = "Mensual";
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur1;

  read_loop: LOOP
    FETCH cur1 INTO idsuscription, endtime;
    IF done THEN
      LEAVE read_loop;
    END IF;
    IF (DATEDIFF(endtime, CURRENT_DATE()) < 0) THEN
      UPDATE suscription SET suscription.state = 'inactive', suscription.days = 0 WHERE suscription.id = idsuscription;
    ELSE  
      UPDATE suscription SET suscription.days = IF(suscription.days = 0, 0,(suscription.days-1)) WHERE suscription.id = idsuscription; 
    END IF;
  END LOOP;

  CLOSE cur1;
END; //

DELIMITER ;

/*Falta modificarlo*/
DELIMITER //

CREATE PROCEDURE procedure_check_suscription_tiquetera()
BEGIN
	DECLARE done INT DEFAULT FALSE;
  DECLARE idsuscription VARCHAR(36);
  DECLARE endtime DATE;
  DECLARE daysSuscription INT;
  DECLARE cur1 CURSOR FOR SELECT id, end, days FROM gymdb.suscription WHERE state = 'active' AND concept ='Tiquetera';
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur1;

  read_loop: LOOP
    FETCH cur1 INTO idsuscription, endtime, daysSuscription;
    IF done THEN
      LEAVE read_loop;
    END IF;
    IF (DATEDIFF(endtime, CURRENT_DATE()) < 0 OR daysSuscription = 0) THEN
      UPDATE 
        suscription 
      SET 
        suscription.state = 'inactive',
        suscription.days = 0 ,
        suscription.end = CURRENT_TIMESTAMP()
      WHERE 
        suscription.id = idsuscription;
    END IF;
  END LOOP;

  CLOSE cur1;
END; //

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE CHEKEAR()
BEGIN 
  CALL procedure_check_suscription();
  CALL procedure_check_suscription_tiquetera();
END; $$

DELIMITER ;