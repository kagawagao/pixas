declare module 'postcss-preset-env' {
  import type { Plugin } from 'postcss';

  interface PostCSSPresetEnvOptions {
    stage?: number | false;
    features?: Record<string, boolean | Record<string, unknown>>;
    browsers?: string | string[];
    env?: string;
    debug?: boolean;
    enableClientSidePolyfills?: boolean;
    logical?: { inlineDirection?: string; blockDirection?: string };
  }

  function postcssPresetEnv(options?: PostCSSPresetEnvOptions): Plugin;

  export default postcssPresetEnv;
}
