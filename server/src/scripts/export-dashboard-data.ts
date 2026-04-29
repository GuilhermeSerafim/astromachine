import fs from 'fs';
import path from 'path';
import { db } from '../services/database';

const outputPath = path.resolve(process.cwd(), '..', 'docs', 'fase3-dashboard-data.json');

try {
  const data = db.getDashboardData();
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Dashboard JSON exportado em: ${outputPath}`);
} finally {
  db.close();
}
