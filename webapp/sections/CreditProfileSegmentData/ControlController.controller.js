sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("iffco.managecustomer.sections.CreditProfileSegmentData.ControlController", {
            /**
             * @override
             */
            onInit: function() {
                // Controller.prototype.onInit.apply(this, arguments);
                if (!this.blockReason) {
                    this.blockReason = new sap.ui.xmlfragment("iffco.managecustomer.fragments.BlockedReason", this);
                    this.getView().addDependent(this.blockReason);
                    this.blockReason.setModel(this.getOwnerComponent().getModel());
                }
            
            },
            handleCreditSegmentValue:function (evt) {
                this.getView().byId("cs").setValue()
            },
            handleValueHelpForBlockReason: function (evt) {
                this.blockReasonField = evt.getSource();
                this.blockReason.getBinding("items").filter([]);
                    this.blockReason.open();
            },
            handleValueHelpBlockReasonClose: function (params) {
                this.blockReason._dialog.close();
            },
            handleValueHelpBlockReasonConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.blockReasonField.setValue(title + " - " + desc);
            },
            blockedCM: function(evt){
                this.getView().getModel("appView").setProperty("/blockedCmValue", this.getView().byId("blockedCm").getValue()); 
            },
            handleValueHelpBlockedReasonSearch:function (evt) {
                var sValue = evt.getParameter("value");
                var filters = [];
                if (sValue.length > 0) {
                    var filter1 = new sap.ui.model.Filter({
                        path: "Blockreason",
                        operator: "Contains",
                        value1: sValue
                    });
                    var filter2 = new sap.ui.model.Filter({
                        path: "Blockreasontxt",
                        operator: "Contains",
                        value1: sValue
                    });
                    var sFilters = [filter1, filter2];
                    filters.push(new sap.ui.model.Filter(sFilters, false));
                    this.blockReason.getBinding("items").filter(filters, false);
                } else {
                    this.blockReason.getBinding("items").filter([]);
                }
            },
            
	});

});