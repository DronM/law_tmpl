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
	
ALTER VIEW user_catalog_metadata_dialog OWNER TO ;
