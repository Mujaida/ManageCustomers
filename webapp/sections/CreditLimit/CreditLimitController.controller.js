sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.CreditLimit.CreditLimitController", {
        handleCreditLimitTypeSelect:function (evt) {
            // this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel([]), "creditTypeModel");
            this.getView().getModel("appView").setProperty("/selectedType",evt.getParameters().selectedIndex);

            // this.getOwner
            // evt.mParameters.selectedIndex
            // console.log("h2");
        }
	});
});