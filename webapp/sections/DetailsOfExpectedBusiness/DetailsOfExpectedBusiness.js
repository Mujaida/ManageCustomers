sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var HourConf = BlockBase.extend("iffco.managecustomer.sections.DetailsOfExpectedBusiness.DetailsOfExpectedBusiness", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "iffco.managecustomer.sections.DetailsOfExpectedBusiness.DetailsOfExpectedBusiness",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "iffco.managecustomer.sections.DetailsOfExpectedBusiness.DetailsOfExpectedBusiness",
					type: ViewType.XML
				}
			}
		}
	});
	return HourConf;
});
