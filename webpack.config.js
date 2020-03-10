const path = require('path');
module.exports = {
	target: 'electron-renderer',
	entry: {
		index: './app/js/view/index.js'
	},
	output: {
		filename: 'index.bundle.js',
		path: path.resolve(__dirname, 'app/dist')
	},
	resolve: {
		alias: { 'vue': 'vue/dist/vue.js' }
	},
	optimization: {
		splitChunks: {
			name: 'common',
			chunks: 'all'
		}
	}
};