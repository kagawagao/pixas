let isReactExist = false;
let isVueExist = false;

try {
  require('react');
  isReactExist = true;
} catch (error) {}

try {
  require('vue');
  isVueExist = true;
} catch (error) {}

export const isReact = isReactExist;
export const isVue = isVueExist;
