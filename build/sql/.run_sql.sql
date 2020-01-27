-- VIEW: documents_list

--DROP VIEW documents_list;

CREATE OR REPLACE VIEW documents_list AS
	SELECT
		d.id,
		d.date_time,
		d.employee_id,
		employees_ref(empl) AS employees_ref,
		doc_templates_ref(tmpl) AS doc_templates_ref,
		d.doc_number,
		d.for_all_employees,
		d.permission_ar
	FROM documents AS d
	LEFT JOIN employees AS empl ON empl.id=d.employee_id
	LEFT JOIN doc_templates AS tmpl ON tmpl.id=d.doc_template_id
	ORDER BY d.date_time DESC
	;
	
ALTER VIEW documents_list OWNER TO law_tmpl;

