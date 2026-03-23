/**
 * Postinstall patch for bash-tool package.
 *
 * bash-tool's package.json exports only define an "import" entry but no
 * "default" entry, which breaks some bundlers and test runners.
 * This script copies the "import" value to "default" so both resolve paths work.
 *
 * Exits with code 1 on ANY error so npm install surfaces the problem.
 */
const fs = require('fs');
const path = require('path');

const pkgPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'bash-tool',
  'package.json',
);

try {
  if (!fs.existsSync(pkgPath)) {
    console.error(
      `[patch-bash-tool] ERROR: File not found: ${pkgPath}`,
    );
    process.exit(1);
  }

  const raw = fs.readFileSync(pkgPath, 'utf-8');
  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch (parseErr) {
    console.error(
      `[patch-bash-tool] ERROR: Failed to parse ${pkgPath}:`,
      parseErr.message,
    );
    process.exit(1);
  }

  const dotExports = pkg.exports && pkg.exports['.'];
  if (!dotExports || !dotExports.import) {
    console.error(
      '[patch-bash-tool] ERROR: exports["."].import not found in bash-tool package.json',
    );
    process.exit(1);
  }

  // Already patched?
  if (dotExports.default === dotExports.import) {
    console.log('[patch-bash-tool] bash-tool exports already patched, skipping');
    process.exit(0);
  }

  // Apply patch
  dotExports.default = dotExports.import;
  try {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  } catch (writeErr) {
    console.error(
      `[patch-bash-tool] ERROR: Failed to write ${pkgPath}:`,
      writeErr.message,
    );
    process.exit(1);
  }

  console.log('[patch-bash-tool] bash-tool exports patched successfully');
} catch (err) {
  console.error('[patch-bash-tool] ERROR:', err.message || err);
  process.exit(1);
}
