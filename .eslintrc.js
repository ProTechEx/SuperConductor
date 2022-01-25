const {
	tsExtends,
	commonRules,
	tsRules,
	tsParser,
} = require('./node_modules/@sofie-automation/code-standard-preset/eslint/fragments') // eslint-disable-line node/no-unpublished-require

module.exports = {
	extends: './node_modules/@sofie-automation/code-standard-preset/eslint/main',
	env: {
		node: true,
	},
	ignorePatterns: ['**/dist/**/*'],
	rules: {
		'no-console': 'off',
		'node/no-unpublished-import': [
			'error',
			{
				allowModules: ['electron'],
			},
		],
		'node/no-unpublished-require': [
			'error',
			{
				allowModules: ['html-webpack-plugin'],
			},
		],
		'node/no-extraneous-import': [
			'error',
			{
				allowModules: ['casparcg-connection', 'timeline-state-resolver-types'],
			},
		],
		'@typescript-eslint/no-namespace': 'off',
	},
	settings: {
		jest: {
			version: 'latest',
		},
		react: {
			version: 'detect',
		},
	},
	overrides: [
		// Note: these replace the values defined above, so make sure to extend them if they are needed
		{
			files: ['*.tsx'],
			extends: [...tsExtends, 'plugin:react/recommended'],
			parserOptions: {
				...tsParser.parserOptions,
				ecmaFeatures: {
					jsx: true, // Allows for the parsing of JSX
				},
			},
			rules: {
				...commonRules,
				...tsRules,
				// "node/no-extraneous-import": "off", // because there are a lot of them as dev-dependencies
				'node/no-missing-import': 'off', // erroring on every single import
				// "react/prop-types": "off", // we don't use this
				// "@typescript-eslint/no-empty-interface": "off", // many prop/state types are {}
				'@typescript-eslint/promise-function-async': 'off', // event handlers can't be async
			},
		},
	],
}