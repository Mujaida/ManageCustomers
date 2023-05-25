sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("iffco.managecustomer.sections.SalesArea.DPTController", {
            /**
             * @override
             */
            onInit: function() {
                // Controller.prototype.onInit.apply(this, arguments);
                if (!this.CCA) {
                    this.CCA = new sap.ui.xmlfragment("iffco.managecustomer.fragments.CreditControl", this);
                    this.getView().addDependent(this.creditSegment);
                    this.CCA.setModel(this.getOwnerComponent().getModel());
                }
                if (!this.Incoterms) {
                    this.Incoterms = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Incoterms", this);
                    this.getView().addDependent(this.Incoterms);
                    this.Incoterms.setModel(this.getOwnerComponent().getModel());
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
            
            handleValueHelpForCreditControl: function (evt) {
                this.CCAField = evt.getSource();
                if(this.getView().getModel("appView").getProperty("/distributionChannel")){
                this.CCA.getBinding("items").filter([new sap.ui.model.Filter("distribution_channel", "EQ", this.getView().getModel("appView").getProperty("/distributionChannel"))]);
                this.CCA.open();
                }else{
                    MessageBox.error("Please select Distribution channel first");
                }
            },
            handleValueHelpCCAClose: function (params) {
                this.CCA._dialog.close();
            },
            handleValueHelpCCAConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.CCAField.setValue(title + " - " + desc);
                this.getView().getModel("appView").setProperty("/cca", title);
            },
            // handleValueHelpCreditSegmentSearch: function (evt) {
            //     var sValue = evt.getParameter("value");
            //     if (sValue.length > 0) {
            //         if (sValue.length == 2) {
            //             var oFilter1 = new sap.ui.model.Filter("Land1", 'EQ', sValue);
            //             this.creditSegment.getBinding("items").filter([oFilter1]);
            //         } else {
            //             var oFilter2 = new sap.ui.model.Filter("Landx", 'EQ', sValue);
            //             this.creditSegment.getBinding("items").filter([oFilter2]);
            //         }
            //         // this.Country.getBinding("items").filter([oFilter2]);
            //     } else {
            //         this.creditSegment.getBinding("items").filter([]);
            //     }
            // },
	});

});