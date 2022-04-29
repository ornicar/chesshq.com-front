import React from "react";
import packageJson from "../../package.json";

const current_version = String(packageJson.version);

// version from response - first param, local version second param
const semverGreaterThan = (versionA: string, versionB: string) => {
  const versionsA = versionA.split(/\./g);
  const versionsB = versionB.split(/\./g);

	while (versionsA.length || versionsB.length) {
		const a = Number(versionsA.shift());
		const b = Number(versionsB.shift());

		if (a === b) {
			continue;
		}

		// eslint-disable-next-line no-restricted-globals
		return (a > b || isNaN(b));
	}

	return false;
}

class CacheBuster extends React.Component {
	refreshCacheAndReload() {
		return;

		const promises: Promise<boolean>[] = [];

		if (caches) {
			// Service worker cache should be cleared with caches.delete()
			caches.keys().then(function(names) {
				for (const name of names) {
					promises.push(caches.delete(name));
				}
			});
		}

		// delete browser cache and hard reload
		Promise.all(promises).then(() => window.location.reload());
	}

	componentDidMount() {
		fetch("/meta.json")
			.then((response) => response.json())
			.then((meta) => {
				const latest  = meta.version;
				const current = current_version;
				const refresh = semverGreaterThan(latest, current);

				if (refresh) {
					this.refreshCacheAndReload();
				}
			});
	}

	render() {
		return null;
	}
}

export default CacheBuster;