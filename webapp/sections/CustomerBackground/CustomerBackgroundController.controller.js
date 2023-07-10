sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.CustomerBackground.CustomerBackgroundController", {
        /**
         * @override
         */
        onInit: function() {
        
            if (!this.Currency) {
                this.Currency = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Currency", this);
                this.getView().addDependent(this.Currency);
            }
        
        },
        onConfirm:function (evt) {
            // var oFormData = new FormData();
            this.getView().getModel("appView").setProperty("/dmsFile", new FormData());
            // var oFileUploader = evt.getSource();
            var id=evt.getSource().getId().split("Collapsed--")[1];
            // var oFile = oFileUploader.getFocusDomRef().files[0];
            var oFile = evt.getParameter("files")[0];
            var fileName = evt.getParameters().files[0].name;
            var dmsData = this.getView().getModel("dmsModel").getData();
            this.getView().getModel("appView").getProperty("/dmsFile").append("file", oFile);
            dmsData.push({
                file:this.getView().getModel("appView").getProperty("/dmsFile"),
                fileName: id+"_"+fileName
            });
            this.getView().getModel("dmsModel").updateBindings(true);
            this.firstTime=false;
        },
        handleValueHelpForCurrency: function (evt) {
            this.currencyField = evt.getSource();
            this.Currency.getBinding("items").filter([]);
            this.Currency.open();
        },
        handleValueHelpCurrencyClose: function (params) {
            this.Currency._dialog.close();
        },
        handleValueHelpCurrencyConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.currencyField.setValue(title + " - " + desc);
            this.Currency.getBinding("items").filter([]);
            this.Currency.close();
        },
        handleValueHelpCurrencySearch: function (evt) {
            var sValue = evt.getParameter("value");
            var filters = [];
            if (sValue.length > 0) {
                var filter1 = new sap.ui.model.Filter({
                    path: "Waers",
                    operator: "Contains",
                    value1: sValue
                });
                var filter2 = new sap.ui.model.Filter({
                    path: "ltext",
                    operator: "Contains",
                    value1: sValue
                });
                var sFilters = [filter1, filter2];
                filters.push(new sap.ui.model.Filter(sFilters, false));
                this.Currency.getBinding("items").filter(filters, false);
            } else {
                this.Currency.getBinding("items").filter([]);
            }
        }
	});
});