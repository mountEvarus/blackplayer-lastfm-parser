import { parseArgs } from 'util';

import { parseStatisticsFromFile } from './play-statistics';

const start = async () => {
  const args = parseArgs({
    allowPositionals: true,
    args: Bun.argv,
    options: {
      inputRoot: {
        short: 'i',
        type: 'string',
      },
      outputRoot: {
        short: 'o',
        type: 'string',
      },
      path: {
        short: 'p',
        type: 'string',
      },
    },
    strict: true,
  }).values;

  if ([args.inputRoot, args.outputRoot, args.path].some(v => !v)) {
    throw new Error('Invalid arguments - please see documentation on how to use this app.');
  }

  await parseStatisticsFromFile(args.path as string, {
    inputRoot: args.inputRoot as string,
    outputRoot: args.outputRoot as string,
  });
};

void start();
