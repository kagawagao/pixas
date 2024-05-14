import pkg from '../configs/pkg';
import semver from 'semver';

const { dependencies } = pkg;

function getFramework() {
  if (typeof dependencies.react === 'string') {
    return 'react';
  } else if (typeof dependencies.vue === 'string') {
    if (semver.minVersion(dependencies.vue)?.major === 2) {
      return 'vue2';
    }
    return 'vue';
  } else {
    return 'unknown';
  }
}

const framework = getFramework();

const isReact = framework === 'react';

const isVue = framework === 'vue';

const isVue2 = framework === 'vue2';

export { getFramework, framework, isReact, isVue, isVue2 };
