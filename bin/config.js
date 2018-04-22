"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function getConfig(args, currentDir) {
    currentDir = currentDir.replace(/\/?$/, '/');
    const configPath = currentDir + args.config;
    const configDir = path.normalize(path.dirname(configPath) + '/');
    const config = require(configPath);
    if (!config.baseDir) {
        throw new Error('Bugshot: config.baseDir is required.');
    }
    config.baseDir = config.baseDir.replace(/\/?$/, '/');
    if (!config.jestConfig) {
        throw new Error('Bugshot: config.jestConfig is required.');
    }
    if (!config.sourceFiles) {
        throw new Error('Bugshot: config.sourceFiles is required.');
    }
    config.dirs = { currentDir, configDir };
    config.faultFileExt = 'bugshot-fault';
    config.testFileExt = 'test';
    config.sourceFileToTestFileFn = (sourcePath, config) => sourcePath.replace(/\.([a-zA-Z_-]+)$/, `.${config.testFileExt}.$1`);
    config.sourceFileToFaultSourceFileFn = (sourcePath, config) => sourcePath.replace(/\.([a-zA-Z_-]+)$/, `.${config.faultFileExt}.$1`);
    config.testFileToFaultTestFileFn = (testPath, config) => {
        const regex = new RegExp(`\.(${config.testFileExt})\.([a-zA-Z_-]+)$`);
        return testPath.replace(regex, `.${config.faultFileExt}.$1.$2`);
    };
    return config;
}
exports.getConfig = getConfig;
