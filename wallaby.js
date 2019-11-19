module.exports = function (wallaby) {
  return {
    name: 'Heke',
    files: [
      'index.mjs'
    ],
    tests: [
      'test.js'
    ],
    env: {
      type: 'node',
      params: {
        runner: `-r ${require.resolve('esm')}`
      }
    },
    preprocessors: {'**/*.mjs': file => file.changeExt('js').content}, // needs to think the files are js files to load in properly
    delays: {
      run: 1000
    },
    testFramework: 'mocha'
  }
}
