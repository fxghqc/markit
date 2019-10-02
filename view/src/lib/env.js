/* eslint-disable */
let env;

if (process.env.NODE_ENV !== 'production') {
  env = process.env;
} else {
  env = (typeof global !== 'undefined' ? global : window).process.env;
}

export default env;
