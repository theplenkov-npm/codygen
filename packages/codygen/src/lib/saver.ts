import { existsSync } from 'node:fs';
import { access, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

interface FileSaverInput {
  filename: string;
  content: string;
}

type FileSaverCallback = (file: string) => void;

export async function saveAll(
  files: FileSaverInput[],
  onSuccess?: FileSaverCallback
): Promise<void> {
  await Promise.all(
    files.map(async ({ filename: targetPath, content }) => {
      // create folder if missing
      const folder = path.dirname(targetPath);

      if (folder && !existsSync(folder)) {
        await mkdir(folder, { recursive: true });
      }

      await writeFile(targetPath, content);

      if (onSuccess) {
        onSuccess(targetPath);
      }
    })
  );
}

export function resolveFilename(
  filename: string,
  targetFolder?: string
): string {
  return targetFolder ? path.join(targetFolder, filename) : filename;
}
