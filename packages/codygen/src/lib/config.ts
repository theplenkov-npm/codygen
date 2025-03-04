import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';

type MaybeArray<T> = T | Array<T>;
type MaybePromise<T> = T | Promise<T>;
type MaybeFunction<T> = T | (() => T);
type MaybeString = MaybeFunction<MaybePromise<MaybeArray<string>>>;

export interface CodygenConfigSchema {
  prompt: MaybeString;
  context?: MaybeString;
  output?: string;
}

class ConfigLoader<T> {
  async load(filepath: string): Promise<T> {
    const fullPath = resolve(cwd(), filepath); // Ensure absolute path
    const fileUrl = pathToFileURL(fullPath).href; // Convert to file URL
    // resolve the filepath against the current working directory
    const config = await import(fileUrl);
    return config.default;
  }
  define(config: T) {
    return config;
  }
}

export class CodygenConfig {
  static async load(filepath: string) {
    const loader = new ConfigLoader<CodygenConfigSchema>();
    return await loader.load(filepath);
  }
  static define(config: CodygenConfigSchema) {
    return new ConfigLoader<CodygenConfigSchema>().define(config);
  }
}

export async function toStringAsync(
  value?: MaybeString
): Promise<string | undefined> {
  const maybeArray = await (typeof value === 'function'
    ? await value()
    : value);
  if (Array.isArray(maybeArray)) {
    return maybeArray.join('\n');
  }
  return maybeArray;
}

export async function toStringArrayAsync(
  value?: MaybeString
): Promise<Array<string>> {
  const maybeArray = await (typeof value === 'function'
    ? await value()
    : value);
  return Array.isArray(maybeArray)
    ? maybeArray
    : maybeArray
    ? [maybeArray]
    : [];
}

export function config(config: CodygenConfigSchema) {
  return CodygenConfig.define(config);
}
