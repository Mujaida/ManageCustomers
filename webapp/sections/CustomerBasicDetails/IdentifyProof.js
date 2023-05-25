sap.ui.define(["sap/ui/core/library", 'sap/uxap/BlockBase'], function (coreLibrary, BlockBase) {
	"use strict";

	var ViewType = coreLibrary.mvc.ViewType;

	var HourConf = BlockBase.extend("iffco.managecustomer.sections.CustomerBasicDetails.IdentifyProof", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "iffco.managecustomer.sections.CustomerBasicDetails.IdentifyProof",
					type: ViewType.XML
				},
				Expanded: {
					viewName: "iffco.managecustomer.sections.CustomerBasicDetails.IdentifyProof",
					type: ViewType.XML
				}
			}
		}
	});
	return HourConf;
});
