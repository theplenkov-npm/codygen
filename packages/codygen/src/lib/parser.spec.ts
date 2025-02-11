import { parseChatOutput } from './parser';
describe('parseChatOutput', () => {
  it('should parse single snippet correctly', () => {
    const input = `\`\`\`typescript:test.ts
console.log("hello");
\`\`\``;

    const result = parseChatOutput(input);
    expect(result).toHaveLength(1);
    expect(result[0].filename).toBe('test.ts');
    expect(result[0].content).toBe('console.log("hello");\n');
  });

  it('should parse multiple snippets', () => {
    const input = `\`\`\`typescript:first.ts
const a = 1;
\`\`\`
\`\`\`typescript:second.ts
const b = 2;
\`\`\``;

    const result = parseChatOutput(input);
    expect(result).toHaveLength(2);
    expect(result[0].filename).toBe('first.ts');
    expect(result[0].content).toBe('const a = 1;\n');
    expect(result[1].filename).toBe('second.ts');
    expect(result[1].content).toBe('const b = 2;\n');
  });

  it('should handle empty input', () => {
    const result = parseChatOutput('');
    expect(result).toHaveLength(0);
  });

  it('should handle input with no valid snippets', () => {
    const input = 'some random text\nwithout file markers';
    const result = parseChatOutput(input);
    expect(result).toHaveLength(0);
  });

  it('should handle incomplete snippets', () => {
    const input = `\`\`\`typescript:test.ts
some content`;
    const result = parseChatOutput(input);
    expect(result).toHaveLength(0);
  });

  it('should preserve multiline content', () => {
    const input = `\`\`\`typescript:test.ts
line 1
line 2
line 3
\`\`\``;

    const result = parseChatOutput(input);
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe('line 1\nline 2\nline 3\n');
  });
});
