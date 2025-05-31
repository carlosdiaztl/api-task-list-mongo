const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/src/test/**/*.test.ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  maxWorkers: 1,
  modulePathIgnorePatterns: ["<rootDir>/create-module-script/"],
  coveragePathIgnorePatterns: ["/node_modules/", "/src/test/"],
};
