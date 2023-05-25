sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("iffco.managecustomer.sections.CustomerBasicDetails.SiteDetailsController", {
            /**
             * @override
             */
            onInit: function() {
                // Controller.prototype.onInit.apply(this, arguments);
                if (!this.legalName) {
                    this.legalName = new sap.ui.xmlfragment("iffco.managecustomer.fragments.LegalName", this);
                    this.getView().addDependent(this.legalName);
                }
                if (!this.Authorization) {
                    this.Authorization = new sap.ui.xmlfragment("iffco.managecustomer.fragments.AuthorizationGrp", this);
                    this.getView().addDependent(this.Authorization);
                }
            
            },
            handleValueHelpForLegalName: function (evt) {
                this.legalNameField = evt.getSource();
                this.legalName.getBinding("items").filter([]);
                this.legalName.open();
            },
            handleValueHelpLegalNameClose: function (params) {
                this.legalName._dialog.close();
            },
            handleValueHelpLegalNameConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                
                this.legalNameField.setValue(title);
            },
            handleValueHelpLegalNameSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                        var oFilter1 = new sap.ui.model.Filter("Name1", 'EQ', sValue);
                        this.legalName.getBinding("items").filter([oFilter1]);
                }else{
                    this.legalName.getBinding("items").filter([]);
                }
            },

             //Value Help for Authorization
             handleValueHelpForAuthorization: function (evt) {
                this.authorField = evt.getSource();
                this.Authorization.getBinding("items").filter([]);
                this.Authorization.open();
            },
            handleValueHelpAuthrSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("Authori", 'EQ', sValue);
                        this.Authorization.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Description", 'EQ', sValue);
                        this.Authorization.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    this.Authorization.getBinding("items").filter([]);
                }
            },
            handleValueHelpAuthurClose: function (params) {
                this.Authorization.close();
            },
            handleValueHelpAuthurConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.authorField.setValue(title + " - " + desc);
                this.Authorization.getBinding("items").filter([]);
                this.Authorization.close();
            }
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