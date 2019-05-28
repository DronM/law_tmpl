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
	
ALTER VIEW doc_templates_list OWNER TO ;
