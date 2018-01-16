const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	// webpack 打包的一种模式
	devtool: 'inline-source-map',
	// fs.readdirSync(__dirname) === 得到一个当前文件目录下的所有文件名称 的数组对象。
	// dirname === 当前模块的文件夹名称
	entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
		// entries ===》
		// 当前的 要处理的这个文件目录
		const fullDir = path.join(__dirname, dir)
		// 入口文件
		const entry = path.join(fullDir, 'index.js')
		// fs.statSync(fullDir).isDirectory() ===> 检测是否存在当前这个目录
		// fs.existsSync(entry) ===> 检测是否存在当前要处理的这个文件
		if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
			entries[dir] = ['webpack-hot-middleware/client?0.0.0.0:8085', entry]
			// entries[dir] = entry
		}
		// console.log(entries)
		/*
		* {
		*   aaa: [
		*     'webpack-hot-middleware/client',
			    'F:\\asher\\zepto-examples\\aaa\\index.js'
			   ],
		    bbb: [
		      'webpack-hot-middleware/client',
		      'F:\\asher\\zepto-examples\\bbb\\index.js'
		     ]
		   }
     */
		/*
		* {
		*   aaa: 'F:\\asher\\zepto-examples\\aaa\\index.js',
        bbb: 'F:\\asher\\zepto-examples\\bbb\\index.js'
       }
		* */
		return entries
	}, {}),

	// 出口文件
	output: {
		path: path.join(__dirname, 'dist'),
		// 文件的名称
		filename: '[name].js',
		// 服务端 静态资源路径
		publicPath: '/dist/'
	},

	// 处理不同文件类型的模块
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					'babel-loader'
				]
			},
			{
				test: /\.(css|less)$/,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			},
			{
				test: /\.(jpg|png|gif|svg)$/,
				use: [
					'url-loader',
					'file-loader'
				]
			}
		]
	},
	resolve: {
		alias: {
			Public: path.resolve(__dirname, 'public')
		}
	},
	// 插件，用于增强 webpack 的额外功能
	plugins: [
		// 用于将公共的 类库 提取出来
		new webpack.optimize.CommonsChunkPlugin({
			name: 'shared',
			filename: 'shared.js'
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new UglifyJSPlugin({
			sourceMap: true
		}),
		new webpack.ProvidePlugin({
			$: 'zepto-webpack'
		})
	]
}
