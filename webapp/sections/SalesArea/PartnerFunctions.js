sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var HourConf = BlockBase.extend("iffco.managecustomer.sections.SalesArea.PartnerFunctions", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "iffco.managecustomer.sections.SalesArea.PartnerFunctions",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "iffco.managecustomer.sections.SalesArea.PartnerFunctions",
					type: ViewType.XML
				}
			}
		}
	});
	return HourConf;
});
