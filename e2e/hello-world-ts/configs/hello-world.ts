import { config, from } from 'codygen';

export default config({
  prompt: from(import.meta.dirname)
    .from('../specs')
    .read(['functionality.md', 'runtime.md']),
  output: 'dist',
});
