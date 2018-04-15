import * as fs from 'fs';
import * as path from 'path';

import { Args } from './arguments';

export type Config = {
  baseDir: string; // relative to config file
  jestConfig: string; // relative to baseDir (path)
  sourceFiles: string; // relative to baseDir (glob path)
  ignore: string[]; // relative to baseDir (glob paths)
  dirs: {
    currentDir: string; // absolute
    configDir: string; // absolute
  };
  faultFileExt: string; // [a-zA-Z-_]+
  testFileExt: string; // [a-zA-Z-_]+
  sourceFileToTestFileFn: (sourcePath: string, config: Config) => string; // absolute, relative, glob
  sourceFileToFaultSourceFileFn: (sourcePath: string, config: Config) => string; // absolute, relative, glob
  testFileToFaultTestFileFn: (sourcePath: string, config: Config) => string; // absolute, relative, glob
};

export function getConfig(args: Args, currentDir: string): Config {
  currentDir = currentDir.replace(/\/?$/, '/');
  const configPath = currentDir + args.config;
  const configDir = path.normalize(path.dirname(configPath) + '/');
  const config: Config = require(configPath);

  config.dirs = { currentDir, configDir };
  config.faultFileExt = 'bugshot-fault';
  config.testFileExt = 'test';

  config.sourceFileToTestFileFn = (sourcePath: string, config: Config) =>
    sourcePath.replace(/\.([a-zA-Z_-]+)$/, `.${config.testFileExt}.$1`);

  config.sourceFileToFaultSourceFileFn = (sourcePath: string, config: Config) =>
    sourcePath.replace(/\.([a-zA-Z_-]+)$/, `.${config.faultFileExt}.$1`);

  config.testFileToFaultTestFileFn = (testPath: string, config: Config) => {
    const regex = new RegExp(`\.(${config.testFileExt})\.([a-zA-Z_-]+)$`);
    return testPath.replace(regex, `.${config.faultFileExt}.$1.$2`);
  };

  return config;
}
