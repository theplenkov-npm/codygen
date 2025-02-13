import { Command } from '@commander-js/extra-typings';

import { codygen } from '../lib/codygen';

export default new Command('chat')
  .description('Chat with Cody and extract files from the response')
  .option('-o,--output <output>', 'Output folder')
  .option('-f, --context <context...>', 'Context file(s)')
  .option('-c, --config <config>', 'Codygen config file')
  .action((options) => {
    codygen(options);
  })
  .addHelpText(
    'afterAll',
    `
Examples:
  # Pipe promt directly into the codygen chat command and extract files to a target folder
  $ echo "Sample TS app" | codygen chat -o dist

  # Prepare config a run it just with a config file (ts,cts,mts,js,cjs,mjs,json)
  $ codygen chat --config codygen.config.ts
`
  );
