export default {
  require: ['ts-node/register/transpile-only'],
  files: ['./test/**/*.test.ts'],
  compileEnhancements: false,
  extensions: ['ts'],
  failFast: false,
  verbose: true,
  cache: false
}
