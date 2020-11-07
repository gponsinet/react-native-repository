const { withUnimodules } = require('@expo/webpack-config/addons');

module.exports = function(env, argv) {

  // Add Expo support...
  const configWithExpo = withUnimodules(env.config, {
		projectRoot: __dirname + '/..',
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        // Ensure that all packages starting with @evanbacon are transpiled.
				// '@evanbacon',
      ],
    },
  }, argv);

  return configWithExpo;
};
