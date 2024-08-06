let isReactExist = false;
let isVueExist = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react');
  isReactExist = true;
} catch (error) {}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('vue');
  isVueExist = true;
} catch (error) {}

export const isReact = isReactExist;
export const isVue = isVueExist;
