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
	
ALTER VIEW user_catalog_data_list OWNER TO ;

