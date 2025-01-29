import fs from 'fs';
import path from 'path';

// eslint-disable-next-line import/no-relative-parent-imports
import base from '../vercel.json';

type Redirect = {
  env: string;
  source: string;
  destination: string;
};

const HOSTS = {
  STG: 'https://entry.tmnf1.form.tmnf-stg.joinsure.jp',
  PROD: 'https://entry.tmnf1.form.tmnf.joinsure.jp',
};

// 今日の日付(JST)を取得
const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0];

const fileName = `redirects-${today}.json`;
const filePath = path.join(__dirname, './redirects', fileName);

if (!fs.existsSync(filePath)) {
  console.log(`File not found: ${filePath}`);
  process.exit(0);
}

const redirects = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Redirect[];

base.redirects = Object.entries(redirects).reduce((acc, [_, redirect]) => {
  const host = HOSTS[redirect.env as 'STG' | 'PROD'] || HOSTS.STG;
  acc.push({
    source: redirect.source,
    has: [{ type: 'host', value: host }],
    destination: redirect.destination,
    permanent: false,
  });
  return acc;
}, base.redirects);

fs.writeFileSync(path.resolve(__dirname, '..', 'vercel.json'), `${JSON.stringify(base, null, 2)}\n`);
