sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var HourConf = BlockBase.extend("iffco.managecustomer.sections.ERPCustomers.InterestCalculation", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "iffco.managecustomer.sections.ERPCustomers.InterestCalculation",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "iffco.managecustomer.sections.ERPCustomers.InterestCalculation",
					type: ViewType.XML
				}
			}
		}
	});
	return HourConf;
});
