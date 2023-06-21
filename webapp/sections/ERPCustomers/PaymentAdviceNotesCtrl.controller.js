sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.ERPCustomers.PaymentAdviceNotesCtrl", {
        onInit: function() {
			if (!this.ReasonCodeConversion) {
                this.ReasonCodeConversion = new sap.ui.xmlfragment("iffco.managecustomer.fragments.ReasonCodeConversion", this);
                this.getView().addDependent(this.ReasonCodeConversion);
            }
			if (!this.SelectionRule) {
                this.SelectionRule = new sap.ui.xmlfragment("iffco.managecustomer.fragments.SelectionRule", this);
                this.getView().addDependent(this.SelectionRule);
            }
        },
		
		//Value Help for Selection Rule
		handleValueHelpForSelectionRule: function (evt) {
            this.SelectionRuleField = evt.getSource();
            this.SelectionRule.getBinding("items").filter([]);
            this.SelectionRule.open();
        },
        handleValueHelpSelectnRuleSearch: function (evt) {
            var sValue = evt.getParameter("value");
                var filters = [];
                if (sValue.length > 0) {
                    var filter1 = new sap.ui.model.Filter({
                        path: "Selectionrule",
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
                    this.SelectionRule.getBinding("items").filter(filters, false);
                } else {
                    this.SelectionRule.getBinding("items").filter([]);
                }
        },
        handleValueHelpSelectnRuleConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.SelectionRuleField.setValue(title + " - " + desc);
            this.SelectionRule.getBinding("items").filter([]);
            this.SelectionRule.close();
        },
        handleValueHelpSelectnRuleClose: function (evt) {
            this.SelectionRule.close();
        },

		//Value Help for Reason Code Conversion
		handleValueHelpForReasonCodeConversion: function (evt) {
            this.ReasonCodeConversionField = evt.getSource();
            this.ReasonCodeConversion.getBinding("items").filter([]);
            this.ReasonCodeConversion.open();
        },
        handleValueHelpReasnCodConvSearch: function (evt) {
            var sValue = evt.getParameter("value");
                var filters = [];
                if (sValue.length > 0) {
                    var filter1 = new sap.ui.model.Filter({
                        path: "Reasoncode",
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
                    this.ReasonCodeConversion.getBinding("items").filter(filters, false);
                } else {
                    this.ReasonCodeConversion.getBinding("items").filter([]);
                }
        },
        handleValueHelpReasnCodConvConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.ReasonCodeConversionField.setValue(title + " - " + desc);
            this.ReasonCodeConversion.getBinding("items").filter([]);
            this.ReasonCodeConversion.close();
        },
        handleValueHelpReasnCodConvClose: function (evt) {
            this.ReasonCodeConversion.close();
        }

	});
});