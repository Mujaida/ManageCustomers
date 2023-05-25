sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var HourConf = BlockBase.extend("iffco.managecustomer.sections.ERPCustomers.PaymentNoticeTo", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "iffco.managecustomer.sections.ERPCustomers.PaymentNoticeTo",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "iffco.managecustomer.sections.ERPCustomers.PaymentNoticeTo",
					type: ViewType.XML
				}
			}
		}
	});
	return HourConf;
});
