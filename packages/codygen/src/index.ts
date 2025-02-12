import { program } from '@commander-js/extra-typings';

// codygen CLI
// Usage: Echo "Hello, World ts app" | codygen
import extract from './commands/extract';
import chat from './commands/chat';

program
  .name('codygen')
  .description('Sourcegraph Cody wrapper for generating code from prompts')
  .addCommand(chat)
  .addCommand(extract);

program.parseAsync(process.argv);
