import { parseArgs } from 'util';

import { parseStatisticsFromFile } from './play-statistics';

const start = async () => {
  const args = parseArgs({
    allowPositionals: true,
    args: Bun.argv,
    options: {
      path: {
        short: 'p',
        type: 'string',
      },
    },
    strict: true,
  }).values;

  if (!args.path) {
    throw new Error('Invalid arguments - please see documentation on how to use this app.');
  }

  await parseStatisticsFromFile(args.path);
};

void start();
