import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

import EN_REPERTOIRES from "./assets/locales/repertoires/en.json";
import EN_COMMON from "./assets/locales/common/en.json";

import JA_REPERTOIRES from "./assets/locales/repertoires/ja.json";
import JA_COMMON from "./assets/locales/common/ja.json";

const ALLOWED_LOCALES: Array<string> = [
	"en",
	"ja"
];

let saved_locale = localStorage.getItem("locale") ?? "en";

if (!ALLOWED_LOCALES.includes(saved_locale)) {
	saved_locale = "en";
}

i18n
	.use(resourcesToBackend((language, namespace, callback) => {
		import("./assets/locales/" + namespace + "/" + language + ".json")
			.then((resources) => {
				callback(null, resources);
			})
			.catch((error) => {
				callback(error, null);
			})
	}))
	.use(initReactI18next)
	.init({
		react: {
			useSuspense: false
		},
		fallbackLng   : "en",
		lng           : saved_locale,
		ns            : ["common", "premium", "repertoires", "errors"],
		interpolation : {
			escapeValue : false,
			format      : function(value, format) {
				if (format === "lowercase") {
					value = (value ?? "").toLowerCase();
				}
				
				if (format === "number") {
					value = (!isNaN(value)) ? new Intl.NumberFormat().format(value) : value;
				}

				return value;
			}
		}
	});

if (saved_locale === "en") {
	i18n.addResourceBundle("en", "repertoires", EN_REPERTOIRES);
	i18n.addResourceBundle("en", "common", EN_COMMON);
}

if (saved_locale === "ja") {
	i18n.addResourceBundle("ja", "repertoires", JA_REPERTOIRES);
	i18n.addResourceBundle("ja", "common", JA_COMMON);
}

export default i18n;