import pkg from '../configs/pkg';

const { dependencies } = pkg;

function getFramework(): 'react' | 'vue' | 'unknown' {
  if (typeof dependencies.react === 'string') {
    return 'react';
  } else if (typeof dependencies.vue === 'string') {
    return 'vue';
  } else {
    return 'unknown';
  }
}

const framework = getFramework();

const isReact = framework === 'react';

const isVue = framework === 'vue';

export { framework, getFramework, isReact, isVue };
