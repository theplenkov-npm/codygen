import { spawn } from 'child_process';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { Buffer } from 'buffer';

export async function runCommandWithInput(
  command: string,
  args: string[],
  input: Readable | string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'inherit'],
    });

    // Convert string input to a Readable stream if necessary
    const inputStream: Readable =
      typeof input === 'string' ? Readable.from([input]) : input;

    // Pipe input stream to stdin
    inputStream.pipe(child.stdin);

    // Capture stdout
    const outputChunks: Buffer[] = [];
    await pipeline(child.stdout, async function* (source) {
      for await (const chunk of source) {
        outputChunks.push(chunk);
      }
    });

    // Wait for process to exit
    child.on('exit', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(outputChunks).toString());
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}
