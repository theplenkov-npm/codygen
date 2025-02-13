import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';

type MaybeArray<T> = T | Array<T>;

type MaybeFunction<T> = T | (() => T | Promise<T>);

export interface CodygenConfigSchhema {
  prompt: MaybeFunction<MaybeArray<string>>;
  context?: MaybeFunction<MaybeArray<string>>;
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
    const loader = new ConfigLoader<CodygenConfigSchhema>();
    return await loader.load(filepath);
  }
  static define(config: CodygenConfig) {
    return new ConfigLoader<CodygenConfig>().define(config);
  }
}

export async function toStringAsync(value?: MaybeFunction<MaybeArray<string>>) {
  const maybeArray = typeof value === 'function' ? await value() : value;
  if (Array.isArray(maybeArray)) {
    return maybeArray.join('\n');
  }
  return maybeArray;
}

export async function toStringArrayAsync(
  value?: MaybeFunction<MaybeArray<string>>
) {
  const maybeArray = typeof value === 'function' ? await value() : value;
  return Array.isArray(maybeArray)
    ? maybeArray
    : maybeArray
    ? [maybeArray]
    : [];
}
