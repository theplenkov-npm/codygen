// cody output parser

export interface Snippet {
  filename: string;
  content: string;
}

const snippetStartRegex = /^```[a-zA-Z]*:(.*)$/;
const snippetEndRegex = /^```$/;

export function parseChatOutput(input: string): Array<Snippet> {
  const snippets: Snippet[] = [];

  let currentFile: Snippet | undefined;

  for (const line of input.split('\n')) {
    if (!currentFile && snippetStartRegex.test(line)) {
      const match = line.match(snippetStartRegex);
      if (match?.[1]) {
        currentFile = {
          filename: match[1],
          content: '',
        };
      }
    }

    if (currentFile && snippetEndRegex.test(line)) {
      snippets.push(currentFile);
      currentFile = undefined;
    }

    if (currentFile && !snippetStartRegex.test(line)) {
      currentFile.content += line + '\n';
    }
  }

  return snippets;
}
