import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const mappings = [
  { src: 'src/shared/nav.html', dest: 'nav.html' },
  { src: 'src/de/index.html', dest: 'index.html' },
  { src: 'src/de/pages', dest: 'deutsch', dir: true },
  { src: 'src/en/pages', dest: 'english', dir: true }
];

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyFile(srcRel, destRel) {
  const src = path.join(root, srcRel);
  const dest = path.join(root, destRel);
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

async function cleanHtmlInDir(dirRel) {
  const dir = path.join(root, dirRel);
  await ensureDir(dir);
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await cleanHtmlInDir(path.join(dirRel, entry.name));
      continue;
    }
    if (entry.name.endsWith('.html')) {
      await fs.unlink(full);
    }
  }
}

async function copyHtmlDir(srcRel, destRel) {
  const srcDir = path.join(root, srcRel);
  const destDir = path.join(root, destRel);
  await ensureDir(destDir);

  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const childSrcRel = path.join(srcRel, entry.name);
    const childDestRel = path.join(destRel, entry.name);

    if (entry.isDirectory()) {
      await copyHtmlDir(childSrcRel, childDestRel);
      continue;
    }

    if (entry.name.endsWith('.html')) {
      await copyFile(childSrcRel, childDestRel);
    }
  }
}

async function main() {
  const clean = process.argv.includes('--clean');

  if (clean) {
    await cleanHtmlInDir('deutsch');
    await cleanHtmlInDir('english');
  }

  for (const map of mappings) {
    if (map.dir) {
      await copyHtmlDir(map.src, map.dest);
    } else {
      await copyFile(map.src, map.dest);
    }
  }

  console.log('Build complete: src content published to runtime folders.');
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
