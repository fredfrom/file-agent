import { describe, it } from "vitest";

describe("DATA-02: Projects table", () => {
  it.todo("projects table has uuid pk, name, created_at columns");
  it.todo("project id defaults to uuid");
});

describe("DATA-03: Documents table", () => {
  it.todo(
    "documents table has all required columns: id, project_id, virtual_path, folder, filename, extension, content, metadata, content_tsv, created_at"
  );
  it.todo(
    "documents.project_id is a foreign key to projects.id with cascade delete"
  );
  it.todo("documents has unique constraint on (project_id, virtual_path)");
  it.todo("documents has indexes on project_id, virtual_path, and folder");
});
