// @ts-check

/**
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*': 'prettier --ignore-unknown --write',
  '*.{{c,m,}js,ts}': [
    (files) => {
      const result = ['eslint . --max-warnings=0'];

      if (files.some((element) => element.endsWith('.ts'))) {
        result.push('tsc -p tsconfig.app.json');
      }

      if (files.some((element) => /\.(m|c)?js$/.test(element))) {
        result.push('tsc -p tsconfig.mjs.json');
      }

      return result;
    },
  ],
};
