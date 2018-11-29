const {injectBabelPlugin} = require('react-app-rewired');
const rewireless = require('react-app-rewire-less');

module.exports = function override(config, env) {
    config = injectBabelPlugin(
        ['import', {libraryName: 'antd', libraryDirectory: 'es', style: true}],
        config,
    );

    config = rewireless.withLoaderOptions({
        modifyVars: {'@primary-color': '#1890ff'},
        javascriptEnabled: true,
    })(config, env);

    return config;
};
