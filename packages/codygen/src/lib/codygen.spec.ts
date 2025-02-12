import { Snippet } from './types';
import path from 'path';

describe('targetSnippets reducer', () => {
  const mockSnippets: Snippet[] = [
    { filename: 'test1.ts', content: 'content1' },
    { filename: 'test2.ts', content: 'content2' },
    { filename: 'test1.ts', content: 'content3' },
    { filename: 'test3.ts', content: 'content4' },
  ];

  it('should remove duplicate filenames keeping first occurrence', () => {
    const options = { output: '/output/dir' };
    const result = mockSnippets.reduce((acc, current) => {
      if (acc.find((item) => item.filename === current.filename)) {
        return acc;
      }
      const targetPath = options?.output
        ? path.resolve(options.output, current.filename)
        : current.filename;
      return acc.concat({ ...current, targetPath });
    }, [] as Array<Snippet & { targetPath: string }>);

    expect(result).toHaveLength(3);
    expect(result[0].filename).toBe('test1.ts');
    expect(result[0].content).toBe('content1');
    expect(result[1].filename).toBe('test2.ts');
    expect(result[2].filename).toBe('test3.ts');
  });

  it('should set targetPath to filename when no output option provided', () => {
    const result = mockSnippets.reduce((acc, current) => {
      if (acc.find((item) => item.filename === current.filename)) {
        return acc;
      }
      const targetPath = undefined
        ? path.resolve(undefined, current.filename)
        : current.filename;
      return acc.concat({ ...current, targetPath });
    }, [] as Array<Snippet & { targetPath: string }>);

    expect(result[0].targetPath).toBe('test1.ts');
    expect(result[1].targetPath).toBe('test2.ts');
    expect(result[2].targetPath).toBe('test3.ts');
  });

  it('should resolve correct target paths when output directory provided', () => {
    const options = { output: '/test/output' };
    const result = mockSnippets.reduce((acc, current) => {
      if (acc.find((item) => item.filename === current.filename)) {
        return acc;
      }
      const targetPath = options?.output
        ? path.resolve(options.output, current.filename)
        : current.filename;
      return acc.concat({ ...current, targetPath });
    }, [] as Array<Snippet & { targetPath: string }>);

    expect(result[0].targetPath).toBe(path.resolve('/test/output', 'test1.ts'));
    expect(result[1].targetPath).toBe(path.resolve('/test/output', 'test2.ts'));
    expect(result[2].targetPath).toBe(path.resolve('/test/output', 'test3.ts'));
  });

  it('should handle empty snippets array', () => {
    const options = { output: '/output/dir' };
    const result = [].reduce((acc, current) => {
      if (acc.find((item) => item.filename === current.filename)) {
        return acc;
      }
      const targetPath = options?.output
        ? path.resolve(options.output, current.filename)
        : current.filename;
      return acc.concat({ ...current, targetPath });
    }, [] as Array<Snippet & { targetPath: string }>);

    expect(result).toHaveLength(0);
  });
});
