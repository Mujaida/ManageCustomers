sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.ERPCustomers.InterestCalculationController", {
        onInit: function() {
            // Controller.prototype.onInit.apply(this, arguments);
            if (!this.InterestIndicator) {
                this.InterestIndicator = new sap.ui.xmlfragment("iffco.managecustomer.fragments.InterestIndicator", this);
                this.getView().addDependent(this.InterestIndicator);
            }
        },

        //Value Help for Interest Indicator
        handleValueHelpInterestIndicator: function (evt) {
            this.InterestIndicatorField = evt.getSource();
            this.InterestIndicator.getBinding("items").filter([]);
            this.InterestIndicator.open();
        },
        handleValueHelpIntrstIndcSearch: function (evt) {
            var sValue = evt.getParameter("value");
                var filters = [];
                if (sValue.length > 0) {
                    var filter1 = new sap.ui.model.Filter({
                        path: "Interestindicator",
                        operator: "Contains",
                        value1: sValue
                    });
                    var filter2 = new sap.ui.model.Filter({
                        path: "Description",
                        operator: "Contains",
                        value1: sValue
                    });
                    var sFilters = [filter1, filter2];
                    filters.push(new sap.ui.model.Filter(sFilters, false));
                    this.InterestIndicator.getBinding("items").filter(filters, false);
                } else {
                    this.InterestIndicator.getBinding("items").filter([]);
                }
        },
        handleValueHelpIntrstIndcConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.InterestIndicatorField.setValue(title + " - " + desc);
            this.InterestIndicator.getBinding("items").filter([]);
            this.InterestIndicator.close();
        },
        handleValueHelpIntrstIndcClose: function (evt) {
            this.InterestIndicator.close();
        },
        handleSetMaxLength:function (evt) {
            var val = evt.getSource().getValue().length;
            var maxLen = evt.getSource().getMaxLength();
            if(val >= maxLen){
                evt.getSource().setType("Text");
            }else{
                evt.getSource().setType("Number");
            }
        }


	});
});