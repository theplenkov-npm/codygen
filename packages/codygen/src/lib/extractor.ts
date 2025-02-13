import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { parseChatOutput } from './parser';

import { resolveFilename, saveAll } from './saver';
import { ok } from './chalk';
import { existsSync } from 'node:fs';

export async function extractSnpipets(
  source: string | Readable,
  output?: string
): Promise<void> {
  let input: string;
  if (typeof source === 'string') {
    input = source;
  } else {
    input = await readStream(source);
  }

  if (!input) {
    console.error(
      'No input detected. Please pipe in some text to generate code from.'
    );
    return;
  }

  // get snippets from the output
  const snippets = parseChatOutput(input);

  // cody is using terminal as a filename for bash commands
  // we need to filter them out
  // additionally, sometimes cody reference the same file multiple times
  // we need to take only first occurence ( because most likely further are just some segments )
  // Filter out snippets with "terminal" as the filename and remove duplicates
  // Filter out snippets with "terminal" as the filename and remove duplicates
  const seenFilenames = new Set<string>();
  const filteredSnippets = snippets.filter((snippet) => {
    if (snippet.filename === 'terminal') {
      return false; // Filter out "terminal" filenames
    }
    if (seenFilenames.has(snippet.filename)) {
      return false; // Skip duplicates
    }
    seenFilenames.add(snippet.filename);
    return true;
  });

  if (filteredSnippets.length === 0) {
    console.log(
      'No code snippets were generated by Cody. No files will be created or updated'
    );
    return;
  }

  const snippetsWithTarget = filteredSnippets.map((snippet) => {
    const targetFilename = resolveFilename(snippet.filename, output);
    return {
      ...snippet,
      snippetFilename: snippet.filename,
      filename: resolveFilename(snippet.filename, output),
      lines: snippet.content.split('\n').length,
      exists: existsSync(targetFilename),
    };
  });

  console.log(ok, 'Cody generated the following files:');
  console.table(snippetsWithTarget, ['filename', 'lines', 'exists']);
  console.log();

  //Currently we support only creating new files, not overwriting existing ones
  if (snippetsWithTarget.some((snippet) => snippet.exists)) {
    console.error(
      'Overwrite mode currently is not supported to prevent code loss. Please delete the existing files and try again.'
    );
    return;
  }

  await saveAll(snippetsWithTarget, (filepath) => {
    console.log(ok, `-> ${filepath}`);
  });
}

async function readStream(stream: Readable): Promise<string> {
  const chunks: any[] = [];

  await pipeline(stream, async (source) => {
    for await (const chunk of source) {
      chunks.push(chunk);
    }
  });

  return Buffer.concat(chunks).toString();
}
