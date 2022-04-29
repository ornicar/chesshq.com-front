module.exports = {
	plugins : [
		require("postcss-import"),
		require("tailwindcss/nesting"),
		require("tailwindcss")("./tailwind.config.js"),
		require("autoprefixer")
	]
};