import { describe, it } from "vitest";

describe("DATA-07: Seed Script", () => {
  it.todo("seed creates project 'Stadtpark Residenzen' with fixed UUID");
  it.todo("seed inserts all 47+ corpus documents");
  it.todo(
    "each document has correct folder, filename, extension parsed from virtual_path"
  );
  it.todo("seed is idempotent -- running twice does not create duplicates");
  it.todo("seed uses relative imports (not @/ aliases) for tsx compatibility");
});
