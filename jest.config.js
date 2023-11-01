module.exports = {
  rootDir: "./",
  testRegex: "src/.*(test|spec)\\.(js)$",
  modulePaths: ["<rootDir>"],
  moduleDirectories: ["node_modules", "src", "test"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^test/(.*)$": "<rootDir>/test/$1",
  },
};
