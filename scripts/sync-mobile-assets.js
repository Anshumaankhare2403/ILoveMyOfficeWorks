import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const srcDist = path.join(rootDir, 'client', 'dist');
const destWeb = path.join(rootDir, 'mobile', 'assets', 'web');
const logoSrc = path.join(rootDir, 'desktop', 'assets', 'icon.png');
const logoDest = path.join(rootDir, 'mobile', 'assets', 'logo.png');

console.log('🔄 Syncing client build to mobile assets...');

if (!fs.existsSync(srcDist)) {
  console.error('❌ Error: client/dist does not exist. Please run "npm run build --prefix client" first.');
  process.exit(1);
}

// Ensure mobile/assets exists
fs.mkdirSync(path.join(rootDir, 'mobile', 'assets'), { recursive: true });

// Copy logo
if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, logoDest);
  console.log('✅ Copied logo.png to mobile/assets');
}

// Remove old web assets and copy fresh
if (fs.existsSync(destWeb)) {
  fs.rmSync(destWeb, { recursive: true, force: true });
}
fs.cpSync(srcDist, destWeb, { recursive: true });
console.log('✅ Synced client/dist to mobile/assets/web');
