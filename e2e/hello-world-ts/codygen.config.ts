import { config } from 'codygen';

export default config({
  prompt: 'Create an app according to the given specs in a context',
  output: 'dist',
  context: ['specs/functionality.md', 'specs/runtime.md'],
});
