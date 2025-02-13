import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { oraPromise } from 'ora';
import { Readable } from 'node:stream';
import { extractSnpipets } from './extractor';
import { CodygenConfig, toStringArrayAsync, toStringAsync } from './config';
import { runCommandWithInput } from './stream';

const execAsync = promisify(exec);

export interface CodygenOptions {
  output?: string;
  context?: Array<string>;
  config?: string;
}

export async function codygen(options?: CodygenOptions) {
  let inputStream: Readable;
  let outputFolder: string | undefined;
  let context: Array<string>;

  if (options?.config) {
    const config = await CodygenConfig.load(options.config);
    const prompt = await toStringAsync(config.prompt);
    outputFolder ??= config.output;
    context ??= await toStringArrayAsync(config.context);

    // Create a Readable stream from the prompt string
    inputStream = Readable.from([prompt]);
  } else if (!process.stdin.isTTY) {
    console.log('Using prompt from stdin');

    // Use stdin as the input stream
    inputStream = process.stdin;
  } else {
    console.error(
      'No input detected. Please provide a config with a prompt or pipe in some text to generate code from.'
    );
    return;
  }

  outputFolder ??= options?.output;
  context ??= options?.context ?? [];

  // Check if Cody is installed
  await oraPromise(execAsync('cody -v'), {
    text: 'Checking if Cody CLI is installed',
    successText: ({ stdout: versionOutput }) =>
      `Cody CLI is installed [${versionOutput.trim()}]`,
    failText: 'Cody CLI is not installed',
  });

  // Check if Cody is authenticated
  await oraPromise(execAsync('cody auth whoami'), {
    text: 'Checking if Cody CLI is authenticated',
    successText: 'User is authenticated',
    failText: 'Cody CLI is not installed',
  });

  // Call cody chat with the input stream
  const chatOutput = await oraPromise(
    runCommandWithInput(
      'cody',
      ['chat', '--stdin', ...args('--context-file', context)],
      inputStream
    ),
    'Calling cody chat'
  );

  try {
    await extractSnpipets(chatOutput, outputFolder);
  } catch (error: unknown) {
    // Print error message from Cody CLI
    if (error instanceof Error) {
      console.error('Cody CLI error:', error.message);
    } else {
      console.error('Cody CLI error:', error);
    }
  }
}
function args(name: string, values?: Array<string>) {
  return values?.map((value) => [name, value]).flat() || [];
}
