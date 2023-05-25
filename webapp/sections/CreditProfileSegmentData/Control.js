sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var HourConf = BlockBase.extend("iffco.managecustomer.sections.CreditProfileSegmentData.Control", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "iffco.managecustomer.sections.CreditProfileSegmentData.Control",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "iffco.managecustomer.sections.CreditProfileSegmentData.Control",
					type: ViewType.XML
				}
			}
		}
	});
	return HourConf;
});
