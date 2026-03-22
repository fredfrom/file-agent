CREATE TABLE "access_logs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "project_id" UUID NOT NULL,
  "virtual_path" TEXT NOT NULL,
  "source" VARCHAR(10) NOT NULL,
  "access_order" INTEGER NOT NULL,
  "session_id" UUID NOT NULL,
  "accessed_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "access_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "access_logs_project_id_idx" ON "access_logs"("project_id");
CREATE INDEX "access_logs_session_id_idx" ON "access_logs"("session_id");
CREATE INDEX "access_logs_accessed_at_idx" ON "access_logs"("accessed_at");
