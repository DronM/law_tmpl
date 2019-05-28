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
	
ALTER VIEW doc_templates_dialog OWNER TO ;

