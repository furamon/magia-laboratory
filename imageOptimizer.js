/* Thanks!
 * https://zenn.dev/tam_tam/articles/640ec8eb75fac6
 */

const sharp = require('sharp')
const chokidar = require('chokidar')

const directoryPath = 'public/images/**'

const convertToWebP = (filePath) => {
	const outputFilePath = filePath.replace(/\.(png|jpg|jpeg)$/, '.webp')

	sharp(filePath)
		.toFormat('webp')
		.toFile(outputFilePath, (err) => {
			if (err) {
				console.error('Error converting image:', err)
			} else {
				console.log(`Converted ${filePath} to WebP`)
			}
		})
}

const watcher = chokidar.watch(directoryPath, { ignored: /^\./, persistent: true })

watcher
	.on('add', (filePath) => {
		if (/\.(png|jpg|jpeg)$/.test(filePath)) {
			convertToWebP(filePath)
		}
	})
	.on('error', (error) => console.error(`Watcher error: ${error}`))
