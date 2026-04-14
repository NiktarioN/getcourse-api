import 'dotenv/config';
import GetCourse from '../../src/main.ts';

const { GC_DOMAIN, GC_DEV_KEY, GC_API_KEY } = process.env;

if (!GC_DOMAIN || !GC_DEV_KEY || !GC_API_KEY) {
  throw new Error('Необходимо задать GC_DOMAIN, GC_DEV_KEY, GC_API_KEY в .env');
}

const gc = new GetCourse({
  domain: GC_DOMAIN,
  devKey: GC_DEV_KEY,
  apiKey: GC_API_KEY,
  logLevel: 'debug',
});

export default gc;
