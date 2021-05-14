const browserify = require('browserify')
const fs = require('fs')
const tinyReloadServer = require('tiny-lr')()

tinyReloadServer.listen(35729)

const emitChangedFile = file => {
	tinyReloadServer.changed({
		body: { files: [ file ] },
	})
}

const main = () => {
	const b = browserify({
		cache: {},
		packageCache: {},
		entries: [ './client/client.js' ],
		fullPaths: true,
		debug: true,
	})
		.transform('stringify')
		.plugin('watchify')
		.plugin('errorify')

	b.on('update', () => {
		console.log('Rebuilding bundle', new Date())

		const bundle = b.bundle().on('error', console.error)

		writeBundle(bundle)
	})

	console.log('Start initial bundling')
	const bundle = b.bundle().on('error', console.error)

	writeBundle(bundle)
}

const writeBundle = bundle => {
	const writeToDiskStream = fs.createWriteStream('static/js/build.js')
	bundle.pipe(writeToDiskStream)

	writeToDiskStream.on('finish', () => {
		console.log('New bundle written to disk')
		emitChangedFile('static/js/build.js')
	})
}

main()