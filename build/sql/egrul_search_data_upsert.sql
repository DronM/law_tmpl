-- DROP FUNCTION egrul_search_data_upsert(in_inn varchar(12),in_ogrn varchar(15),in_name text,in_data json,in_user_id int);

CREATE OR REPLACE FUNCTION egrul_search_data_upsert(in_inn varchar(12),in_ogrn varchar(15),in_name text,in_data json,in_user_id int)
RETURNS void as $$
BEGIN
    UPDATE egrul_search_data
    SET
    	data = in_data,
    	update_dt = now(),
    	update_count = update_count + 1
    WHERE inn = in_inn OR ogrn = in_ogrn;
    
    IF FOUND THEN
        RETURN;
    END IF;
    
    BEGIN
        INSERT INTO egrul_search_data
        (inn,ogrn,name,data,user_id,create_dt,update_count)
        VALUES (in_inn,in_ogrn,in_name,in_data,in_user_id,now(),0);
    EXCEPTION WHEN OTHERS THEN
	    UPDATE egrul_search_data
	    SET
	    	data = in_data,
	    	update_dt = now(),
	    	update_count = update_count + 1
	    WHERE inn = in_inn OR ogrn = in_ogrn;
    END;
    RETURN;
END;
$$ language plpgsql;

ALTER FUNCTION egrul_search_data_upsert(in_inn varchar(12),in_ogrn varchar(15),in_name text,in_data json,in_user_id int) OWNER TO ;
