CREATE DATABASE gymdb;

SET GLOBAL event_scheduler = ON;

DELIMITER //

CREATE PROCEDURE procedure_check_suscription()
BEGIN
	DECLARE done INT DEFAULT FALSE;
  DECLARE idsuscription VARCHAR(36);
  DECLARE endtime DATE;
  DECLARE cur1 CURSOR FOR SELECT id, end FROM gymdb.suscription WHERE state = 'active';
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


CREATE OR REPLACE EVENT check_suscription
ON SCHEDULE EVERY 1 DAY 
STARTS CONCAT(CURRENT_DATE(),' ','05:15:00')
DO 
CALL gymdb.procedure_check_suscription(); 