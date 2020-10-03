CREATE DATABASE gymdb;

SET GLOBAL event_scheduler = ON;

CREATE OR REPLACE EVENT check_suscription
ON SCHEDULE EVERY 1 DAY 
STARTS CONCAT(CURRENT_DATE(),' ','05:15:00')
DO 
UPDATE people set gender = 'Masculino'; 




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