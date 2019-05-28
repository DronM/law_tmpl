-- View: users_profile;

--DROP VIEW users_profile;

CREATE OR REPLACE VIEW users_profile AS 
	SELECT
		u.id,
		u.name,
		--u.name_full,
		u.email,
		u.phone_cel,
		u.color_palette
	FROM users u;

ALTER TABLE users_profile OWNER TO ;
