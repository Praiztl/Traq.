(function () {
	function DarkMode(options = {}) {
		// Define defaults
		const darkMode = {
			default: options.default || "system", // system | dark | light
			selector: options.selector || ".darkmode", // Toggle selector class or id
			storageKey: options.storageKey || "theme", // Set a localStorage key name
			resetStorage: options.resetStorage || false, // Reset localStorage
			dynamicAdjust: options.dynamicAdjust || false, // Will override default start light then switch to dark between time. 24 hour time.
			dynamicAdjustStartHour: options.dynamicAdjustStartHour || 18, // Start dark theme at hour 18
			dynamicAdjustEndHour: options.dynamicAdjustEndHour || 6 // End dark them at hour 6
		};

		const rootElement = document.documentElement;
		let defaultThemeMode = darkMode.default;
		const localStorageKey = darkMode.storageKey;
		dynamicAdjustTheme(darkMode.dynamicAdjust);

		const theme = localStorage.getItem(localStorageKey) || defaultThemeMode;
		rootElement.setAttribute("theme", theme);

		function saveUserPreference(userPreference) {
			localStorage.setItem(localStorageKey, userPreference);
		}

		// Dynamic adjust theme based on time
		function dynamicAdjustTheme(option) {
			if (option) {
				const currentHour = new Date().getHours();
				// Check if the current hour is between 18 and 6
				defaultThemeMode =
					currentHour >= darkMode.dynamicAdjustStartHour ||
					currentHour < darkMode.dynamicAdjustEndHour
						? "dark"
						: "light";
			}
		}
		// Reset localStorage
		function resetStorage(option) {
			if (option) {
				localStorage.removeItem(localStorageKey);
			}
		}

		function getThemeMode(userPreference) {
			if (userPreference === "light") {
				return "light";
			}
			if (userPreference === "dark") {
				return "dark";
			}
			if (matchMedia("(prefers-color-scheme: light)").matches) {
				return "light";
			} else if (matchMedia("(prefers-color-scheme: dark)").matches) {
				return "dark";
			}
		}

		function setThemeMode(mode) {
			rootElement.setAttribute("theme-mode", mode);
		}

		function setTheme(mode) {
			rootElement.setAttribute("theme", mode);
		}

		function rotatePreferences(userPreference) {
			const nextPreference = {
				system: "light",
				light: "dark",
				dark: "light"
			};
			return nextPreference[userPreference] || "system";
		}

		function nameSelection(userPreference) {
			const preferences = {
				system: "System",
				light: "Light",
				dark: "Dark"
			};
			return preferences[userPreference] || preferences.system;
		}

		let userPreference = theme;
		const systemThemeMode = getThemeMode("system");
		if (userPreference === "system") {
			userPreference = systemThemeMode;
		}
		setThemeMode(getThemeMode(userPreference));

		// Toggle dark/light mode
		document.addEventListener("DOMContentLoaded", () => {
			const themeToggler = document.querySelectorAll(darkMode.selector);
			resetStorage(options.resetStorage || false);

			themeToggler.forEach((button) => {
				button.classList.add(
					"darkmode-" + nameSelection(userPreference).toLowerCase()
				);

				button.onclick = () => {
					let newUserPref = rotatePreferences(userPreference);
					if (userPreference === "system") {
						newUserPref = getThemeMode("system");
					}

					// Remove the class associated with the current userPreference
					themeToggler.forEach((btn) => {
						btn.classList.remove(
							"darkmode-" + nameSelection(userPreference).toLowerCase()
						);
					});

					// Add the class for the new userPreference to all buttons
					themeToggler.forEach((btn) => {
						btn.classList.add("darkmode-" + nameSelection(newUserPref).toLowerCase());
					});

					userPreference = newUserPref;
					saveUserPreference(newUserPref);
					setThemeMode(getThemeMode(newUserPref));
					setTheme(newUserPref);
				};
			});
		});
	}
	window.DarkMode = DarkMode;
})();

/* Initialize Darkmode - All options shown */
const darkMode = new DarkMode({
	default: "system",
	selector: ".darkmode",
	storageKey: "theme",
	resetStorage: false,
	dynamicAdjust: false,
	dynamicAdjustStartHour: 18,
	dynamicAdjustEndHour: 6
});


