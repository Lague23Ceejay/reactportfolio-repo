// scripts/migrate-stack-format.ts

import fs from 'fs';
import path from 'path';


const filePath = path.resolve(process.cwd(), 'public', 'data.json');

function normalizeStackItem(s: any) {
  if (typeof s === 'string') {
    const [name = 'Tech', val = '0'] = s.split(':');
    const level = Number.parseInt(val.trim() || '0', 10) || 0;
    return { name: name.trim(), level };
  }
  // already object-ish
  return {
    name: (s?.name as string) || 'Tech',
    level: typeof s?.level === 'number' ? s.level : Number(s?.level) || 0
  };
}

function migrate() {
  if (!fs.existsSync(filePath)) {
    console.error('data.json not found at', filePath);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse data.json:', err);
    process.exit(1);
  }

  if (!Array.isArray(data.projects)) {
    console.error('No projects array found in data.json — nothing to migrate.');
    process.exit(0);
  }

  // Backup original
  const backupPath = filePath + `.bak.${Date.now()}`;
  fs.writeFileSync(backupPath, raw, 'utf-8');
  console.log('Backup written to', backupPath);

  data.projects = data.projects.map((p: any) => {
    const copy = { ...p };
    if (Array.isArray(copy.stack)) {
      copy.stack = copy.stack.map(normalizeStackItem);
    } else {
      copy.stack = [];
    }
    return copy;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Migration complete — data.json updated.');
}

migrate();
