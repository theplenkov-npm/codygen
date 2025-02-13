import { program } from '@commander-js/extra-typings';

// codygen CLI
import extract from './commands/extract';
import chat from './commands/chat';

program
  .name('codygen')
  .description('Sourcegraph Cody CLI wrapper with extra features')
  .addCommand(chat)
  .addCommand(extract);

program.parseAsync(process.argv);
