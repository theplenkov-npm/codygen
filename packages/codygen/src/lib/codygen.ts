import { promisify } from 'node:util';
import { ChildProcessByStdio, exec, spawn } from 'node:child_process';
import * as fs from 'node:fs';
import { parseChatOutput } from './parser';

import { oraPromise } from 'ora';
import chalk from 'chalk';

import { writeFile } from 'node:fs/promises';
import { Readable } from 'node:stream';
import * as path from 'node:path';

const execAsync = promisify(exec);
const ok = chalk.green('✔');

export interface CodygenOptions {
  output?: string;
  context?: Array<string>;
}

export async function codygen(options?: CodygenOptions) {
  //if stdin is empty
  if (process.stdin.isTTY) {
    console.error(
      'No input detected. Please pipe in some text to generate code from.'
    );
    return;
  }

  // Check if Cody is installed
  await oraPromise(execAsync('cody -v'), {
    text: 'Checking if Cody CLI is installed',
    successText: ({ stdout: versionOutput }) =>
      `Cody CLI is installed [${versionOutput.trim()}]`,
    failText: 'Cody CLI is not installed',
  });

  await oraPromise(execAsync('cody auth whoami'), {
    text: 'Checking if Cody CLI is authenticated',
    successText: 'User is authenticated',
    failText: 'Cody CLI is not installed',
  });

  const chatOutput = await oraPromise(
    waitFor(
      spawn(
        `cody chat --stdin ${withOptions('--context-file', options?.context)}`,
        { shell: true, stdio: ['inherit', 'pipe', 'pipe'] }
      )
    ),
    'Calling cody chat'
  );

  try {
    // Parse the output of Cody chat to get the generated code
    const snippets = parseChatOutput(chatOutput);

    if (snippets.length === 0) {
      console.log(
        'No code snippets were generated by Cody. No files will be created or updated'
      );
      return;
    }

    // Print overview of parsed files as a table: filename, number of lines
    console.log(ok, 'Cody generated the following files:');
    const overview = snippets.map(({ filename, content }) => ({
      filename,
      lines: content.split('\n').length,
      exists: fs.existsSync(filename),
    }));
    console.table(overview);
    console.log();

    // Create a new file for each generated code snippet
    await Promise.all(
      snippets.map(async ({ filename, content }) => {
        console.log(`.. Saving ${filename}`);

        const filepath = options?.output
          ? path.join(options.output, filename)
          : filename;

        return writeFile(filepath, content);
      })
    );
  } catch (error: any) {
    // Print error message from Cody CLI
    if (error.message) {
      console.error('Cody CLI error:', error.message);
    } else {
      console.error('Cody CLI error:', error);
    }
  }
}

function waitFor(child: ChildProcessByStdio<null, Readable, Readable>) {
  return new Promise<string>((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(
          new Error(`Command failed with code ${code}:\n${stderr.trim()}`)
        );
      }
    });
    child.on('error', (err) => {
      reject(err);
    });
  });
}

function withOptions(name: string, values?: Array<string>) {
  return values?.map((value) => `${name} ${value}`).join(' ') || '';
}
