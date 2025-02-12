import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

interface FileSaverInput {
  filename: string;
  content: string;
}

type FileSaverCallback = (file: string) => void;

export async function saveAll(
  files: FileSaverInput[],
  targetFolder?: string,
  onSuccess?: FileSaverCallback
): Promise<void> {
  await Promise.all(
    files.map(async (file) => {
      const targetPath = resolveFilename(file.filename, targetFolder);

      // create folder if missing
      const folder = path.dirname(targetPath);

      if (folder && !existsSync(folder)) {
        await mkdir(folder, { recursive: true });
      }

      await writeFile(targetPath, file.content);

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
