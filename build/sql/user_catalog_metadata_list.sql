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
	
ALTER VIEW user_catalog_metadata_list OWNER TO ;
