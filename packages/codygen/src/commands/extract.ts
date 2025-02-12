import { Command } from '@commander-js/extra-typings';
import * as process from 'process';
import { extractSnpipets } from '../lib/extractor';

// extract command should provide following features
// - receive input from stdin ( as cody chat response )
// - parse cody chat response and extract code snippets
// - write code snippets to files

export default new Command('extract')
  .description('Extract file content from the Cody chat response and save them')
  .option('-o,--output <output>', 'Output folder')
  .action(async ({ output }) => {
    await extractSnpipets(process.stdin, output);
  });
