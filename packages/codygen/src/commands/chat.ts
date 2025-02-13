import { Command } from '@commander-js/extra-typings';

import { codygen } from '../lib/codygen';

export default new Command('chat')
  .description('Chat with Cody and extract files from the response')
  .option('-o,--output <output>', 'Output folder')
  .option('-c, --context <context...>')
  .action(({ output, context }) => {
    codygen({ output, context });
  })
  .addHelpText(
    'afterAll',
    `
Examples:
  # Pipe promt directly into the codygen chat command and extract files to a target folder
  $ echo "Sample TS app" | codygen chat -o dist
`
  );
