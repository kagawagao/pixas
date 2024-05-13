import { isReact, isVue } from './env';

const eslintExtends = [];

if (isReact) {
  eslintExtends.push('./react');
} else if (isVue) {
  eslintExtends.push('./vue');
} else {
  eslintExtends.push('./typescript');
}

module.exports = {
  extends: eslintExtends,
};
