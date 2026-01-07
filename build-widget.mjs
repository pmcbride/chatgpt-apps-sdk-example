#!/usr/bin/env node
import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildWidget() {
  console.log('Building widget...');
  
  try {
    await build({
      build: {
        outDir: resolve(__dirname, 'assets'),
        emptyOutDir: true,
        rollupOptions: {
          input: {
            'posts-widget': resolve(__dirname, 'src/widgets/posts-widget.html'),
          },
        },
      },
    });
    
    console.log('Widget built successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildWidget();
