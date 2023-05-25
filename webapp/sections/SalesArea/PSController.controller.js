sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.SalesArea.PSController", {
        /**
         * @override
         */
        onInit: function() {
            // Controller.prototype.onInit.apply(this, arguments);
            if (!this.PriceGroup) {
                this.PriceGroup = new sap.ui.xmlfragment("iffco.managecustomer.fragments.priceGroup", this);
                this.getView().addDependent(this.PriceGroup);
                this.PriceGroup.setModel(this.getOwnerComponent().getModel());
            }
            if (!this.PriceList) {
                this.PriceList = new sap.ui.xmlfragment("iffco.managecustomer.fragments.priceList", this);
                this.getView().addDependent(this.PriceList);
                this.PriceList.setModel(this.getOwnerComponent().getModel());
            }
            if (!this.PPDetermination) {
                this.PPDetermination = new sap.ui.xmlfragment("iffco.managecustomer.fragments.PpDetermination", this);
                this.getView().addDependent(this.PPDetermination);
                this.PPDetermination.setModel(this.getOwnerComponent().getModel());
            }
            
        
        },
        //value Help for Sales Area - Price Group
            handleValueHelpForPriceGrp: function (evt) {
                this.PriceGroupField = evt.getSource();
                this.PriceGroup.getBinding("items").filter([]);
                this.PriceGroup.open();
            },
            handleValueHelpPriceGrpConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.PriceGroupField.setValue(title + " - " + desc);
                // this.busyDialog.close();
            },
            handleValueHelpPriceGrpSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("Pricegroup", 'EQ', sValue);
                        this.PriceGroup.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Description", 'EQ', sValue);
                        this.PriceGroup.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    this.PriceGroup.getBinding("items").filter([]);
                }
            },
            handleValueHelpPriceGrpClose: function (params) {
                this.PriceGroup.close();
            },

             //value Help for Sales Area - Price List
            handleValueHelpForPriceList: function (evt) {
                this.PriceListField = evt.getSource();
                this.PriceList.getBinding("items").filter([]);
                this.PriceList.open();
            },
            handleValueHelpPriceListConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.PriceListField.setValue(title + " - " + desc);
                // this.busyDialog.close();
            },
            handleValueHelpPriceListSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("Pltyp", 'EQ', sValue);
                        this.PriceList.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Ptext", 'EQ', sValue);
                        this.PriceList.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    this.PriceList.getBinding("items").filter([]);
                }
            },
            handleValueHelpPriceListClose: function (params) {
                this.PriceList.close();
            },

            //value Help for PP Determination
            handleValueHelpForPPDetermination: function (evt) {
                this.PpDetrmntn = evt.getSource();
                this.PPDetermination.getBinding("items").filter([]);
                this.PPDetermination.open();
            },
            handleValueHelpPPDetrmntnConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.PpDetrmntn.setValue(title + " - " + desc);
                // this.busyDialog.close();
            },
            handleValueHelpPPDetrmntnSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 1) {
                        var oFilter1 = new sap.ui.model.Filter("PpDetermination", 'EQ', sValue);
                        this.PPDetermination.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Description", 'EQ', sValue);
                        this.PPDetermination.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    this.PPDetermination.getBinding("items").filter([]);
                }
            },
            handleValueHelpPPDetrmntnClose: function (params) {
                this.PPDetermination.close();
            }

	});
});