sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var HourConf = BlockBase.extend("iffco.managecustomer.sections.CustomerBasicDetails.CommunicationData", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "iffco.managecustomer.sections.CustomerBasicDetails.CommunicationData",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "iffco.managecustomer.sections.CustomerBasicDetails.CommunicationData",
					type: ViewType.XML
				}
			}
		}
	});
	return HourConf;
});
