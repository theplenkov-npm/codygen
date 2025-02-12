import { Command } from '@commander-js/extra-typings';

// codygen CLI
// Usage: Echo "Hello, World ts app" | codygen
import { codygen } from '../lib/codygen';

export default new Command('chat')
  .description('Chat with Cody and extract files from the response')
  .option('-o,--output <output>', 'Output folder')
  .option('-c, --context <context...>')
  .action(({ output, context }) => {
    codygen({ output, context });
  });
