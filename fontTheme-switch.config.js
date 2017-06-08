angular.module('switchApp', ['theme-switch'])

	.config(['fontswitcherProvider', 'themeProvider', function (fontswitcherProvider, themeProvider) {
		var fontstyles = [
			{ fontkey: 'SMALL', fontlabel: 'Small font', href: 'css/small.css'},
			{ fontkey: 'LARGE', fontlabel: 'Large font', href: ['css/large.css']}
		];
		
		fontswitcherProvider.storeFont(true);
		fontswitcherProvider.setFontstyles(fontstyles);

		var fontselected = fontswitcherProvider.getStoredFont() || fontstyles[0].fontkey;
		fontswitcherProvider.setSelectedFont(fontselected);
		
		var styles = [
			{ key: 'DEFAULT', label: 'Default Theme', href: 'css/default.css'},
			{ key: 'LIGHT', label: 'Light Theme', href: ['css/light.css']}
		];
		
		themeProvider.storeTheme(true);
		themeProvider.setStyles(styles);

		var selected = themeProvider.getStoredTheme() || styles[0].key;
		themeProvider.setSelected(selected);
	}]);