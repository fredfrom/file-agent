/**
 * Database seed script for File Agent.
 *
 * Loads the complete v1 corpus (47+ documents) via loadCorpus() and inserts
 * them into Postgres as documents belonging to the "Stadtpark Residenzen" project.
 *
 * Idempotent: uses upsert on the compound unique key (projectId, virtualPath)
 * so running twice does not create duplicates.
 *
 * Usage: npx prisma db seed
 * (configured in prisma.config.ts as "tsx prisma/seed.ts")
 */

import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { loadCorpus } from "../src/corpus/loader";

const PROJECT_ID = "00000000-0000-0000-0000-000000000001";
const PROJECT_NAME = "Stadtpark Residenzen";

/**
 * Parse a virtual filesystem path into folder, filename, and extension components.
 *
 * Example: "/01_vertraege/auftraggeber/hauptvertrag_stadtpark_ag.txt"
 *   -> folder: "/01_vertraege/auftraggeber"
 *   -> filename: "hauptvertrag_stadtpark_ag"
 *   -> extension: "txt"
 */
function parseVirtualPath(virtualPath: string): {
  folder: string;
  filename: string;
  extension: string;
} {
  const segments = virtualPath.split("/").filter(Boolean);
  const fullFilename = segments[segments.length - 1];
  const folder = "/" + segments.slice(0, -1).join("/");
  const ext = path.extname(fullFilename);
  const extension = ext.slice(1); // remove leading dot
  const filename = path.basename(fullFilename, ext);

  return { folder, filename, extension };
}

async function main(): Promise<void> {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    // Upsert project (idempotent)
    const project = await prisma.project.upsert({
      where: { id: PROJECT_ID },
      update: { name: PROJECT_NAME },
      create: { id: PROJECT_ID, name: PROJECT_NAME },
    });

    // Load the complete v1 corpus
    const corpus = await loadCorpus();
    const entries = Object.entries(corpus);
    console.log(`Seeding ${entries.length} documents...`);

    // Upsert each document (idempotent via compound unique key)
    for (const [virtualPath, content] of entries) {
      const { folder, filename, extension } = parseVirtualPath(virtualPath);

      await prisma.document.upsert({
        where: {
          projectId_virtualPath: {
            projectId: project.id,
            virtualPath,
          },
        },
        update: { content, folder, filename, extension },
        create: {
          projectId: project.id,
          virtualPath,
          folder,
          filename,
          extension,
          content,
          metadata: {},
        },
      });
    }

    console.log(
      `Seeded ${entries.length} documents for project '${project.name}'`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
