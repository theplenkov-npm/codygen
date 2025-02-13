import { config } from 'codygen';

const { API, RUNTIME } = process.env;

export default config({
  prompt: `Create a Sample ${API} app using ${RUNTIME}`,
  output: `dist/${API}-${RUNTIME}`,
});
