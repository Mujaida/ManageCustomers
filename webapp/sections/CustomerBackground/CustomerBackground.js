sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var HourConf = BlockBase.extend("iffco.managecustomer.sections.CustomerBackground.CustomerBackground", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "iffco.managecustomer.sections.CustomerBackground.CustomerBackground",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "iffco.managecustomer.sections.CustomerBackground.CustomerBackground",
					type: ViewType.XML
				}
			}
		}
	});
	return HourConf;
});
