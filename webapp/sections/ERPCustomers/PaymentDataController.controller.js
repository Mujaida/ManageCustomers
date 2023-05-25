sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.ERPCustomers.PaymentDataController", {
        /**
         * @override
         */
        onInit: function() {
            if (!this.paymentTerms) {
                this.paymentTerms = new sap.ui.xmlfragment("iffco.managecustomer.fragments.PaymentTerms", this);
                this.getView().addDependent(this.paymentTerms);
            }
            if (!this.KnwnNegtdLv) {
                this.KnwnNegtdLv = new sap.ui.xmlfragment("iffco.managecustomer.fragments.knowNegotiatedLv", this);
                this.getView().addDependent(this.KnwnNegtdLv);
            }
            // if (!this.ARPledgeIndc) {
            //     this.ARPledgeIndc = new sap.ui.xmlfragment("iffco.managecustomer.fragments.ARPledgingIndc.fragment", this);
            //     this.getView().addDependent(this.ARPledgeIndc);
            // }
        },
        handleValueHelpForPaymentTerms:function (evt) {
            this.paymentTermsField = evt.getSource();
                this.paymentTerms.getBinding("items").filter([]);
                this.paymentTerms.open();
        },
        handleValueHelpPaymentTermsConfirm:function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
                // var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.paymentTermsField.setValue(title);
        },
        handleValueHelpPaymentTermsClose: function (params) {
            this.paymentTermsField._dialog.close();
        },

        //Value Help for AR Pledging Indicator
        handleValueHelpForARPledgeIndc: function(evt){
            this.ARPledgeIndcField = evt.getSource();
            this.ARPledgeIndc.getBinding("items").filter([]);
            this.ARPledgeIndc.open();
        },
        handleValueHelpARPledgingIndcSearch: function(evt){
            var sValue = evt.getParameter("value");
            if (sValue.length > 0) {
                if (sValue.length == 2) {
                    var oFilter1 = new sap.ui.model.Filter("Arpledgeindicator", 'EQ', sValue);
                    this.ARPledgeIndc.getBinding("items").filter([oFilter1]);
                } else {
                    var oFilter2 = new sap.ui.model.Filter("Description", 'EQ', sValue);
                    this.ARPledgeIndc.getBinding("items").filter([oFilter2]);
                }
            } else {
                this.ARPledgeIndc.getBinding("items").filter([]);
            }
        },
        handleValueHelpARPledgingIndcConfirm: function(evt){
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.ARPledgeIndcField.setValue(title + " - " + desc);
            this.ARPledgeIndc.getBinding("items").filter([]);
            this.ARPledgeIndc.close(); 
        },
        handleValueHelpARPledgingIndcClose: function(evt){
            this.ARPledgeIndc.close(); 
        },

        //Value Help for Know Negotiated Leave
        handleValueHelpForKnowNegotiatedLeave: function(evt){
            this.KnwnNegtdLvField = evt.getSource();
            this.KnwnNegtdLv.getBinding("items").filter([]);
            this.KnwnNegtdLv.open();
        },
        handleValueHelpKnwnNegotdLvSearch: function(evt){
            var sValue = evt.getParameter("value");
            if (sValue.length > 0) {
                if (sValue.length == 2) {
                    var oFilter1 = new sap.ui.model.Filter("KnownNegotiatedLeave", 'EQ', sValue);
                    this.KnwnNegtdLv.getBinding("items").filter([oFilter1]);
                } else {
                    var oFilter2 = new sap.ui.model.Filter("Description", 'EQ', sValue);
                    this.KnwnNegtdLv.getBinding("items").filter([oFilter2]);
                }
            } else {
                this.KnwnNegtdLv.getBinding("items").filter([]);
            }
        },
        handleValueHelpKnwnNegotdLvConfirm: function(evt){
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.KnwnNegtdLvField.setValue(title + " - " + desc);
            this.KnwnNegtdLv.getBinding("items").filter([]);
            this.KnwnNegtdLv.close();  
        },
        handleValueHelpKnwnNegotdLvClose: function(evt){
            this.KnwnNegtdLv.close();
        }
	});
});