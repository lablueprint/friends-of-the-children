import path from 'path';
import { fileURLToPath } from 'url';
// import findConfig from 'find-config';
import dotEnv from 'dotenv';

import mailchimp from '@mailchimp/mailchimp_marketing';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// dotEnv.config({ path: findConfig('.env') });
dotEnv.config();

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export default mailchimp;
