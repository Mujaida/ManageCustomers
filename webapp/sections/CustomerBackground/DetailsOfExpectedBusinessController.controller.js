sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "iffco/managecustomer/formatter/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        Controller,
         formatter
         ) {
        "use strict";

        return Controller.extend("iffco.managecustomer.sections.CustomerBackground.DetailsOfExpectedBusinessController", {
            formatter: formatter,
            /**
             * @override
             */
            onInit: function() {
                // Controller.prototype.onInit.apply(this, arguments);
                
                if (!this.Incoterms) {
                    this.Incoterms = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Incoterms", this);
                    this.getView().addDependent(this.Incoterms);
                    this.Incoterms.setModel(this.getOwnerComponent().getModel());
                }
                if (!this.Currency) {
                    this.Currency = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Currency", this);
                    this.getView().addDependent(this.Currency);
                }
            
            },
            handleSetMaxLength:function (evt) {
                var val = evt.getSource().getValue().length;
                var maxLen = evt.getSource().getMaxLength();
                if(val >= maxLen){
                    evt.getSource().setType("Text");
                }else{
                    evt.getSource().setType("Number");
                }
            },
            handleValueHelpForIncoterms:function (evt) {
                this.IncotermsField = evt.getSource();
                this.Incoterms.getBinding("items").filter([]);
                this.Incoterms.open();
            },
            handleValueHelpIncotermsConfirm:function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                this.IncotermsField.setValue(title);
               
            },
            handleValueHelpIncotermsClose:function (evt) {
                this.Incoterms._dialog.close();
            },
            handleValueHelpIncotermsSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                        var oFilter1 = new sap.ui.model.Filter("Inco1", 'EQ', sValue);
                        this.Incoterms.getBinding("items").filter([oFilter1]);
                
                } else {
                    this.Incoterms.getBinding("items").filter([]);
                }
            },
            //Value Help for currency
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