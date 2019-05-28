-- Trigger: documents_trigger on documents

 DROP TRIGGER documents_before_trigger ON documents;

CREATE TRIGGER documents_before_trigger
  BEFORE INSERT OR UPDATE
  ON documents
  FOR EACH ROW
  EXECUTE PROCEDURE documents_process();

