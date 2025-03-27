#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Mappings des anciens chemins vers les nouveaux
const importMappings = {
  '@/components/credential/': '@/components/features/auth/',
  '@/components/endpoint/': '@/components/features/endpoints/',
  '@/components/results/': '@/components/features/results/',
  '@/components/history/': '@/components/features/history/',
  '@/components/theme/': '@/components/shared/theme/',
  '@/components/ui/': '@/components/shared/ui/',
  '@/components/layout/': '@/components/core/',
  '@/lib/web-vitals': '@/lib/analytics/web-vitals',
  '@/lib/utils': '@/lib/utils/utils',
  '@/lib/export/': '@/lib/utils/export/',
  '@/hooks/use-cyberark-query': '@/hooks/api/use-cyberark-query',
};

// Extensions de fichiers à traiter
const extensions = ['.ts', '.tsx', '.js', '.jsx'];

// Fonction récursive pour parcourir un répertoire
async function walkDirectory(dir) {
  let files = await fs.readdir(dir);
  files = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      return walkDirectory(filePath);
    } else if (stats.isFile() && extensions.includes(path.extname(file))) {
      return filePath;
    }
  }));
  return files.flat().filter(Boolean);
}

// Fonction pour mettre à jour les imports dans un fichier
async function updateImports(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;

    for (const [oldPath, newPath] of Object.entries(importMappings)) {
      const regex = new RegExp(`from ['"]${oldPath}`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `from '${newPath}`);
        modified = true;
      }

      const importRegex = new RegExp(`import ['"]${oldPath}`, 'g');
      if (importRegex.test(content)) {
        content = content.replace(importRegex, `import '${newPath}`);
        modified = true;
      }
    }

    if (modified) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Fonction principale
async function main() {
  try {
    const rootDir = process.cwd();
    const files = await walkDirectory(rootDir);
    
    console.log(`Found ${files.length} files to process`);
    
    let updatedCount = 0;
    for (const file of files) {
      try {
        await updateImports(file);
        updatedCount++;
      } catch (error) {
        console.error(`Error updating imports in ${file}:`, error);
      }
    }
    
    console.log(`Successfully processed ${updatedCount} files`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 