CREATE DATABASE gymdb;

SET GLOBAL event_scheduler = ON;
CREATE PROCEDURE procedure_check_suscription()
BEGIN
	DECLARE done INT DEFAULT FALSE;
  DECLARE idsuscription VARCHAR(36);
  DECLARE endtime DATE;
  DECLARE cur1 CURSOR FOR SELECT id, end FROM gymdb.suscription;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur1;

  read_loop: LOOP
    FETCH cur1 INTO idsuscription, endtime;
    IF done THEN
      LEAVE read_loop;
    END IF;
    IF (DATEDIFF(endtime, CURRENT_DATE()) < 0) THEN
      UPDATE suscription SET suscription.state = 'inactive' WHERE suscription.id = idsuscription;
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




/*

select DATE_ADD(CURRENT_DATE(),INTERVAL 30 DAY);

select DATE_SUB(CURRENT_DATE(),INTERVAL 10 day);

select DATEDIFF(CURRENT_DATE(), '1996-02-22')


/*
        try {
          await queryRunner.query(``);
        } catch (error) {
          await queryRunner.rollbackTransaction();
        } finally {
          await queryRunner.release();
        }/*
        try {
          await getManager().transaction(async manager => {
    
            await manager.save(this.suscriptionRepository.create({
              cost: pay.cost,
              people: user,
              days: pay.days,
              start: `CURRENT_DATE()`,
              end: `DATE_ADD(CURRENT_DATE(),INTERVAL ${pay.days} DAY)`
            }))
          });
        } catch (error) { return { error: 'TRANSACTION_ERROR', detail: error } }*/
*/