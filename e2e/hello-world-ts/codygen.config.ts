import { CodygenConfig } from 'codygen';

export default CodygenConfig.define({
  prompt: 'Create an app according to the given specs in a context',
  output: 'dist',
  context: ['specs/functionality.md', 'specs/runtime.md'],
});
