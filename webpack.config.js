const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const paths = require("@expo/config/paths");

function resolvePath(sourcePath, currentFile, otherparams) {
  // add logic to resolve your source path to a new file
  // https://github.com/tleunen/babel-plugin-module-resolver

  // this can be used to solve different kind of problems
  // 1 - the specific library do not have an implementation for web, so you need to mock the file
  // 2 - the specific import is relative and you need to solve using the path API from nodeJS

	if (sourcePath.match(/Utilities\/Platform$/)) {
		console.log(sourcePath, currentFile, otherparams)
	}

	// undefined will not change the source path
  return undefined;
}

module.exports = async function(env, argv) {
	const config = await createExpoWebpackConfigAsync(env, argv)

	config.resolve.alias = {
		...config.resolve.alias,
		'@ant-design/react-native': 'antd-mobile',
	}

  // Maybe you want to turn off compression in dev mode.
  if (config.mode === "development") {
    config.devServer.compress = false;
  }

  // Or prevent minimizing the bundle when you build.
  if (config.mode === "production") {
    config.optimization.minimize = false;
  }

	// FIXME: ../../Utilities/Platform not found for react-native-web
  config.module.rules = [
		...config.module.rules,
		// {
    //   test: /\.(js|mjs|jsx|ts|tsx)$/,
    //   include: paths.getPossibleProjectRoot(),
    //   loader: require.resolve("babel-loader"),
    //   options: {
    //     plugins: [
    //       [
    //         "module-resolver",
    //         {
		// 					root: ["./src"],
    //           resolvePath(sourcePath, currentFile, ...otherparams /* opts */) {
    //             return resolvePath(sourcePath, currentFile, otherparams);
    //           },
    //           loglevel: "verbose",
    //         },
    //       ],
    //     ],
		// 	},
    // },
  ];

	return config
}
