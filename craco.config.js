const less        = require("craco-less");
const tailwindcss = require("tailwindcss");

module.exports = {
	plugins : [
		{
			plugin  : less,
			options : {
				lessLoaderOptions : {
					lessOptions : {
						javascriptEnabled : true
					}
				}
			}
		}
	],
	style: {
		postcss: {
			mode: "extends" /* (default value) */ || "file",
			plugins: [
				tailwindcss("./tailwind.config.js")
			]
		}
	}
};