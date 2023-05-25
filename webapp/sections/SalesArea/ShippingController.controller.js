sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.SalesArea.ShippingController", {
        /**
         * @override
         */
        onInit: function() {
            //Controller.prototype.onInit.apply(this, arguments);
            if (!this.DelvryPriorty) {
                this.DelvryPriorty = new sap.ui.xmlfragment("iffco.managecustomer.fragments.delvryPriorty", this);
                this.getView().addDependent(this.DelvryPriorty);
                this.DelvryPriorty.setModel(this.getOwnerComponent().getModel("S4D"));
            }
            if (!this.ShippingCondn) {
                this.ShippingCondn = new sap.ui.xmlfragment("iffco.managecustomer.fragments.ShippingCondn", this);
                this.getView().addDependent(this.ShippingCondn);
                this.ShippingCondn.setModel(this.getOwnerComponent().getModel("S4D"));
            }
        
        },
          //Value Help for Delivery Priority
          handleValueHelpForDelvPrior:function(evt){
            this.delvField = evt.getSource();
            this.DelvryPriorty.getBinding("items").filter([]);
            this.DelvryPriorty.open();
        },
        handleValueHelpDelvPriorConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.delvField.setValue(title + " - " + desc);
        },
        handleValueHelpDelvPriorSearch: function (evt) {
            var sValue = evt.getParameter("value");
            if (sValue.length > 0) {
                if (sValue.length == 2) {
                    var oFilter1 = new sap.ui.model.Filter("Deliverypriority", 'EQ', sValue);
                    this.DelvryPriorty.getBinding("items").filter([oFilter1]);
                } else {
                    var oFilter2 = new sap.ui.model.Filter("Bezei", 'EQ', sValue);
                    this.DelvryPriorty.getBinding("items").filter([oFilter2]);
                }
            } else {
                this.DelvryPriorty.getBinding("items").filter([]);
            }
        },
        handleValueHelpDelvPriorClose:function(evt){
            this.DelvryPriorty.close();
        },

         //Value Help for Shipping Condition
         handleValueHelpForShippingCondn: function (evt) {
            this.ShpngCndn = evt.getSource();
            this.ShippingCondn.getBinding("items").filter([]);
            this.ShippingCondn.open();
        },
        handleValueHelpShippingCondnConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.ShpngCndn.setValue(title + " - " + desc);
            this.ShippingCondn.getBinding("items").filter([]);
            this.ShippingCondn.close();
        },
        handleValueHelpShippingCondnSearch: function (evt) {
            var sValue = evt.getParameter("value");
            if (sValue.length > 0) {
                if (sValue.length == 2) {
                    var oFilter1 = new sap.ui.model.Filter("Shipping", 'EQ', sValue);
                    this.ShippingCondn.getBinding("items").filter([oFilter1]);
                } else {
                    var oFilter2 = new sap.ui.model.Filter("Description", 'EQ', sValue);
                    this.ShippingCondn.getBinding("items").filter([oFilter2]);
                }
            } else {
                this.ShippingCondn.getBinding("items").filter([]);
            }
        },
        handleValueHelpShippingCondnClose: function (evt) {
            this.ShippingCondn.close();
        },

         //Max length property
         handleSetMaxLength:function (evt) {
            var val = evt.getSource().getValue().length;
            var maxLen = evt.getSource().getMaxLength();
            if(val >= maxLen){
                evt.getSource().setType("Text");
            }else{
                evt.getSource().setType("Number");
            }
        },
	});
});