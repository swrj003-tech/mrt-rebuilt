
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const targetFile = 'MRT_Project_Code_Map.txt';
const rootDir = process.cwd();

// Exclusions
const excludeDirs = ['node_modules', '.git', '.gemini', 'dist', 'artifacts'];
const excludeExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.db', '.ico', '.pdf', '.zip'];
const excludeFiles = [targetFile, 'MRT_Map_v2.txt', 'MRT_Map_v3.txt', 'MRT_Project_Code_Map_New.txt', 'package-lock.json'];

// Header
let output = `# MRT International - Complete Project Code Map\n`;
output += `## Project Overview\nThis document contains the complete file-by-file structure and source code for the MRT International Holding LLC e-commerce platform.\n\n`;

try {
    const tree = execSync('cmd /c tree /f /a').toString();
    output += `## Folder Structure\n\`\`\`\n${tree}\n\`\`\`\n\n---\n\n`;
} catch (e) {
    output += `## Folder Structure\n(Tree generation failed)\n\n---\n\n`;
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(rootDir, fullPath);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                walk(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (excludeExts.includes(ext)) continue;
            if (excludeFiles.includes(file)) continue;

            const size = stat.size;
            const lang = ext.replace('.', '') || 'text';
            
            output += `\n## File: ${relativePath}\n`;
            output += `**Path:** \`${relativePath}\`\n`;
            output += `**Size:** ${size} bytes\n`;
            output += `\`\`\`${lang}\n`;
            
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                output += content;
            } catch (e) {
                output += `(Error reading file: ${e.message})`;
            }
            
            output += `\n\`\`\`\n\n---\n`;
            console.log(`Processed: ${relativePath}`);
        }
    }
}

walk(rootDir);

fs.writeFileSync(targetFile, output);
console.log(`Code map generated successfully: ${targetFile}`);
