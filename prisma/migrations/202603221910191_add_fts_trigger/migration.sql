-- Create trigger function for German tsvector (DATA-04)
CREATE OR REPLACE FUNCTION documents_content_tsv_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.content_tsv := to_tsvector('german', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to documents table
CREATE TRIGGER trg_documents_content_tsv
  BEFORE INSERT OR UPDATE OF content ON documents
  FOR EACH ROW
  EXECUTE FUNCTION documents_content_tsv_trigger();

-- GIN index for fast full-text search (DATA-05)
CREATE INDEX idx_documents_content_tsv ON documents USING GIN (content_tsv);
