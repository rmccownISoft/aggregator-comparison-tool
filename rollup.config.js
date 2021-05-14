import { string } from "rollup-plugin-string"
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

module.exports = {
	input: './client/client.js',
	output: {
		file: 'static/js/build.js',
		format: 'cjs',
	},
	plugins: [
		string({
			include: "**/*.html",
		}),
		babel({
			plugins: [ [ "@babel/plugin-proposal-class-properties", { loose: true }] ],
		}),
		commonjs(),
		resolve({
			mainFields: [ 'browser', 'module', 'main' ],
		}),
	],
}
