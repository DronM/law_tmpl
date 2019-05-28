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
ALTER FUNCTION documents_process() OWNER TO ;

