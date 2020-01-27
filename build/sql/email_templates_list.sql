-- View: public.email_templates_list

-- DROP VIEW public.email_templates_list;

CREATE OR REPLACE VIEW public.email_templates_list AS 
 SELECT st.id,
    st.email_type,
    st.template
   FROM email_templates st;

ALTER TABLE public.email_templates_list
  OWNER TO ;

