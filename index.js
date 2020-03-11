#!/usr/bin/env node

'use strict';

const getopts = require('getopts');
const chalk = require('chalk');
const prompts = require('prompts');
const ora = require('ora');
const execa = require('execa');

const options = getopts(process.argv.slice(2), {
	alias: {
		help: 'h',
		version: 'v'
	}
});

if (options.help) {
	console.log(`
	Usage: 
	  $ create-parsify-app
  `);
	process.exit(0);
}

if (options.version) {
	console.log(require('./package.json').version);
	process.exit(0);
}

(async () => {
	let repoUrl;

	const response = await prompts({
		type: 'select',
		name: 'boilerplate',
		message: 'Select plugin boilerplate:',
		choices: [
			{title: 'TypeScript', value: 'ts'},
			{title: 'JavaScript', value: 'js'}
		],
		initial: 0
	});

	if (response.boilerplate === 'ts') {
		repoUrl = 'https://github.com/parsify-dev/plugin-boilerplate-typescript';
	} else {
		repoUrl = 'https://github.com/parsify-dev/plugin-boilerplate-javascript';
	}

	const spinner = ora('Cloning repository...').start();

	try {
		await execa('git', ['clone', repoUrl]);
		spinner.succeed('Done!');
		console.log(`
Next steps:

1. Enter the plugin directory
${chalk.cyan(`$ cd ${response.boilerplate === 'ts' ? 'plugin-boilerplate-typescript' : 'plugin-boilerplate-javascript'}`)}

2. Install dependencies
${chalk.cyan('$ npm install')} ${chalk.dim('# you can also use yarn etc.')}

3. Enjoy!
		`);
	} catch (error) {
		spinner.fail('Something went wrong! Check the output below:\n');
		console.log(error.stderr);
	}
})();

