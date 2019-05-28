-- Trigger: doc_templates_before_trigger on public.doc_templates

-- DROP TRIGGER doc_templates_before_trigger ON public.doc_templates;

CREATE TRIGGER doc_templates_before_trigger
  BEFORE INSERT OR UPDATE
  ON public.doc_templates
  FOR EACH ROW
  EXECUTE PROCEDURE public.doc_templates_process();

