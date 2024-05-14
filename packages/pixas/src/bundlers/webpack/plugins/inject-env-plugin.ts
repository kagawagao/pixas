import { Compiler } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'node:path';
import { getRuntimeGlobalVarsContent } from '../../../configs/global';

export default class InjectEnvPlugin {
  private name = 'InjectEnvPlugin';
  private static FILE_NAME = 'config.js';

  apply(compiler: Compiler) {
    const { webpack } = compiler;
    const { RawSource } = webpack.sources;
    compiler.hooks.thisCompilation.tap(this.name, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: this.name,
        },
        async () => {
          const content = await getRuntimeGlobalVarsContent();

          compilation.emitAsset(InjectEnvPlugin.FILE_NAME, new RawSource(content));
        },
      );

      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(this.name, (htmlPluginData) => {
        let publicPath = compilation.outputOptions.publicPath;
        if (publicPath === 'auto') {
          publicPath = '';
        } else if (typeof publicPath === 'function') {
          publicPath = publicPath({ filename: InjectEnvPlugin.FILE_NAME });
        }
        htmlPluginData.assetTags.scripts.unshift({
          tagName: 'script',
          attributes: {
            src: path.join(publicPath!, InjectEnvPlugin.FILE_NAME),
          },
          voidTag: false,
          meta: {
            plugin: this.name,
          },
        });
        return htmlPluginData;
      });
    });
  }
}
