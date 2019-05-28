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
	
ALTER VIEW documents_dialog OWNER TO ;

