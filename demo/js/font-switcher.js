angular.module('theme-switch', [])

	.provider('fontswitcher', function() {
		"use strict";

		var _storeFont = false, _fontstyles = [], _fontselected = { fontlabel: '', href: [''] }, _fontwatchers = [];

		this.setFontstyles = function (fontstyles) {
			_fontstyles = fontstyles;

			angular.forEach(_fontstyles, function(fontstyle)
			{
				if (fontstyle.href === undefined || fontstyle.href === null) fontstyle.href = [];
				if (!Array.isArray(fontstyle.href)) fontstyle.href = [fontstyle.href];
			});
		};

		var getFontstyles = this.getFontstyles = function () {
			return angular.copy(_fontstyles)
		}

		this.storeFont = function (boolean) {
			if (typeof  boolean !== 'boolean') { return }
			_storeFont = boolean;
		};

		this.getStoredFont = function() {
			if (!_storeFont || !localStorage) { return; }
			return localStorage.getItem('selectedFontTheme');
		};

		var addFontWatcher = function (fontwatcher) {
			_fontwatchers.push(fontwatcher);
		};

		var getSelectedFont = this.getSelectedFont = function () {
			return angular.copy(_fontselected);
		};

		var setSelectedFont = this.setSelectedFont = function (fontkey) {
			angular.forEach(_fontstyles, function (fontstyle) {
				if (fontstyle.fontkey === fontkey) {
					_fontselected = fontstyle;
					angular.forEach(_fontwatchers, function (fontwatcher) {
						fontwatcher(getSelectedFont());
					});
				}
			});
		};

		this.$get = [function () {
			return {
				storeFont: _storeFont,
				getSelectedFont: getSelectedFont,
				setSelectedFont: setSelectedFont,
				addFontWatcher: addFontWatcher,
				getFontstyles: getFontstyles
			};
		}];

	})

	.directive('fontLink', function() {
		"use strict";

		return {
			restrict: 'A',
			template:  '<link rel="stylesheet" ng-repeat="fontstyle in fontselected" ng-href="{{ fontstyle }}" />',
			replace: true,
			scope: true,
			controller: ['$scope', 'fontswitcher', function ($scope, fontswitcher) {
				$scope.fontselected = fontswitcher.getSelectedFont().href;

				fontswitcher.addFontWatcher(function (fontstyle) {
					$scope.fontselected = fontstyle.href;
				});
			}]
		};

	})

	.directive('fontSwitcher', function () {
		"use strict";

		return {
			restrict: 'A',
			template: '<select ng-model="fonttheme.fontselected" ng-options="fontstyle.fontkey as fontstyle.fontlabel for fontstyle in fonttheme.fontstyles" class="form-control"></select>',
			replace: true,
			scope: false,
			controller: ['$scope', 'fontswitcher', function ($scope, fontswitcher) {
				$scope.fonttheme = {
					fontstyles: fontswitcher.getFontstyles(),
					fontselected: fontswitcher.getSelectedFont().fontkey
				};

				$scope.$watch('fonttheme.fontselected', function () {
					if (!$scope.fonttheme.fontselected) { return; }
					fontswitcher.setSelectedFont($scope.fonttheme.fontselected);

					if (fontswitcher.storeFont && localStorage) {
						localStorage.setItem('selectedFontTheme', $scope.fonttheme.fontselected);
					}
				});
			}]
		};
	}).provider('theme', function() {
		"use strict";

		var _storeTheme = false, _styles = [], _selected = { label: '', href: [''] }, _watchers = [];

		this.setStyles = function (styles) {
			_styles = styles;

			angular.forEach(_styles, function(style)
			{
				if (style.href === undefined || style.href === null) style.href = [];
				if (!Array.isArray(style.href)) style.href = [style.href];
			});
		};

		var getStyles = this.getStyles = function () {
			return angular.copy(_styles)
		}

		this.storeTheme = function (boolean) {
			if (typeof  boolean !== 'boolean') { return }
			_storeTheme = boolean;
		};

		this.getStoredTheme = function() {
			if (!_storeTheme || !localStorage) { return; }
			return localStorage.getItem('selectedTheme');
		};

		var addWatcher = function (watcher) {
			_watchers.push(watcher);
		};

		var getSelected = this.getSelected = function () {
			return angular.copy(_selected);
		};

		var setSelected = this.setSelected = function (key) {
			angular.forEach(_styles, function (style) {
				if (style.key === key) {
					_selected = style;
					angular.forEach(_watchers, function (watcher) {
						watcher(getSelected());
					});
				}
			});
		};

		this.$get = [function () {
			return {
				storeTheme: _storeTheme,
				getSelected: getSelected,
				setSelected: setSelected,
				addWatcher: addWatcher,
				getStyles: getStyles
			};
		}];

	})

	.directive('themeLink', function() {
		"use strict";

		return {
			restrict: 'A',
			template:  '<link rel="stylesheet" ng-repeat="style in selected" ng-href="{{ style }}" />',
			replace: true,
			scope: true,
			controller: ['$scope', 'theme', function ($scope, theme) {
				$scope.selected = theme.getSelected().href;

				theme.addWatcher(function (style) {
					$scope.selected = style.href;
				});
			}]
		};

	})

	.directive('themeSwitcher', function () {
		"use strict";

		return {
			restrict: 'A',
			template: '<select ng-model="theme.selected" ng-options="style.key as style.label for style in theme.styles" class="form-control"></select>',
			replace: true,
			scope: false,
			controller: ['$scope', 'theme', function ($scope, theme) {
				$scope.theme = {
					styles: theme.getStyles(),
					selected: theme.getSelected().key
				};

				$scope.$watch('theme.selected', function () {
					if (!$scope.theme.selected) { return; }
					theme.setSelected($scope.theme.selected);

					if (theme.storeTheme && localStorage) {
						localStorage.setItem('selectedTheme', $scope.theme.selected);
					}
				});
			}]
		};
	})
;

