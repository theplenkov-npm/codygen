import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

class Context {
  constructor(private readonly _path: string) {}
  from(target: string) {
    return new Context(resolve(this._path, target));
  }
  read(paths: string[]) {
    return readFiles(paths, [this._path]);
  }
}

export function from(parent: string) {
  return new Context(parent);
}

function readFiles(
  paths: string[],
  resolvePaths?: string[]
): Promise<string[]> {
  return Promise.all(
    paths.map((prompt) => readFileAsync(prompt, resolvePaths))
  );
}

async function readFileAsync(
  path: string,
  resolvePaths?: string[]
): Promise<string> {
  return (
    await readFile(resolvePaths ? resolve(...resolvePaths, path) : path, 'utf8')
  ).toString();
}
