import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const pubspecPath = path.join(rootDir, 'mobile', 'pubspec.yaml');
const pubspecContent = fs.readFileSync(pubspecPath, 'utf8');

// Extract version from pubspec.yaml
const versionMatch = pubspecContent.match(/^version:\s*([0-9]+\.[0-9]+\.[0-9]+)/m);
const version = versionMatch ? versionMatch[1] : '0.5.6';

const appName = 'ILoveMyOfficeWorks';
const brandedApkName = `${appName}-v${version}.apk`;

const flutterApkDir = path.join(rootDir, 'mobile', 'build', 'app', 'outputs', 'flutter-apk');
const sourceReleaseApk = path.join(flutterApkDir, 'app-release.apk');
const brandedApkInBuild = path.join(flutterApkDir, brandedApkName);

const distDir = path.join(rootDir, 'dist');
const brandedApkInDist = path.join(distDir, brandedApkName);

console.log(`\n========================================================`);
console.log(`🏷️  PACKAGING RELEASE APK: ${appName} v${version}`);
console.log(`========================================================`);

if (!fs.existsSync(sourceReleaseApk)) {
  console.warn(`⚠️ Warning: ${sourceReleaseApk} was not found.`);
  console.warn(`Make sure to run "flutter build apk --release" inside mobile/ first.`);
  process.exit(0);
}

// Ensure dist directory exists
fs.mkdirSync(distDir, { recursive: true });

// Copy APK to branded target files
fs.copyFileSync(sourceReleaseApk, brandedApkInBuild);
fs.copyFileSync(sourceReleaseApk, brandedApkInDist);

const stats = fs.statSync(brandedApkInBuild);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

// Calculate SHA-256 Checksum
const fileBuffer = fs.readFileSync(brandedApkInBuild);
const hashSum = crypto.createHash('sha256');
hashSum.update(fileBuffer);
const sha256 = hashSum.digest('hex');

console.log(`✅ Status:       SUCCESSFULLY BRANDED & PACKAGED`);
console.log(`📱 Brand Name:   ${appName}`);
console.log(`📦 Version:      v${version} (Code: 56)`);
console.log(`⚖️  Size:         ${sizeMB} MB (${stats.size} bytes)`);
console.log(`🔒 SHA-256:      ${sha256}`);
console.log(`📍 Output Path 1: ${brandedApkInBuild}`);
console.log(`📍 Output Path 2: ${brandedApkInDist}`);
console.log(`========================================================\n`);
