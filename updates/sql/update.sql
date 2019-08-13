-- ******************* update 29/05/2019 06:22:28 ******************

		ALTER TABLE users ADD COLUMN banned bool;


-- ******************* update 29/05/2019 07:26:08 ******************
-- View: users_view

-- DROP VIEW users_view;

CREATE OR REPLACE VIEW users_view AS
	SELECT
		u.id,
		u.name,
		u.locale_id,
		u.color_palette,
		u.role_id,
		
		tzl.name AS user_time_locale,
		employees_ref(emp) AS employees_ref,
		departments_ref(dep) AS departments_ref,
		(emp.id=dep.boss_employee_id) department_boss,
		
		CASE WHEN st.id IS NULL THEN pdfn_short_message_recipient_states_free()
		ELSE short_message_recipient_states_ref(st)
		END AS recipient_states_ref
	FROM users u
	LEFT JOIN time_zone_locales tzl ON tzl.id=u.time_zone_locale_id
	LEFT JOIN employees emp ON emp.user_id=u.id
	LEFT JOIN departments dep ON dep.id=emp.department_id
	LEFT JOIN short_message_recipient_current_states cur_st ON cur_st.recipient_id=emp.id
	LEFT JOIN short_message_recipient_states st ON st.id=cur_st.recipient_state_id
	;
	
ALTER VIEW users_view OWNER TO law_tmpl;


-- ******************* update 01/06/2019 08:08:50 ******************
-- View: users_view

 DROP VIEW users_view;

CREATE OR REPLACE VIEW users_view AS
	SELECT
		u.id,
		u.name,
		u.locale_id,
		u.color_palette,
		u.role_id,
		u.email,
		
		tzl.name AS user_time_locale,
		employees_ref(emp) AS employees_ref,
		departments_ref(dep) AS departments_ref,
		(emp.id=dep.boss_employee_id) department_boss,
		
		CASE WHEN st.id IS NULL THEN pdfn_short_message_recipient_states_free()
		ELSE short_message_recipient_states_ref(st)
		END AS recipient_states_ref
	FROM users u
	LEFT JOIN time_zone_locales tzl ON tzl.id=u.time_zone_locale_id
	LEFT JOIN employees emp ON emp.user_id=u.id
	LEFT JOIN departments dep ON dep.id=emp.department_id
	LEFT JOIN short_message_recipient_current_states cur_st ON cur_st.recipient_id=emp.id
	LEFT JOIN short_message_recipient_states st ON st.id=cur_st.recipient_state_id
	;
	
ALTER VIEW users_view OWNER TO law_tmpl;


-- ******************* update 01/06/2019 08:13:35 ******************
-- View: users_view

-- DROP VIEW users_view;

CREATE OR REPLACE VIEW users_view AS
	SELECT
		u.id,
		u.name,
		u.locale_id,
		u.color_palette,
		u.role_id,
		u.email,
		
		tzl.name AS user_time_locale,
		employees_ref(emp) AS employees_ref,
		departments_ref(dep) AS departments_ref,
		(emp.id=dep.boss_employee_id) department_boss,
		
		CASE WHEN st.id IS NULL THEN pdfn_short_message_recipient_states_free()
		ELSE short_message_recipient_states_ref(st)
		END AS recipient_states_ref
	FROM users u
	LEFT JOIN time_zone_locales tzl ON tzl.id=u.time_zone_locale_id
	LEFT JOIN employees emp ON emp.user_id=u.id
	LEFT JOIN departments dep ON dep.id=emp.department_id
	LEFT JOIN short_message_recipient_current_states cur_st ON cur_st.recipient_id=emp.id
	LEFT JOIN short_message_recipient_states st ON st.id=cur_st.recipient_state_id
	;
	
ALTER VIEW users_view OWNER TO law_tmpl;


-- ******************* update 08/08/2019 15:46:46 ******************
-- Function: sess_gc(interval)

-- DROP FUNCTION sess_gc(interval);

CREATE OR REPLACE FUNCTION sess_gc(in_lifetime interval)
  RETURNS void AS
$BODY$	
	UPDATE public.logins
	SET date_time_out = now()
	WHERE session_id IN (SELECT id FROM public.sessions WHERE set_time<(now()-in_lifetime));
	
	DELETE FROM public.sessions WHERE set_time < (now()-in_lifetime);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION sess_gc(interval)
  OWNER TO law_tmpl;



-- ******************* update 08/08/2019 15:57:46 ******************
-- Function: sess_enc_read(character varying, text)

-- DROP FUNCTION sess_enc_read(character varying, text);

CREATE OR REPLACE FUNCTION sess_enc_read(in_id character varying,in_key text)
  RETURNS text AS
$BODY$
	SELECT PGP_SYM_DECRYPT(data_enc,in_key) FROM sessions WHERE id = in_id LIMIT 1;
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION sess_enc_read(character varying, text)
  OWNER TO law_tmpl;



-- ******************* update 08/08/2019 15:58:03 ******************
-- Function: sess_enc_write(character varying, text, character varying)

-- DROP FUNCTION sess_enc_write(character varying, text,text, character varying);

CREATE OR REPLACE FUNCTION sess_enc_write(
    in_id character varying,
    in_data_enc text,
    in_key text,
    in_remote_ip character varying)
  RETURNS void AS
$BODY$
BEGIN
	UPDATE sessions
	SET
		set_time = now(),
		data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
	WHERE id = in_id;
	
	IF FOUND THEN
		RETURN;
	END IF;
	
	BEGIN
		INSERT INTO sessions (id, data_enc, set_time,session_key)
		VALUES(in_id, PGP_SYM_ENCRYPT(in_data_enc,in_key), now(),in_id);
		
		INSERT INTO logins(date_time_in,ip,session_id)
		VALUES(now(),in_remote_ip,in_id);
		
	EXCEPTION WHEN unique_violation THEN
		UPDATE sessions
		SET
			set_time = now(),
			data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
		WHERE id = in_id;
	END;
	
	RETURN;

END;	
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sess_enc_write(character varying, text, text, character varying)
  OWNER TO law_tmpl;



-- ******************* update 08/08/2019 16:14:57 ******************
-- Function: sess_enc_write(character varying, text, character varying)

-- DROP FUNCTION sess_enc_write(character varying, text,text, character varying);

CREATE OR REPLACE FUNCTION sess_enc_write(
    in_id character varying,
    in_data_enc text,
    in_key text,
    in_remote_ip character varying)
  RETURNS void AS
$BODY$
BEGIN
	UPDATE sessions
	SET
		set_time = now(),
		data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
	WHERE id = in_id;
	
	IF FOUND THEN
		RETURN;
	END IF;
	
	BEGIN
		INSERT INTO sessions (id, data_enc, set_time)
		VALUES(in_id, PGP_SYM_ENCRYPT(in_data_enc,in_key), now());
		
		INSERT INTO logins(date_time_in,ip,session_id)
		VALUES(now(),in_remote_ip,in_id);
		
	EXCEPTION WHEN unique_violation THEN
		UPDATE sessions
		SET
			set_time = now(),
			data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
		WHERE id = in_id;
	END;
	
	RETURN;

END;	
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sess_enc_write(character varying, text, text, character varying)
  OWNER TO law_tmpl;



-- ******************* update 08/08/2019 16:15:18 ******************
-- Function: sess_enc_write(character varying, text, character varying)

-- DROP FUNCTION sess_enc_write(character varying, text,text, character varying);

CREATE OR REPLACE FUNCTION sess_enc_write(
    in_id character varying,
    in_data_enc text,
    in_key text,
    in_remote_ip character varying)
  RETURNS void AS
$BODY$
BEGIN
	UPDATE sessions
	SET
		set_time = now(),
		data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
	WHERE id = in_id;
	
	IF FOUND THEN
		RETURN;
	END IF;
	
	BEGIN
		INSERT INTO sessions (id, data_enc, set_time)
		VALUES(in_id, PGP_SYM_ENCRYPT(in_data_enc,in_key), now());
		
		INSERT INTO logins(date_time_in,ip,session_id)
		VALUES(now(),in_remote_ip,in_id);
		
	EXCEPTION WHEN unique_violation THEN
		UPDATE sessions
		SET
			set_time = now(),
			data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
		WHERE id = in_id;
	END;
	
	RETURN;

END;	
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sess_enc_write(character varying, text, text, character varying)
  OWNER TO law_tmpl;



-- ******************* update 08/08/2019 17:04:55 ******************
-- View: users_view

-- DROP VIEW users_view;

CREATE OR REPLACE VIEW users_view AS
	SELECT
		u.id,
		u.name,
		u.locale_id,
		u.color_palette,
		u.role_id,
		u.email,
		u.banned, 
		
		tzl.name AS user_time_locale,
		employees_ref(emp) AS employees_ref,
		departments_ref(dep) AS departments_ref,
		(emp.id=dep.boss_employee_id) department_boss,
		
		CASE WHEN st.id IS NULL THEN pdfn_short_message_recipient_states_free()
		ELSE short_message_recipient_states_ref(st)
		END AS recipient_states_ref
	FROM users u
	LEFT JOIN time_zone_locales tzl ON tzl.id=u.time_zone_locale_id
	LEFT JOIN employees emp ON emp.user_id=u.id
	LEFT JOIN departments dep ON dep.id=emp.department_id
	LEFT JOIN short_message_recipient_current_states cur_st ON cur_st.recipient_id=emp.id
	LEFT JOIN short_message_recipient_states st ON st.id=cur_st.recipient_state_id
	;
	
ALTER VIEW users_view OWNER TO law_tmpl;


-- ******************* update 08/08/2019 17:15:16 ******************
-- Function: sess_enc_write(character varying, text, character varying)

-- DROP FUNCTION sess_enc_write(character varying, text,text, character varying);

CREATE OR REPLACE FUNCTION sess_enc_write(
    in_id character varying,
    in_data_enc text,
    in_key text,
    in_remote_ip character varying)
  RETURNS void AS
$BODY$
	INSERT INTO sessions (id, data_enc, set_time)
	VALUES(in_id, PGP_SYM_ENCRYPT(in_data_enc,in_key), now())
	ON CONFLICT (id) DO UPDATE SET
		set_time = now(),
		data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
	;

/*
BEGIN
	UPDATE sessions
	SET
		set_time = now(),
		data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
	WHERE id = in_id;
	
	IF FOUND THEN
		RETURN;
	END IF;
	
	BEGIN
		INSERT INTO sessions (id, data_enc, set_time)
		VALUES(in_id, PGP_SYM_ENCRYPT(in_data_enc,in_key), now());
		
		INSERT INTO logins(date_time_in,ip,session_id)
		VALUES(now(),in_remote_ip,in_id);
		
	EXCEPTION WHEN unique_violation THEN
		UPDATE sessions
		SET
			set_time = now(),
			data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
		WHERE id = in_id;
	END;
	
	RETURN;

END;
*/	
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION sess_enc_write(character varying, text, text, character varying)
  OWNER TO law_tmpl;



-- ******************* update 08/08/2019 17:15:27 ******************
-- Function: sess_enc_write(character varying, text, character varying)

-- DROP FUNCTION sess_enc_write(character varying, text,text, character varying);

CREATE OR REPLACE FUNCTION sess_enc_write(
    in_id character varying,
    in_data_enc text,
    in_key text,
    in_remote_ip character varying)
  RETURNS void AS
$BODY$
	INSERT INTO sessions (id, data_enc, set_time)
	VALUES(in_id, PGP_SYM_ENCRYPT(in_data_enc,in_key), now())
	ON CONFLICT (id) DO UPDATE SET
		set_time = now(),
		data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
	;
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION sess_enc_write(character varying, text, text, character varying)
  OWNER TO law_tmpl;



-- ******************* update 08/08/2019 17:21:26 ******************
-- Function: sess_enc_write(character varying, text, character varying)

-- DROP FUNCTION sess_enc_write(character varying, text,text, character varying);

CREATE OR REPLACE FUNCTION sess_enc_write(
    in_id character varying,
    in_data_enc text,
    in_key text,
    in_remote_ip character varying)
  RETURNS void AS
$BODY$
BEGIN
	UPDATE sessions
	SET
		set_time = now(),
		data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
	WHERE id = in_id;
	
	IF FOUND THEN
		RETURN;
	END IF;
	
	BEGIN
		INSERT INTO sessions (id, data_enc, set_time)
		VALUES(in_id, PGP_SYM_ENCRYPT(in_data_enc,in_key), now());
		
		INSERT INTO logins(date_time_in,ip,session_id)
		VALUES(now(),in_remote_ip,in_id);
		
	EXCEPTION WHEN unique_violation THEN
		UPDATE sessions
		SET
			set_time = now(),
			data_enc = PGP_SYM_ENCRYPT(in_data_enc,in_key)
		WHERE id = in_id;
	END;
	
	RETURN;

END;	$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION sess_enc_write(character varying, text, text, character varying)
  OWNER TO law_tmpl;



-- ******************* update 08/08/2019 18:08:05 ******************
-- Function: public.sess_write(character varying, text, character varying)

-- DROP FUNCTION public.sess_write(character varying, text, character varying);

CREATE OR REPLACE FUNCTION public.sess_write(
    in_id character varying,
    in_data text,
    in_remote_ip character varying)
  RETURNS void AS
$BODY$
BEGIN
	UPDATE sessions
	SET
		set_time = now(),
		data = in_data
	WHERE id = in_id;
	
	IF FOUND THEN
		RETURN;
	END IF;
	
	BEGIN
		INSERT INTO sessions (id, data, set_time)
		VALUES(in_id, in_data, now());
		
		INSERT INTO logins(date_time_in,ip,session_id)
		VALUES(now(),in_remote_ip,in_id);
		
	EXCEPTION WHEN unique_violation THEN
		UPDATE sessions
		SET
			set_time = now(),
			data = in_data
		WHERE id = in_id;
	END;
	
	RETURN;

END;	
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.sess_write(character varying, text, character varying)
  OWNER TO law_tmpl;



-- ******************* update 12/08/2019 12:05:47 ******************
-- View: users_list

 DROP VIEW users_list;

CREATE OR REPLACE VIEW users_list AS 
	SELECT
	 	u.id,
	 	u.name,
	 	u.role_id,
	 	u.email,
	 	u.create_dt
	 	u.banned
 	FROM users AS u
	ORDER BY u.name;

ALTER TABLE users_list OWNER TO law_tmpl;