#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import cac from 'cac';
import { listTypographies } from './helper/figma.js';
import { build as buildScss } from './helper/scss.js';

interface CliOption {
  token: string;
  outDir: string;
}

const cli = cac('figma-export-typography');

const run = () => {
  cli
    .command('build <fileId>', 'Generate typography styles')
    .option('-t, --token <token>', 'Your personal access token for Figma', {
      default: '',
    })
    .option(
      '-o, --out-dir <out-dir>',
      'Directory where component files are saved.',
      { default: './output' },
    )
    .action(async (fileId, options: CliOption) => {
      const typographies = await listTypographies(options.token, fileId);
      await fs.promises.access(options.outDir).catch(async () => {
        await fs.promises.mkdir(options.outDir);
      });
      await fs.promises.writeFile(
        path.join(options.outDir, 'typography.scss'),
        buildScss(typographies),
      );
    });
  cli.parse();
};

run();
