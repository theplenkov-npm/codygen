import { CodygenConfig } from 'codygen';

const { API, RUNTIME } = process.env;

export default CodygenConfig.define({
  prompt: `Create a Sample ${API} app using ${RUNTIME}`,
  output: `dist/${API}-${RUNTIME}`,
});
