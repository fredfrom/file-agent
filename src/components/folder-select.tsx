'use client';

import { PROJECT_FOLDERS } from '@/lib/ingest/constants';

interface FolderSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function FolderSelect({ value, onChange, disabled }: FolderSelectProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor="folder-select"
        className="block text-sm font-medium text-[var(--foreground)]"
      >
        Zielordner
      </label>
      <select
        id="folder-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] disabled:opacity-50"
      >
        <option value="" disabled>
          Zielordner waehlen...
        </option>
        {PROJECT_FOLDERS.map((folder) => (
          <option key={folder.value} value={folder.value}>
            {folder.label}
          </option>
        ))}
      </select>
    </div>
  );
}
