module.exports = {
    verbose: true,
    collectCoverage: false,
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!<rootDir>/src/test-utils/enzymeSetup"
    ],
    coveragePathIgnorePatterns: [
        "<rootDir>/node_modules"
    ],
    coverageDirectory: 'coverage',
    setupFiles:[
      'raf/polyfill',
      '<rootDir>/src/test-utils/enzymeSetup'
    ],
    coverageReporters: [
        "lcov", "text", "cobertura"
    ],
    "reporters": [
        "default", "jest-junit"
    ],
    transform: {
        "^.+\\.(js|jsx)$": "<rootDir>/node_modules/babel-jest"
    },
    "transformIgnorePatterns": [ "node_modules/(?!react-design-system|experience-extension)"],
    testPathIgnorePatterns: [
      "/node_modules/",
      "/src/test-utils/enzymeSetup"
    ],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|scss)$": "identity-obj-proxy"
    },
    moduleFileExtensions: [
      "js",
      "jsx"
    ]
};
