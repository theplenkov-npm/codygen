import { program } from '@commander-js/extra-typings';

// codygen CLI
// Usage: Echo "Hello, World ts app" | codygen
import { codygen } from './lib/codygen';

program
  .name('codygen')
  .description('Sourcegraph Cody wrapper for generating code from prompts')
  .option('-o,--output <output>', 'Output folder')
  .option('-c, --context <context...>')
  .action(({ output, context }) => {
    codygen({ output, context });
  });

program.parseAsync(process.argv);
