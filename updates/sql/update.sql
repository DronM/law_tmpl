-- SUPERUSER CODE
/*
CREATE USER law_tmpl WITH PASSWORD '159753';
CREATE DATABASE law_tmpl OWNER law_tmpl;
GRANT ALL PRIVILEGES ON DATABASE law_tmpl TO law_tmpl;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO law_tmpl;
*/

-- Table: logins

-- DROP TABLE logins;

CREATE TABLE public.logins
(
  id serial NOT NULL,
  date_time_in timestamp with time zone NOT NULL,
  date_time_out timestamp with time zone,
  ip character varying(15) NOT NULL,
  session_id character(128) NOT NULL,
  user_id integer,
  pub_key character(15),
  set_date_time timestamp without time zone DEFAULT now(),
  CONSTRAINT logins_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.logins
  OWNER TO law_tmpl;

-- Index: logins_session_id_idx

-- DROP INDEX logins_session_id_idx;

CREATE INDEX public.logins_session_id_idx
  ON public.logins
  USING btree
  (session_id COLLATE pg_catalog."default");

-- Index: users_pub_key_idx

-- DROP INDEX users_pub_key_idx;

CREATE INDEX public.users_pub_key_idx
  ON public.logins
  USING btree
  (pub_key COLLATE pg_catalog."default");

CREATE INDEX public.logins_users_index
  ON public.logins
  USING btree
  (user_id,date_time_in,date_time_out);

-- Function: logins_process()

-- DROP FUNCTION logins_process();

--Trigger function
CREATE OR REPLACE FUNCTION public.logins_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='AFTER' AND TG_OP='UPDATE') THEN
		IF NEW.date_time_out IS NOT NULL THEN
			--DELETE FROM doc___t_tmp__ WHERE login_id=NEW.id;
		END IF;
		
		RETURN NEW;
	ELSE 
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.logins_process()
  OWNER TO law_tmpl;


-- Trigger: logins_trigger on logins

-- DROP TRIGGER logins_trigger ON logins;

CREATE TRIGGER public.logins_trigger
  AFTER UPDATE OR DELETE
  ON public.logins
  FOR EACH ROW
  EXECUTE PROCEDURE public.logins_process();



-- Table: sessions

-- DROP TABLE sessions;

CREATE TABLE public.sessions
(
  id character(128) NOT NULL,
  data text NOT NULL,
  pub_key character varying(15),
  set_time timestamp without time zone NOT NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.sessions
  OWNER TO law_tmpl;

-- Index: sessions_pub_key_idx

-- DROP INDEX sessions_pub_key_idx;

CREATE INDEX public.sessions_pub_key_idx
  ON public.sessions
  USING btree
  (pub_key COLLATE pg_catalog."default");

-- Index: sessions_set_time_idx

-- DROP INDEX public.sessions_set_time_idx;

CREATE INDEX public.sessions_set_time_idx
  ON public.sessions
  USING btree
  (set_time);

-- Function: sess_gc(interval)

-- DROP FUNCTION sess_gc(interval);

CREATE OR REPLACE FUNCTION public.sess_gc(in_lifetime interval)
  RETURNS void AS
$BODY$	
	UPDATE public.logins
	SET date_time_out = now()
	WHERE session_id IN (SELECT id FROM public.sessions WHERE set_time<(now()-in_lifetime));
	
	DELETE FROM public.sessions WHERE set_time < (now()-in_lifetime);
$BODY$
  LANGUAGE sql VOLATILE
  COST 100;
ALTER FUNCTION public.sess_gc(interval)
  OWNER TO law_tmpl;

-- Function: sess_write(character varying, text, character varying)

-- DROP FUNCTION sess_write(character varying, text, character varying);

CREATE OR REPLACE FUNCTION public.sess_write(
    in_id character varying,
    in_data text,
    in_remote_ip character varying)
  RETURNS void AS
$BODY$
BEGIN
	UPDATE public.sessions
	SET
		set_time = now(),
		data = in_data
	WHERE id = in_id;
	
	IF FOUND THEN
		RETURN;
	END IF;
	
	BEGIN
		INSERT INTO public.sessions (id, data, set_time)
		VALUES(in_id, in_data, now());
		
		INSERT INTO public.logins(date_time_in,ip,session_id)
		VALUES(now(),in_remote_ip,in_id);
		
	EXCEPTION WHEN OTHERS THEN
		UPDATE public.sessions
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


-- ******************* update 06/11/2018 11:35:56 ******************
-- View: public.banks_list

-- DROP VIEW public.banks_list;

CREATE OR REPLACE VIEW public.banks_list AS 
 SELECT b.bik,
    b.codegr,
    b.name,
    b.korshet,
    b.adres,
    b.gor,
    b.tgroup,
    bgr.name AS gr_descr
   FROM banks b
     LEFT JOIN banks bgr ON b.codegr::text = bgr.bik::text
  WHERE b.tgroup = false
  ORDER BY b.bik;

ALTER TABLE public.banks_list
  OWNER TO law_tmpl;


-- ******************* update 06/11/2018 11:36:27 ******************
-- Table: public.banks

-- DROP TABLE public.banks;

CREATE TABLE public.banks
(
  bik character varying(9) NOT NULL,
  codegr character varying(9),
  name character varying(50),
  korshet character varying(20),
  adres character varying(70),
  gor character varying(31),
  tgroup boolean,
  CONSTRAINT banks_pkey PRIMARY KEY (bik)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.banks
  OWNER TO law_tmpl;

-- Index: public.banks_codegr_idx

-- DROP INDEX public.banks_codegr_idx;

CREATE INDEX banks_codegr_idx
  ON public.banks
  USING btree
  (codegr COLLATE pg_catalog."default");


-- View: public.banks_list

-- DROP VIEW public.banks_list;

CREATE OR REPLACE VIEW public.banks_list AS 
 SELECT b.bik,
    b.codegr,
    b.name,
    b.korshet,
    b.adres,
    b.gor,
    b.tgroup,
    bgr.name AS gr_descr
   FROM banks b
     LEFT JOIN banks bgr ON b.codegr::text = bgr.bik::text
  WHERE b.tgroup = false
  ORDER BY b.bik;

ALTER TABLE public.banks_list
  OWNER TO law_tmpl;


-- ******************* update 06/11/2018 12:12:56 ******************

		CREATE TABLE user_catalog_metadata
		(id serial,user_id  varchar(100),name text,fields json,CONSTRAINT user_catalog_metadata_pkey PRIMARY KEY (id)
		);
	DROP INDEX IF EXISTS user_catalog_metadata_user_id_idx;
	CREATE UNIQUE INDEX user_catalog_metadata_user_id_idx
	ON user_catalog_metadata(user_id);
		ALTER TABLE user_catalog_metadata OWNER TO law_tmpl;
	CREATE TABLE views (
		id int NOT NULL,
		c text,
		f text,
		t text,
		section text NOT NULL,
		descr text NOT NULL,
		limited bool,
	CONSTRAINT views_pkey PRIMARY KEY (id)
	);
	ALTER VIEW views OWNER TO law_tmpl;	
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10002',
		'UserCatalogMetadata_Controller',
		'get_list',
		'UserCatalogMetadataList',
		'Справочники',
		'Пользовательские справочники',
		FALSE
		);
	
-- ******************* update 06/11/2018 12:35:02 ******************
-- VIEW: user_catalog_metadata_list

--DROP VIEW user_catalog_metadata_list;

CREATE OR REPLACE VIEW user_catalog_metadata_list AS
	SELECT
		id,
		user_id,
		name
	FROM user_catalog_metadata
	ORDER BY user_id
	;
	
ALTER VIEW user_catalog_metadata_list OWNER TO law_tmpl;

-- ******************* update 06/11/2018 13:00:30 ******************

		CREATE TABLE user_catalog_data
		(id serial,user_catalog_metadata_id int REFERENCES user_catalog_metadata(id),values json,CONSTRAINT user_catalog_data_pkey PRIMARY KEY (id)
		);
	DROP INDEX IF EXISTS user_catalog_data_idx;
	CREATE UNIQUE INDEX user_catalog_data_idx
	ON user_catalog_data(user_catalog_metadata_id,(values->>'name'::text));
		ALTER TABLE user_catalog_data OWNER TO law_tmpl;
--Refrerece type
CREATE OR REPLACE FUNCTION user_catalog_metadata_ref(user_catalog_metadata)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.user_id,
		'dataType','user_catalog_metadata'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION user_catalog_metadata_ref(user_catalog_metadata) OWNER TO law_tmpl;	
	
-- ******************* update 06/11/2018 13:24:05 ******************
-- VIEW: user_catalog_metadata_list

--DROP VIEW user_catalog_metadata_list;

CREATE OR REPLACE VIEW user_catalog_metadata_list AS
	SELECT
		id,
		user_catalog_metadata_id,
		field_values
	FROM user_catalog_metadata
	ORDER BY user_catalog_metadata_id,field_values->>'name'
	;
	
ALTER VIEW user_catalog_metadata_list OWNER TO law_tmpl;

-- ******************* update 06/11/2018 13:24:09 ******************
-- VIEW: user_catalog_metadata_list

--DROP VIEW user_catalog_metadata_list;

CREATE OR REPLACE VIEW user_catalog_metadata_list AS
	SELECT
		id,
		user_catalog_metadata_id,
		field_values
	FROM user_catalog_metadata
	ORDER BY user_catalog_metadata_id,field_values->>'name'
	;
	
ALTER VIEW user_catalog_metadata_list OWNER TO law_tmpl;

-- ******************* update 06/11/2018 13:24:20 ******************
-- VIEW: user_catalog_metadata_list

--DROP VIEW user_catalog_metadata_list;

CREATE OR REPLACE VIEW user_catalog_metadata_list AS
	SELECT
		id,
		user_catalog_metadata_id,
		field_values
	FROM user_catalog_data
	ORDER BY user_catalog_metadata_id,field_values->>'name'
	;
	
ALTER VIEW user_catalog_data_list OWNER TO law_tmpl;

-- ******************* update 06/11/2018 13:24:28 ******************
-- VIEW: user_catalog_data_list

DROP VIEW user_catalog_data_list;

CREATE OR REPLACE VIEW user_catalog_metadata_list AS
	SELECT
		id,
		user_catalog_metadata_id,
		field_values
	FROM user_catalog_data
	ORDER BY user_catalog_metadata_id,field_values->>'name'
	;
	
ALTER VIEW user_catalog_data_list OWNER TO law_tmpl;

-- ******************* update 06/11/2018 13:24:42 ******************
-- VIEW: user_catalog_data_list

DROP VIEW user_catalog_data_list;

CREATE OR REPLACE VIEW user_catalog_data_list AS
	SELECT
		id,
		user_catalog_metadata_id,
		field_values
	FROM user_catalog_data
	ORDER BY user_catalog_metadata_id,field_values->>'name'
	;
	
ALTER VIEW user_catalog_data_list OWNER TO law_tmpl;

-- ******************* update 06/11/2018 13:25:23 ******************
-- VIEW: user_catalog_metadata_list

--DROP VIEW user_catalog_metadata_list;

CREATE OR REPLACE VIEW user_catalog_metadata_list AS
	SELECT
		id,
		user_id,
		name
	FROM user_catalog_metadata
	ORDER BY user_id
	;
	
ALTER VIEW user_catalog_metadata_list OWNER TO law_tmpl;

-- ******************* update 06/11/2018 13:30:52 ******************

		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10003',
		'UserCatalogData_Controller',
		'get_list',
		'UserCatalogDataList',
		'Справочники',
		'Пользовательские справочники (значения)',
		FALSE
		);
	
-- ******************* update 06/11/2018 13:45:57 ******************
-- VIEW: user_catalog_data_list

DROP VIEW user_catalog_data_list;

CREATE OR REPLACE VIEW user_catalog_data_list AS
	SELECT
		d.id,
		d.user_catalog_metadata_id,
		d.field_values,
		md.user_id AS metadata_user_id
	FROM user_catalog_data AS d
	LEFT JOIN user_catalog_metadata AS md ON md.id=d.user_catalog_metadata_id
	ORDER BY d.user_catalog_metadata_id,d.field_values->>'name'
	;
	
ALTER VIEW user_catalog_data_list OWNER TO law_tmpl;


-- ******************* update 06/11/2018 14:06:09 ******************
-- VIEW: user_catalog_metadata_list

--DROP VIEW user_catalog_metadata_list;

CREATE OR REPLACE VIEW user_catalog_metadata_list AS
	SELECT
		id,
		user_id,
		name,
		fields
	FROM user_catalog_metadata
	ORDER BY user_id
	;
	
ALTER VIEW user_catalog_metadata_list OWNER TO law_tmpl;

-- ******************* update 06/11/2018 14:42:28 ******************
-- VIEW: user_catalog_data_list

DROP VIEW user_catalog_data_list;

CREATE OR REPLACE VIEW user_catalog_data_list AS
	SELECT
		d.id,
		d.user_catalog_metadata_id,
		d.field_values
	FROM user_catalog_data AS d
	ORDER BY d.user_catalog_metadata_id,d.field_values->>'name'
	;
	
ALTER VIEW user_catalog_data_list OWNER TO law_tmpl;


-- ******************* update 06/11/2018 14:56:00 ******************
-- VIEW: user_catalog_data_list

DROP VIEW user_catalog_data_list;

CREATE OR REPLACE VIEW user_catalog_data_list AS
	SELECT
		d.id,
		d.user_catalog_metadata_id,
		d.field_values
	FROM user_catalog_data AS d
	ORDER BY d.user_catalog_metadata_id,d.field_values->>'name'
	;
	
ALTER VIEW user_catalog_data_list OWNER TO law_tmpl;


-- ******************* update 07/11/2018 11:11:09 ******************

		CREATE TABLE doc_templates
		(id serial,name  varchar(100),comment_text text,employee_id int REFERENCES employees(id),permissions jsonb,permission_ar [],fields jsonb,for_all_employees bool
			DEFAULT FALSE,CONSTRAINT doc_templates_pkey PRIMARY KEY (id)
		);
	DROP INDEX IF EXISTS doc_templates_employee_idx;
	CREATE INDEX doc_templates_employee_idx
	ON doc_templates(employee_id);
	DROP INDEX IF EXISTS doc_templates_permissions_idx;
	CREATE INDEX doc_templates_permissions_idx
	ON doc_templates USING GIN(permission_ar);
		ALTER TABLE doc_templates OWNER TO law_tmpl;
--Refrerece type
CREATE OR REPLACE FUNCTION employees_ref(employees)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','employees'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION employees_ref(employees) OWNER TO law_tmpl;	
	
-- ******************* update 07/11/2018 11:11:26 ******************

		CREATE TABLE doc_templates
		(id serial,name  varchar(100),comment_text text,employee_id int REFERENCES employees(id),permissions jsonb,permission_ar text[],fields jsonb,for_all_employees bool
			DEFAULT FALSE,CONSTRAINT doc_templates_pkey PRIMARY KEY (id)
		);
	DROP INDEX IF EXISTS doc_templates_employee_idx;
	CREATE INDEX doc_templates_employee_idx
	ON doc_templates(employee_id);
	DROP INDEX IF EXISTS doc_templates_permissions_idx;
	CREATE INDEX doc_templates_permissions_idx
	ON doc_templates USING GIN(permission_ar);
		ALTER TABLE doc_templates OWNER TO law_tmpl;
--Refrerece type
CREATE OR REPLACE FUNCTION employees_ref(employees)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','employees'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION employees_ref(employees) OWNER TO law_tmpl;	
	

-- ******************* update 07/11/2018 11:14:27 ******************
-- Function: public.doc_templates_process()

-- DROP FUNCTION public.doc_templates_process();

CREATE OR REPLACE FUNCTION public.doc_templates_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR TG_OP='UPDATE') ) THEN
		IF (TG_OP='INSERT')
		OR (TG_OP='UPDATE' AND NEW.permissions<>OLD.permissions) THEN
			--permissions
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;
			
		END IF;
		
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.doc_templates_process()
  OWNER TO expert72;


-- ******************* update 07/11/2018 11:14:39 ******************
-- Function: public.doc_templates_process()

-- DROP FUNCTION public.doc_templates_process();

CREATE OR REPLACE FUNCTION public.doc_templates_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR TG_OP='UPDATE') ) THEN
		IF (TG_OP='INSERT')
		OR (TG_OP='UPDATE' AND NEW.permissions<>OLD.permissions) THEN
			--permissions
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;
			
		END IF;
		
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.doc_templates_process()
  OWNER TO law_tmpl;


-- ******************* update 07/11/2018 11:15:21 ******************
-- Trigger: doc_templates_before_trigger on public.doc_templates

-- DROP TRIGGER doc_templates_before_trigger ON public.doc_templates;

CREATE TRIGGER doc_templates_before_trigger
  BEFORE INSERT OR UPDATE
  ON public.doc_templates
  FOR EACH ROW
  EXECUTE PROCEDURE public.doc_templates_process();


-- ******************* update 07/11/2018 11:18:21 ******************

		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10004',
		'DocTemplate_Controller',
		'get_list',
		'DocTemplateList',
		'Справочники',
		'Шаблоны документов',
		FALSE
		);
	
-- ******************* update 07/11/2018 12:16:49 ******************
-- VIEW: doc_templates_list

--DROP VIEW doc_templates_list;

CREATE OR REPLACE VIEW doc_templates_list AS
	SELECT
		id,
		name,
		employee_id,
		employees_ref,
		permission_ar,
		for_all_employees
	FROM doc_templates
	ORDER BY name
	;
	
ALTER VIEW doc_templates_list OWNER TO law_tmpl;

-- ******************* update 07/11/2018 12:17:43 ******************
-- VIEW: doc_templates_list

--DROP VIEW doc_templates_list;

CREATE OR REPLACE VIEW doc_templates_list AS
	SELECT
		id,
		name,
		employee_id,
		employees_ref(employees) AS employees_ref,
		permission_ar,
		for_all_employees
	FROM doc_templates
	LEFT JOIN employees ON employees.id=doc_templates.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_list OWNER TO law_tmpl;

-- ******************* update 07/11/2018 12:18:07 ******************
-- VIEW: doc_templates_list

--DROP VIEW doc_templates_list;

CREATE OR REPLACE VIEW doc_templates_list AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.permission_ar,
		t.for_all_employees
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_list OWNER TO law_tmpl;

-- ******************* update 07/11/2018 12:19:01 ******************
-- VIEW: doc_templates_dialog

--DROP VIEW doc_templates_dialog;

CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.permission_ar,
		t.for_all_employees,
		t.comment_text
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;

-- ******************* update 07/11/2018 12:43:13 ******************
		
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10005',
		'TimeZoneLocale_Controller',
		'get_list',
		'TimeZoneLocale',
		'Справочники',
		'Временные зоны',
		FALSE
		);
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10006',
		'MailForSending_Controller',
		'get_list',
		'MailForSendingList',
		'Справочники',
		'Электронная почта',
		FALSE
		);
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10007',
		'Holiday_Controller',
		'get_list',
		'HolidayList',
		'Справочники',
		'Государственные праздники',
		FALSE
		);
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10008',
		'Department_Controller',
		'get_list',
		'DepartmentList',
		'Справочники',
		'Отделы',
		FALSE
		);
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10009',
		'Employee_Controller',
		'get_list',
		'EmployeeList',
		'Справочники',
		'Сотрудники',
		FALSE
		);
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10010',
		'Post_Controller',
		'get_list',
		'PostList',
		'Справочники',
		'Должности',
		FALSE
		);
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10011',
		'Contact_Controller',
		'get_list',
		'ContactList',
		'Справочники',
		'Контакты',
		FALSE
		);
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'50001',
		'Reminder_Controller',
		'get_list',
		'ReminderList',
		'Формы',
		'Напоминания',
		FALSE
		);
		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'50002',
		'ProjectManager_Controller',
		NULL,
		'ProjectManager',
		'Формы',
		'Управление проектом',
		FALSE
		);
	

-- ******************* update 07/11/2018 12:44:38 ******************

			CREATE TYPE email_types AS ENUM (
				'new_account'			
			,
				'reset_pwd'			
			,
				'user_email_conf'			
			);
			ALTER TYPE email_types OWNER TO law_tmpl;
	/* function */
	CREATE OR REPLACE FUNCTION enum_email_types_val(email_types,locales)
	RETURNS text AS $$
		SELECT
		CASE
		WHEN $1='new_account'::email_types AND $2='ru'::locales THEN 'Новый акаунт'
		WHEN $1='reset_pwd'::email_types AND $2='ru'::locales THEN 'Установка пароля'
		WHEN $1='user_email_conf'::email_types AND $2='ru'::locales THEN 'Подтверждение пароля'
		ELSE ''
		END;		
	$$ LANGUAGE sql;	
	ALTER FUNCTION enum_email_types_val(email_types,locales) OWNER TO law_tmpl;		
		
-- ******************* update 07/11/2018 12:48:43 ******************

		CREATE TABLE holidays
		(date date,name  varchar(200),CONSTRAINT holidays_pkey PRIMARY KEY (date)
		);
		ALTER TABLE holidays OWNER TO law_tmpl;
		
-- ******************* update 07/11/2018 12:58:42 ******************
-- VIEW: departments_list

DROP VIEW public.departments_list;

CREATE OR REPLACE VIEW public.departments_list AS
	SELECT
		t.*,
		employees_ref(emp) AS boss_employees_ref
	FROM public.departments AS t
	LEFT JOIN public.employees AS emp ON emp.id=t.boss_employee_id
	ORDER BY
		t.name
	;
	
ALTER VIEW departments_list OWNER TO law_tmpl;

-- ******************* update 07/11/2018 12:58:56 ******************
-- VIEW: departments_list

--DROP VIEW public.departments_list;

CREATE OR REPLACE VIEW public.departments_list AS
	SELECT
		t.*,
		employees_ref(emp) AS boss_employees_ref
	FROM public.departments AS t
	LEFT JOIN public.employees AS emp ON emp.id=t.boss_employee_id
	ORDER BY
		t.name
	;
	
ALTER VIEW departments_list OWNER TO law_tmpl;

-- ******************* update 07/11/2018 13:00:21 ******************

		ALTER TABLE departments ADD COLUMN boss_employee_id int REFERENCES employees(id);


-- ******************* update 07/11/2018 13:00:30 ******************
-- VIEW: departments_list

--DROP VIEW public.departments_list;

CREATE OR REPLACE VIEW public.departments_list AS
	SELECT
		t.*,
		employees_ref(emp) AS boss_employees_ref
	FROM public.departments AS t
	LEFT JOIN public.employees AS emp ON emp.id=t.boss_employee_id
	ORDER BY
		t.name
	;
	
ALTER VIEW departments_list OWNER TO law_tmpl;

-- ******************* update 07/11/2018 13:01:27 ******************
-- VIEW: departments_dialog

--DROP VIEW public.departments_dialog;

CREATE OR REPLACE VIEW public.departments_dialog AS
	SELECT
		t.*,
		employees_ref(emp) AS boss_employees_ref
	FROM public.departments AS t
	LEFT JOIN public.employees AS emp ON emp.id=t.boss_employee_id
	;
	
ALTER VIEW departments_dialog OWNER TO law_tmpl;

-- ******************* update 07/11/2018 13:02:58 ******************
-- VIEW: employees_list

--DROP VIEW public.employees_list;

CREATE OR REPLACE VIEW public.employees_list AS
	SELECT
		t.*
		,public.departments_ref(departments_join) AS departments_ref
	FROM public.employees AS t
	LEFT JOIN public.departments AS departments_join ON
		t.department_id=departments_join.id
	ORDER BY
		t.name
	;
	
ALTER VIEW employees_list OWNER TO law_tmpl;

-- ******************* update 07/11/2018 13:03:58 ******************
-- VIEW: employees_dialog

--DROP VIEW public.employees_dialog;

CREATE OR REPLACE VIEW public.employees_dialog AS
	SELECT
		t.id
		,t.name
		,t.picture_info
		,public.users_ref(users_join) AS users_ref
		,public.posts_ref(posts_join) AS posts_ref
		,public.departments_ref(departments_join) AS departments_ref
		,t.snils
	FROM public.employees AS t
	LEFT JOIN public.users AS users_join ON
		t.user_id=users_join.id
	LEFT JOIN public.departments AS departments_join ON
		t.department_id=departments_join.id
	LEFT JOIN public.posts AS posts_join ON
		t.post_id=posts_join.id
		
	ORDER BY
		t.id
	;
	
ALTER VIEW employees_dialog OWNER TO law_tmpl;

-- ******************* update 07/11/2018 13:21:06 ******************
-- VIEW: mail_for_sending_list

--DROP VIEW mail_for_sending_list;

CREATE OR REPLACE VIEW mail_for_sending_list AS
	SELECT
		id,
		date_time,
		subject,
		from_addr,
		from_name,
		to_addr,
		to_name,
		sent,
		sent_date_time,
		email_type,
		coalesce((SELECT TRUE FROM mail_for_sending_attachments AS at WHERE at.mail_for_sending_id=mail_for_sending.id LIMIT 1),FALSE) AS attachments_exist
	FROM mail_for_sending
	ORDEr BY date_time DESC
	;
	
ALTER VIEW mail_for_sending_list OWNER TO law_tmpl;

-- ******************* update 07/11/2018 13:22:38 ******************
-- VIEW: mail_for_sending_list

--DROP VIEW mail_for_sending_list;

CREATE OR REPLACE VIEW mail_for_sending_list AS
	SELECT
		id,
		date_time,
		subject,
		from_addr,
		from_name,
		to_addr,
		to_name,
		sent,
		sent_date_time,
		email_type,
		coalesce((SELECT TRUE FROM mail_for_sending_attachments AS at WHERE at.mail_for_sending_id=mail_for_sending.id LIMIT 1),FALSE) AS attachments_exist
	FROM mail_for_sending
	ORDEr BY date_time DESC
	;
	
ALTER VIEW mail_for_sending_list OWNER TO law_tmpl;

-- ******************* update 07/11/2018 13:22:56 ******************

		CREATE TABLE mail_for_sending_attachments
		(id serial,mail_for_sending_id int REFERENCES mail_for_sending(id),file_name  varchar(255),CONSTRAINT mail_for_sending_attachments_pkey PRIMARY KEY (id)
		);
	DROP INDEX IF EXISTS mail_for_sending_attachments_id_idx;
	CREATE INDEX mail_for_sending_attachments_id_idx
	ON mail_for_sending_attachments(mail_for_sending_id);
		ALTER TABLE mail_for_sending_attachments OWNER TO law_tmpl;
--Refrerece type
CREATE OR REPLACE FUNCTION mail_for_sending_ref(mail_for_sending)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.from_addr,
		'dataType','mail_for_sending'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION mail_for_sending_ref(mail_for_sending) OWNER TO law_tmpl;	
	
-- ******************* update 07/11/2018 13:22:59 ******************
-- VIEW: mail_for_sending_list

--DROP VIEW mail_for_sending_list;

CREATE OR REPLACE VIEW mail_for_sending_list AS
	SELECT
		id,
		date_time,
		subject,
		from_addr,
		from_name,
		to_addr,
		to_name,
		sent,
		sent_date_time,
		email_type,
		coalesce((SELECT TRUE FROM mail_for_sending_attachments AS at WHERE at.mail_for_sending_id=mail_for_sending.id LIMIT 1),FALSE) AS attachments_exist
	FROM mail_for_sending
	ORDEr BY date_time DESC
	;
	
ALTER VIEW mail_for_sending_list OWNER TO law_tmpl;

-- ******************* update 19/11/2018 15:17:29 ******************
-- Function: public.doc_templates_process()

-- DROP FUNCTION public.doc_templates_process();

CREATE OR REPLACE FUNCTION public.doc_templates_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR TG_OP='UPDATE') ) THEN
		IF (TG_OP='INSERT')
		OR (TG_OP='UPDATE' AND NEW.permissions<>OLD.permissions) THEN
		RAISE EXCEPTION '%',NEW.permissions;
			--permissions
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;
			
		END IF;
		
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.doc_templates_process()
  OWNER TO law_tmpl;


-- ******************* update 19/11/2018 15:18:16 ******************
-- Function: public.doc_templates_process()

-- DROP FUNCTION public.doc_templates_process();

CREATE OR REPLACE FUNCTION public.doc_templates_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR TG_OP='UPDATE') ) THEN
		IF (TG_OP='INSERT')
		OR (TG_OP='UPDATE' AND NEW.permissions<>OLD.permissions) THEN
			--permissions
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;
			
		END IF;
		
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.doc_templates_process()
  OWNER TO law_tmpl;


-- ******************* update 19/11/2018 16:01:29 ******************
-- VIEW: doc_templates_dialog

--DROP VIEW doc_templates_dialog;

CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.permission_ar,
		t.for_all_employees,
		t.comment_text,
		t.fields
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;

-- ******************* update 21/11/2018 16:31:45 ******************

		CREATE TABLE documents
		(id serial,date_time timestampTZ NOT NULL,employee_id int NOT NULL REFERENCES employees(id),comment_text text,field_values json,CONSTRAINT documents_pkey PRIMARY KEY (id)
		);
	DROP INDEX IF EXISTS documents_employee_idx;
	CREATE INDEX documents_employee_idx
	ON documents(employee_id);
	DROP INDEX IF EXISTS documents_date_time_idx;
	CREATE INDEX documents_date_time_idx
	ON documents(date_time);
		ALTER TABLE documents OWNER TO law_tmpl;
--Refrerece type
CREATE OR REPLACE FUNCTION employees_ref(employees)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','employees'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION employees_ref(employees) OWNER TO law_tmpl;	
	
-- ******************* update 21/11/2018 16:34:58 ******************
-- VIEW: documents_list

--DROP VIEW documents_list;

CREATE OR REPLACE VIEW documents_list AS
	SELECT
		d.id,
		d.date_time,
		d.employee_id,
		employees_ref(empl) AS employees_ref
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	;
	
ALTER VIEW documents_list OWNER TO law_tmpl;

-- ******************* update 21/11/2018 16:35:38 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		comment_text,
		field_values
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 21/11/2018 17:01:23 ******************

		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'20001',
		'Document_Controller',
		'get_list',
		'DocumentList',
		'Журналы',
		'Документы',
		FALSE
		);
	
-- ******************* update 21/11/2018 17:06:36 ******************

		ALTER TABLE documents ADD COLUMN comment_text text,ADD COLUMN number  varchar(10),,;
	DROP INDEX IF EXISTS documents_employee_idx;
	CREATE INDEX documents_employee_idx
	ON documents(employee_id);
	DROP INDEX IF EXISTS documents_date_time_idx;
	CREATE INDEX documents_date_time_idx
	ON documents(date_time);
	DROP INDEX IF EXISTS documents_template_number_idx;
	CREATE UNIQUE INDEX documents_template_number_idx
	ON documents(doc_template_id,number);
--Refrerece type
CREATE OR REPLACE FUNCTION employees_ref(employees)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','employees'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION employees_ref(employees) OWNER TO law_tmpl;	
--Refrerece type
CREATE OR REPLACE FUNCTION doc_templates_ref(doc_templates)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','doc_templates'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION doc_templates_ref(doc_templates) OWNER TO law_tmpl;	
	
-- ******************* update 21/11/2018 17:06:42 ******************

		ALTER TABLE documents ADD COLUMN comment_text text,ADD COLUMN number  varchar(10);
	DROP INDEX IF EXISTS documents_employee_idx;
	CREATE INDEX documents_employee_idx
	ON documents(employee_id);
	DROP INDEX IF EXISTS documents_date_time_idx;
	CREATE INDEX documents_date_time_idx
	ON documents(date_time);
	DROP INDEX IF EXISTS documents_template_number_idx;
	CREATE UNIQUE INDEX documents_template_number_idx
	ON documents(doc_template_id,number);
--Refrerece type
CREATE OR REPLACE FUNCTION employees_ref(employees)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','employees'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION employees_ref(employees) OWNER TO law_tmpl;	
--Refrerece type
CREATE OR REPLACE FUNCTION doc_templates_ref(doc_templates)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','doc_templates'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION doc_templates_ref(doc_templates) OWNER TO law_tmpl;	
	

-- ******************* update 21/11/2018 17:10:44 ******************

		ALTER TABLE documents ADD COLUMN doc_template_id int NOT NULL REFERENCES doc_templates(id);
	DROP INDEX IF EXISTS documents_employee_idx;
	CREATE INDEX documents_employee_idx
	ON documents(employee_id);
	DROP INDEX IF EXISTS documents_date_time_idx;
	CREATE INDEX documents_date_time_idx
	ON documents(date_time);
	DROP INDEX IF EXISTS documents_template_number_idx;
	CREATE UNIQUE INDEX documents_template_number_idx
	ON documents(doc_template_id,number);
--Refrerece type
CREATE OR REPLACE FUNCTION employees_ref(employees)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','employees'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION employees_ref(employees) OWNER TO law_tmpl;	
--Refrerece type
CREATE OR REPLACE FUNCTION doc_templates_ref(doc_templates)
  RETURNS json AS
$$
	SELECT json_build_object(
		'keys',json_build_object(
			'id',$1.id    
			),	
		'descr',$1.name,
		'dataType','doc_templates'
	);
$$
  LANGUAGE sql VOLATILE COST 100;
ALTER FUNCTION doc_templates_ref(doc_templates) OWNER TO law_tmpl;	
	

-- ******************* update 21/11/2018 17:12:05 ******************
-- VIEW: documents_list

--DROP VIEW documents_list;

CREATE OR REPLACE VIEW documents_list AS
	SELECT
		d.id,
		d.date_time,
		d.employee_id,
		employees_ref(empl) AS employees_ref,
		doc_templates_ref(tmpl) AS doc_templates_ref
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_list OWNER TO law_tmpl;

-- ******************* update 21/11/2018 17:12:39 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		comment_text,
		field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 21/11/2018 17:12:48 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 22/11/2018 06:30:58 ******************

		ALTER TABLE doc_templates ADD COLUMN document_prefix  varchar(3);


-- ******************* update 22/11/2018 06:31:23 ******************
-- VIEW: doc_templates_dialog

--DROP VIEW doc_templates_dialog;

CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.permission_ar,
		t.for_all_employees,
		t.comment_text,
		t.fields,
		t.document_prefix
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;

-- ******************* update 22/11/2018 06:39:59 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
		NEW.date_time = now();
		
		SELECT
			t.document_prefix || 
			(coalesce(max(regexp_replace(d.number,'\D+.*$','')::int),0)+1)::text
		INTO NEW.number
		FROM documents AS d
		LEFT JOIN doc_templates AS t ON t.id=d.doc_template_id
		WHERE d.doc_template_id = NEW.doc_template_id
		ORDER BY d.number DESC
		LIMIT 1;
		
		RETURN NEW;
		
	IF (TG_WHEN='BEFORE' AND (TG_OP='INSERT' OR TG_OP='UPDATE') ) THEN		
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 22/11/2018 06:41:05 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
	
		IF NEW.date_time IS NULL THEN
			NEW.date_time = now();
		END IF;
		
		IF NEW.number IS NULL THEN
			SELECT
				t.document_prefix || 
				(coalesce(max(regexp_replace(d.number,'\D+.*$','')::int),0)+1)::text
			INTO NEW.number
			FROM documents AS d
			LEFT JOIN doc_templates AS t ON t.id=d.doc_template_id
			WHERE d.doc_template_id = NEW.doc_template_id
			ORDER BY d.number DESC
			LIMIT 1;
		END IF;
				
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN		
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 22/11/2018 06:41:54 ******************
-- Trigger: documents_trigger on documents

-- DROP TRIGGER documents_before_trigger ON documents;

CREATE TRIGGER documents_before_trigger
  BEFORE INSERT
  ON documents
  FOR EACH ROW
  EXECUTE PROCEDURE documents_process();


-- ******************* update 22/11/2018 06:43:39 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
	
		IF NEW.date_time IS NULL THEN
			NEW.date_time = now();
		END IF;
		
		IF NEW.doc_number IS NULL THEN
			SELECT
				t.document_prefix || 
				(coalesce(max(regexp_replace(d.doc_number,'\D+.*$','')::int),0)+1)::text
			INTO NEW.doc_number
			FROM documents AS d
			LEFT JOIN doc_templates AS t ON t.id=d.doc_template_id
			WHERE d.doc_template_id = NEW.doc_template_id
			ORDER BY d.doc_number DESC
			LIMIT 1;
		END IF;
				
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN		
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 22/11/2018 06:48:40 ******************

		ALTER TABLE documents ADD COLUMN doc_number varchar(15);
	DROP INDEX IF EXISTS documents_template_idx;
	CREATE INDEX documents_template_idx
	ON documents(doc_template_id);
	DROP INDEX IF EXISTS documents_doc_number_idx;
	CREATE UNIQUE INDEX documents_doc_number_idx
	ON documents(doc_number);


-- ******************* update 22/11/2018 06:49:54 ******************
-- VIEW: documents_list

--DROP VIEW documents_list;

CREATE OR REPLACE VIEW documents_list AS
	SELECT
		d.id,
		d.date_time,
		d.employee_id,
		employees_ref(empl) AS employees_ref,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_list OWNER TO law_tmpl;

-- ******************* update 22/11/2018 06:50:20 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 22/11/2018 06:52:37 ******************
-- VIEW: documents_list

--DROP VIEW documents_list;

CREATE OR REPLACE VIEW documents_list AS
	SELECT
		d.id,
		d.date_time,
		d.employee_id,
		employees_ref(empl) AS employees_ref,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	ORDER date_time DESC
	;
	
ALTER VIEW documents_list OWNER TO law_tmpl;

-- ******************* update 22/11/2018 06:52:48 ******************
-- VIEW: documents_list

--DROP VIEW documents_list;

CREATE OR REPLACE VIEW documents_list AS
	SELECT
		d.id,
		d.date_time,
		d.employee_id,
		employees_ref(empl) AS employees_ref,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	ORDER BY d.date_time DESC
	;
	
ALTER VIEW documents_list OWNER TO law_tmpl;

-- ******************* update 22/11/2018 07:43:53 ******************
-- View: users_view

-- DROP VIEW users_view;

CREATE OR REPLACE VIEW users_view AS
	SELECT
		u.*,
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

-- ******************* update 22/11/2018 07:47:01 ******************
-- View: users_view

-- DROP VIEW users_view;

CREATE OR REPLACE VIEW users_view AS
	SELECT
		u.*,
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

-- ******************* update 22/11/2018 07:51:44 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
	
		IF NEW.date_time IS NULL THEN
			NEW.date_time = now();
		END IF;
		
		IF NEW.doc_number IS NULL THEN
			SELECT
				(SELECT t.document_prefix FROM doc_templates AS t WHERE t.id=d.doc_template_id) || 
				(coalesce(max(regexp_replace(d.doc_number,'\D+.*$','')::int),0)+1)::text
			INTO NEW.doc_number
			FROM documents AS d
			WHERE d.doc_template_id = NEW.doc_template_id
			ORDER BY d.doc_number DESC
			LIMIT 1;
		END IF;
				
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN		
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 22/11/2018 07:52:12 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
	
		IF NEW.date_time IS NULL THEN
			NEW.date_time = now();
		END IF;
		
		IF NEW.doc_number IS NULL THEN
			SELECT
				(SELECT t.document_prefix FROM doc_templates AS t WHERE t.id=NEW.doc_template_id) || 
				(coalesce(max(regexp_replace(d.doc_number,'\D+.*$','')::int),0)+1)::text
			INTO NEW.doc_number
			FROM documents AS d
			WHERE d.doc_template_id = NEW.doc_template_id
			ORDER BY d.doc_number DESC
			LIMIT 1;
		END IF;
				
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN		
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 22/11/2018 07:52:49 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
	
		IF NEW.date_time IS NULL THEN
			NEW.date_time = now();
		END IF;
		
		IF NEW.doc_number IS NULL THEN
			SELECT
				(SELECT t.document_prefix FROM doc_templates AS t WHERE t.id=NEW.doc_template_id) || 
				(coalesce(max(regexp_replace(d.doc_number,'\D+.*$','')::int),0)+1)::text
			INTO NEW.doc_number
			FROM documents AS d
			WHERE d.doc_template_id = NEW.doc_template_id;
		END IF;
				
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN		
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 22/11/2018 07:55:35 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
	
		IF NEW.date_time IS NULL THEN
			NEW.date_time = now();
		END IF;
		
		IF NEW.doc_number IS NULL THEN
			SELECT
				coalesce((SELECT t.document_prefix FROM doc_templates AS t WHERE t.id=NEW.doc_template_id),'') ||
				(coalesce(max(regexp_replace(d.doc_number,'\D+.*$','')::int),0)+1)::text
			INTO NEW.doc_number
			FROM documents AS d
			WHERE d.doc_template_id = NEW.doc_template_id;
		END IF;
				
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN		
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 22/11/2018 09:11:20 ******************
-- VIEW: doc_templates_dialog

--DROP VIEW doc_templates_dialog;

CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.permission_ar,
		t.for_all_employees,
		t.comment_text,
		t.fields,
		t.document_prefix
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;

-- ******************* update 22/11/2018 09:19:08 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 12/12/2018 09:37:14 ******************

		CREATE TABLE egrul_search_data
		(inn  varchar(12) NOT NULL,ogrn  varchar(15) NOT NULL,name text NOT NULL,user_id int NOT NULL REFERENCES users(id),create_dt timestampTZ,data json,CONSTRAINT egrul_search_data_pkey PRIMARY KEY (inn)
		);
		ALTER TABLE egrul_search_data OWNER TO law_tmpl;


-- ******************* update 12/12/2018 09:41:54 ******************

		ALTER TABLE egrul_search_data ADD COLUMN descr text;


-- ******************* update 14/12/2018 16:23:35 ******************

		ALTER TABLE mail_for_sending ADD COLUMN error_str text;


-- ******************* update 14/12/2018 16:24:12 ******************
-- VIEW: mail_for_sending_list

--DROP VIEW mail_for_sending_list;

CREATE OR REPLACE VIEW mail_for_sending_list AS
	SELECT
		id,
		date_time,
		subject,
		from_addr,
		from_name,
		to_addr,
		to_name,
		sent,
		sent_date_time,
		email_type,
		coalesce((SELECT TRUE FROM mail_for_sending_attachments AS at WHERE at.mail_for_sending_id=mail_for_sending.id LIMIT 1),FALSE) AS attachments_exist,
		error_str
	FROM mail_for_sending
	ORDEr BY date_time DESC
	;
	
ALTER VIEW mail_for_sending_list OWNER TO law_tmpl;

-- ******************* update 21/12/2018 08:02:20 ******************
-- VIEW: user_catalog_metadata_dialog

--DROP VIEW user_catalog_metadata_dialog;

CREATE OR REPLACE VIEW user_catalog_metadata_dialog AS
	SELECT
		md.id,
		md.user_id,
		md.name,
		md.fields
		dt.field_values AS field_values
	FROM user_catalog_metadata AS md
	LEFT JOIN user_catalog_data AS dt ON md.id=dt.user_catalog_metadata_id
	;
	
ALTER VIEW user_catalog_metadata_dialog OWNER TO law_tmpl;

-- ******************* update 21/12/2018 08:02:27 ******************
-- VIEW: user_catalog_metadata_dialog

--DROP VIEW user_catalog_metadata_dialog;

CREATE OR REPLACE VIEW user_catalog_metadata_dialog AS
	SELECT
		md.id,
		md.user_id,
		md.name,
		md.fields,
		dt.field_values AS field_values
	FROM user_catalog_metadata AS md
	LEFT JOIN user_catalog_data AS dt ON md.id=dt.user_catalog_metadata_id
	;
	
ALTER VIEW user_catalog_metadata_dialog OWNER TO law_tmpl;

-- ******************* update 29/01/2019 14:09:26 ******************
-- VIEW: user_catalog_metadata_dialog

--DROP VIEW user_catalog_metadata_dialog;

CREATE OR REPLACE VIEW user_catalog_metadata_dialog AS
	SELECT
		md.id,
		md.user_id,
		md.name,
		md.fields
		--dt.field_values AS field_values
	FROM user_catalog_metadata AS md
	LEFT JOIN user_catalog_data AS dt ON md.id=dt.user_catalog_metadata_id
	;
	
ALTER VIEW user_catalog_metadata_dialog OWNER TO law_tmpl;

-- ******************* update 29/01/2019 14:09:32 ******************
-- VIEW: user_catalog_metadata_dialog

DROP VIEW user_catalog_metadata_dialog;

CREATE OR REPLACE VIEW user_catalog_metadata_dialog AS
	SELECT
		md.id,
		md.user_id,
		md.name,
		md.fields
		--dt.field_values AS field_values
	FROM user_catalog_metadata AS md
	LEFT JOIN user_catalog_data AS dt ON md.id=dt.user_catalog_metadata_id
	;
	
ALTER VIEW user_catalog_metadata_dialog OWNER TO law_tmpl;

-- ******************* update 29/01/2019 18:15:50 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 30/01/2019 11:40:28 ******************

		ALTER TABLE doc_templates ADD COLUMN template_file jsonb;


-- ******************* update 30/01/2019 11:46:07 ******************
-- VIEW: doc_templates_dialog

--DROP VIEW doc_templates_dialog;

CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.permission_ar,
		t.for_all_employees,
		t.comment_text,
		t.fields,
		t.document_prefix,
		t.template_file
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;

-- ******************* update 30/01/2019 12:11:17 ******************

		ALTER TABLE doc_templates ADD COLUMN template_data bytea;


-- ******************* update 12/02/2019 10:12:32 ******************

		ALTER TABLE documents ADD COLUMN document_data bytea;


-- ******************* update 12/02/2019 10:26:15 ******************

		ALTER TABLE documents ADD COLUMN permissions jsonb,ADD COLUMN permission_ar text[],ADD COLUMN for_all_employees bool
			DEFAULT FALSE;


-- ******************* update 12/02/2019 10:30:14 ******************
-- VIEW: doc_templates_dialog

--DROP VIEW doc_templates_dialog;

CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.permission_ar,
		t.for_all_employees,
		t.comment_text,
		t.fields,
		t.document_prefix,
		t.template_file,
		t.permissions
		
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;

-- ******************* update 12/02/2019 10:31:07 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		t.permission_ar,
		t.for_all_employees
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 12/02/2019 10:31:14 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.permission_ar,
		d.for_all_employees
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 12/02/2019 10:33:56 ******************
-- VIEW: documents_dialog

DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 12/02/2019 10:34:11 ******************
-- VIEW: doc_templates_dialog

DROP VIEW doc_templates_dialog;

CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.for_all_employees,
		t.comment_text,
		t.fields,
		t.document_prefix,
		t.template_file,
		t.permissions
		
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;

-- ******************* update 12/02/2019 10:42:29 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 12/02/2019 10:43:59 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permission_ar AS tmpl_permission_ar
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 12/02/2019 11:08:25 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
	
		IF NEW.date_time IS NULL THEN
			NEW.date_time = now();
		END IF;
		
		IF NEW.doc_number IS NULL THEN
			SELECT
				coalesce((SELECT t.document_prefix FROM doc_templates AS t WHERE t.id=NEW.doc_template_id),'') ||
				(coalesce(max(regexp_replace(d.doc_number,'\D+.*$','')::int),0)+1)::text
			INTO NEW.doc_number
			FROM documents AS d
			WHERE d.doc_template_id = NEW.doc_template_id;
		END IF;
		
		--permissions
		IF NEW.permissions IS NOT NULL THEN
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;				
		END IF;
				
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN		

		--permissions
		IF NEW.permissions<>OLD.permissions THEN
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;				
		END IF;
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 12/02/2019 11:08:52 ******************
-- Trigger: documents_trigger on documents

 DROP TRIGGER documents_before_trigger ON documents;

CREATE TRIGGER documents_before_trigger
  BEFORE INSERT OR UPDATE
  ON documents
  FOR EACH ROW
  EXECUTE PROCEDURE documents_process();


-- ******************* update 12/02/2019 15:27:17 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 12/02/2019 15:27:26 ******************
-- VIEW: documents_dialog

DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 12/02/2019 17:26:40 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
	
		IF NEW.date_time IS NULL THEN
			NEW.date_time = now();
		END IF;
		
		IF NEW.doc_number IS NULL THEN
			SELECT
				coalesce((SELECT t.document_prefix FROM doc_templates AS t WHERE t.id=NEW.doc_template_id),'') ||
				(coalesce(max(regexp_replace(d.doc_number,'\D+.*$','0')::int),0)+1)::text
			INTO NEW.doc_number
			FROM documents AS d
			WHERE d.doc_template_id = NEW.doc_template_id;
		END IF;
		
		--permissions
		IF NEW.permissions IS NOT NULL THEN
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;				
		END IF;
				
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN		

		--permissions
		IF NEW.permissions<>OLD.permissions THEN
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;				
		END IF;
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 15/02/2019 10:21:58 ******************

		--constant value table
		CREATE TABLE IF NOT EXISTS const_reminder_refresh_interval
		(name text, descr text, val int,
			val_type text,ctrl_class text,ctrl_options json, view_class text,view_options json);
		ALTER TABLE const_reminder_refresh_interval OWNER TO law_tmpl;
		INSERT INTO const_reminder_refresh_interval (name,descr,val,val_type,ctrl_class,ctrl_options,view_class,view_options) VALUES (
			'Период обновления напоминаний'
			,'Период обновления напоминаний в секундах'
			,15
			,'Int'
			,NULL
			,NULL
			,NULL
			,NULL
		);
		--constant get value
		CREATE OR REPLACE FUNCTION const_reminder_refresh_interval_val()
		RETURNS int AS
		$BODY$
			SELECT val::int AS val FROM const_reminder_refresh_interval LIMIT 1;
		$BODY$
		LANGUAGE sql STABLE COST 100;
		ALTER FUNCTION const_reminder_refresh_interval_val() OWNER TO law_tmpl;
		--constant set value
		CREATE OR REPLACE FUNCTION const_reminder_refresh_interval_set_val(Int)
		RETURNS void AS
		$BODY$
			UPDATE const_reminder_refresh_interval SET val=$1;
		$BODY$
		LANGUAGE sql VOLATILE COST 100;
		ALTER FUNCTION const_reminder_refresh_interval_set_val(Int) OWNER TO law_tmpl;
		--edit view: all keys and descr
		CREATE OR REPLACE VIEW const_reminder_refresh_interval_view AS
		SELECT
			'reminder_refresh_interval'::text AS id
			,t.name
			,t.descr
		,
		t.val::text AS val
		,t.val_type::text AS val_type
		,t.ctrl_class::text
		,t.ctrl_options::json
		,t.view_class::text
		,t.view_options::json
		FROM const_reminder_refresh_interval AS t
		;
		ALTER VIEW const_reminder_refresh_interval_view OWNER TO law_tmpl;
		CREATE OR REPLACE VIEW constants_list_view AS
		SELECT *
		FROM const_doc_per_page_count_view
		UNION ALL
		SELECT *
		FROM const_grid_refresh_interval_view
		UNION ALL
		SELECT *
		FROM const_session_live_time_view
		UNION ALL
		SELECT *
		FROM const_reminder_refresh_interval_view;
		ALTER VIEW constants_list_view OWNER TO law_tmpl;
	
-- ******************* update 27/02/2019 18:00:29 ******************

		CREATE TABLE data_type_field_aliases
		(data_type data_types NOT NULL,field  varchar(100) NOT NULL,alias  varchar(100),CONSTRAINT data_type_field_aliases_pkey PRIMARY KEY (data_type,field)
		);
		ALTER TABLE data_type_field_aliases OWNER TO law_tmpl;
		
-- ******************* update 27/02/2019 18:04:37 ******************

		INSERT INTO views
		(id,c,f,t,section,descr,limited)
		VALUES (
		'10012',
		'DataTypeFieldAlias_Controller',
		'get_list',
		'DataTypeFieldAliasList',
		'Справочники',
		'Соответствия полей типым данных',
		FALSE
		);
	
-- ******************* update 27/02/2019 18:29:39 ******************

					ALTER TYPE data_types ADD VALUE 'employees';
					ALTER TYPE data_types ADD VALUE 'departments';
					ALTER TYPE data_types ADD VALUE 'banks';


-- ******************* update 28/02/2019 08:55:22 ******************

	DROP INDEX IF EXISTS documents_doc_number_idx;
	CREATE UNIQUE INDEX documents_doc_number_idx
	ON documents(doc_number);


-- ******************* update 28/02/2019 09:04:11 ******************
-- Function: documents_process()

-- DROP FUNCTION documents_process();

CREATE OR REPLACE FUNCTION documents_process()
  RETURNS trigger AS
$BODY$
BEGIN
	IF (TG_WHEN='BEFORE' AND TG_OP='INSERT') THEN
	
		IF NEW.date_time IS NULL THEN
			NEW.date_time = now();
		END IF;
		
		IF NEW.doc_number IS NULL THEN
			SELECT
				coalesce((SELECT t.document_prefix FROM doc_templates AS t WHERE t.id=NEW.doc_template_id),'') ||
				(coalesce(max(regexp_replace(d.doc_number,'\D+-*','0')::int),0)+1)::text
			INTO NEW.doc_number
			FROM documents AS d
			WHERE d.doc_template_id = NEW.doc_template_id;
		END IF;
		
		--permissions
		IF NEW.permissions IS NOT NULL THEN
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;				
		END IF;
				
		RETURN NEW;
		
	ELSIF (TG_WHEN='BEFORE' AND TG_OP='UPDATE') THEN		

		--permissions
		IF NEW.permissions<>OLD.permissions THEN
			SELECT
				array_agg( ((sub.obj->'fields'->>'obj')::json->>'dataType')||((sub.obj->'fields'->>'obj')::json->'keys'->>'id') )
			INTO NEW.permission_ar
			FROM (
				SELECT jsonb_array_elements(NEW.permissions->'rows') AS obj
			) AS sub		
			;				
		END IF;
			
		RETURN NEW;
	END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION documents_process() OWNER TO law_tmpl;


-- ******************* update 28/02/2019 09:15:57 ******************
	CREATE UNIQUE INDEX doc_templates_name_idx
	ON doc_templates(lower(name));


-- ******************* update 18/04/2019 11:13:53 ******************
-- View: public.views_section_list

-- DROP VIEW public.views_section_list;

CREATE OR REPLACE VIEW public.views_section_list AS 
 SELECT DISTINCT views.section
   FROM views
  ORDER BY views.section;

ALTER TABLE public.views_section_list OWNER TO law_tmpl;


-- ******************* update 22/05/2019 10:53:51 ******************
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
        (inn,ogrn,name,data,user_id,create_dt)
        VALUES (in_inn,in_ogrn,in_name,in_data,in_user_id,now());
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

ALTER VIEW egrul_search_data_upsert(in_inn varchar(12),in_ogrn varchar(15),in_name text,in_data json,in_user_id int) OWNER TO law_tmpl;

-- ******************* update 22/05/2019 10:54:06 ******************
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
        (inn,ogrn,name,data,user_id,create_dt)
        VALUES (in_inn,in_ogrn,in_name,in_data,in_user_id,now());
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

ALTER FUNCTION egrul_search_data_upsert(in_inn varchar(12),in_ogrn varchar(15),in_name text,in_data json,in_user_id int) OWNER TO law_tmpl;

-- ******************* update 22/05/2019 10:58:19 ******************
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
        VALUES (in_inn,in_ogrn,in_name,in_data,in_user_id,now(),1);
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

ALTER FUNCTION egrul_search_data_upsert(in_inn varchar(12),in_ogrn varchar(15),in_name text,in_data json,in_user_id int) OWNER TO law_tmpl;

-- ******************* update 22/05/2019 11:10:32 ******************
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

ALTER FUNCTION egrul_search_data_upsert(in_inn varchar(12),in_ogrn varchar(15),in_name text,in_data json,in_user_id int) OWNER TO law_tmpl;

-- ******************* update 27/05/2019 12:31:02 ******************

		ALTER TABLE documents ADD COLUMN document_data bytea;


-- ******************* update 27/05/2019 16:45:54 ******************
-- VIEW: documents_dialog

DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions,
		(d.document_data IS NOT NULL) AS document_data_exists
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 27/05/2019 16:49:20 ******************

		ALTER TABLE documents ADD COLUMN document_gen_date timestampTZ,ADD COLUMN document_gen_employee_id int REFERENCES employees(id);


-- ******************* update 27/05/2019 17:03:12 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions,
		(d.document_data IS NOT NULL) AS document_data_exists,
		employees_ref(empl) AS document_gen_employees_ref
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	LEFT JOIN employees AS empl ON empl.id=d.document_gen_employee_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 27/05/2019 17:03:34 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions,
		(d.document_data IS NOT NULL) AS document_data_exists,
		employees_ref(empl2) AS document_gen_employees_ref
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	LEFT JOIN employees AS empl2 ON empl2.id=d.document_gen_employee_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 27/05/2019 17:15:48 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions,
		(d.document_data IS NOT NULL) AS document_data_exists,
		employees_ref(empl2) AS document_gen_employees_ref,
		d.document_gen_date
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	LEFT JOIN employees AS empl2 ON empl2.id=d.document_gen_employee_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;

-- ******************* update 28/05/2019 09:07:22 ******************
-- VIEW: doc_templates_dialog

DROP VIEW doc_templates_dialog;
/*
CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.for_all_employees,
		t.comment_text,
		t.fields,
		t.document_prefix,
		t.template_file,
		t.permissions
		
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;
*/

-- ******************* update 28/05/2019 09:07:33 ******************
-- VIEW: doc_templates_dialog

DROP VIEW doc_templates_dialog;

CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.for_all_employees,
		t.comment_text,
		t.fields,
		t.document_prefix,
		t.template_file,
		t.permissions
		
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;


-- ******************* update 28/05/2019 09:08:56 ******************
-- VIEW: documents_dialog

DROP VIEW documents_dialog;
/*
CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions,
		(d.document_data IS NOT NULL) AS document_data_exists,
		employees_ref(empl2) AS document_gen_employees_ref,
		d.document_gen_date
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	LEFT JOIN employees AS empl2 ON empl2.id=d.document_gen_employee_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;
*/

-- ******************* update 28/05/2019 09:09:16 ******************
-- VIEW: documents_list

DROP VIEW documents_list;
/*
CREATE OR REPLACE VIEW documents_list AS
	SELECT
		d.id,
		d.date_time,
		d.employee_id,
		employees_ref(empl) AS employees_ref,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	ORDER BY d.date_time DESC
	;
	
ALTER VIEW documents_list OWNER TO law_tmpl;
*/

-- ******************* update 28/05/2019 09:09:26 ******************
-- VIEW: documents_list

--DROP VIEW documents_list;

CREATE OR REPLACE VIEW documents_list AS
	SELECT
		d.id,
		d.date_time,
		d.employee_id,
		employees_ref(empl) AS employees_ref,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	ORDER BY d.date_time DESC
	;
	
ALTER VIEW documents_list OWNER TO law_tmpl;


-- ******************* update 28/05/2019 09:09:34 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions,
		(d.document_data IS NOT NULL) AS document_data_exists,
		employees_ref(empl2) AS document_gen_employees_ref,
		d.document_gen_date
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	LEFT JOIN employees AS empl2 ON empl2.id=d.document_gen_employee_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;


-- ******************* update 28/05/2019 09:10:37 ******************
-- VIEW: doc_templates_list

--DROP VIEW doc_templates_list;

CREATE OR REPLACE VIEW doc_templates_list AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.permission_ar,
		t.for_all_employees,
		t.document_prefix
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_list OWNER TO law_tmpl;

-- ******************* update 28/05/2019 12:45:35 ******************

		ALTER TABLE doc_templates ADD COLUMN user_functions text;


-- ******************* update 28/05/2019 12:46:12 ******************
-- VIEW: doc_templates_dialog

--DROP VIEW doc_templates_dialog;

CREATE OR REPLACE VIEW doc_templates_dialog AS
	SELECT
		t.id,
		t.name,
		t.employee_id,
		employees_ref(employees) AS employees_ref,
		t.for_all_employees,
		t.comment_text,
		t.fields,
		t.document_prefix,
		t.template_file,
		t.permissions,
		t.user_functions
		
	FROM doc_templates AS t
	LEFT JOIN employees ON employees.id=t.employee_id
	ORDER BY name
	;
	
ALTER VIEW doc_templates_dialog OWNER TO law_tmpl;


-- ******************* update 28/05/2019 13:03:16 ******************
-- VIEW: documents_dialog

--DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions,
		(d.document_data IS NOT NULL) AS document_data_exists,
		employees_ref(empl2) AS document_gen_employees_ref,
		d.document_gen_date,
		tmpl.user_functions
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	LEFT JOIN employees AS empl2 ON empl2.id=d.document_gen_employee_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;


-- ******************* update 28/05/2019 14:28:01 ******************
-- VIEW: documents_dialog

DROP VIEW documents_dialog;

CREATE OR REPLACE VIEW documents_dialog AS
	SELECT
		d.id,
		d.date_time,
		employees_ref(empl) AS employees_ref,
		d.comment_text,
		d.field_values,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.doc_template_id,
		d.permissions,
		d.for_all_employees,
		d.permission_ar,		
		tmpl.for_all_employees AS tmpl_for_all_employees,
		tmpl.permissions AS tmpl_permissions,
		(d.document_data IS NOT NULL) AS document_data_exists,
		employees_ref(empl2) AS document_gen_employees_ref,
		d.document_gen_date
		
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	LEFT JOIN employees AS empl2 ON empl2.id=d.document_gen_employee_id
	;
	
ALTER VIEW documents_dialog OWNER TO law_tmpl;