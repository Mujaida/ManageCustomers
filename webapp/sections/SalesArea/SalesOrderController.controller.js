sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("iffco.managecustomer.sections.SalesArea.SalesOrderController", {
            /**
             * @override
             */
            onInit: function() {
                // Controller.prototype.onInit.apply(this, arguments);
                if (!this.Currency) {
                    this.Currency = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Currency", this);
                    this.getView().addDependent(this.Currency);
                }
                if (!this.Authorization) {
                    this.Authorization = new sap.ui.xmlfragment("iffco.managecustomer.fragments.AuthorizationGrp", this);
                    this.getView().addDependent(this.Authorization);
                }
                if (!this.salesDist) {
                    this.salesDist = new sap.ui.xmlfragment("iffco.managecustomer.fragments.salesDistrict", this);
                    this.getView().addDependent(this.salesDist);
                }
                if (!this.customerGrp) {
                    this.customerGrp = new sap.ui.xmlfragment("iffco.managecustomer.fragments.CustGroup", this);
                    this.getView().addDependent(this.customerGrp);
                    this.customerGrp.setModel(this.getOwnerComponent().getModel("S4D"));
                }
                if (!this.unitOfMsrGrp) {
                    this.unitOfMsrGrp = new sap.ui.xmlfragment("iffco.managecustomer.fragments.UnitOfMeasureGrp", this);
                    this.getView().addDependent(this.unitOfMsrGrp);
                    this.unitOfMsrGrp.setModel(this.getOwnerComponent().getModel("S4D"));
                }
            
            },
            //Value Help for Customer Group
            handleValueHelpForCusGrp: function (evt) {
                this.c1Field = evt.getSource();
                this.customerGrp.getBinding("items").filter([]);
                this.customerGrp.open();
            },
            handleValueHelpcusGrpConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.c1Field.setValue(title + " - " + desc);
                this.customerGrp.getBinding("items").filter([]);
                this.customerGrp.close();
            },
            handleValueHelpcusGrp1Close: function (evt) {
                this.customerGrp.close();
            },

            //Value Help for Currency
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
            
                this.currencyField.setValue(title);
            },
            handleValueHelpCurrencySearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                        var oFilter1 = new sap.ui.model.Filter("Waers", 'EQ', sValue);
                        this.Currency.getBinding("items").filter([oFilter1]);
                
                } else {
                    this.Country.getBinding("items").filter([]);
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

            //Value Help for Authorization
            handleValueHelpForAuthorization: function (evt) {
                this.authorField = evt.getSource();
                this.Authorization.getBinding("items").filter([]);
                this.Authorization.open();
            },
            handleValueHelpAuthurClose: function (params) {
                this.Authorization.close();
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
            handleValueHelpAuthurConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.authorField.setValue(title + " - " + desc);
                this.Authorization.getBinding("items").filter([]);
                this.Authorization.close();
            },

            //Value Help for Sales District
            handleValueHelpForsalesDist: function (evt) {
                this.salesDistField = evt.getSource();
                this.salesDist.getBinding("items").filter([]);
                this.salesDist.open();
            },
            handleValueHelpSalesDistConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.salesDistField.setValue(title + " - " + desc);
                this.salesDist.getBinding("items").filter([]);
                this.salesDist.close();
            },
            handleValueHelpSalesDistSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("District", 'EQ', sValue);
                        this.salesDist.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Discription", 'EQ', sValue);
                        this.salesDist.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    this.salesDist.getBinding("items").filter([]);
                }
            },
            handleValueHelpSalesDistClose: function (params) {
                this.salesDist.close();
            },

            //Value Help for Unit Of Measure Group
            handleValueHelpForUntOfMeasrGrp: function (evt) {
                this.unitOfMsrGrpField = evt.getSource();
                this.unitOfMsrGrp.getBinding("items").filter([]);
                this.unitOfMsrGrp.open();
            },
            handleValueHelpUntMsrGrpConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.unitOfMsrGrpField.setValue(title + " - " + desc);
                this.unitOfMsrGrp.getBinding("items").filter([]);
                this.unitOfMsrGrp.close();
            },
            handleValueHelpUntMsrGrpSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("UnitMeasureGroup", 'EQ', sValue);
                        this.unitOfMsrGrp.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Discription", 'EQ', sValue);
                        this.unitOfMsrGrp.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    this.unitOfMsrGrp.getBinding("items").filter([]);
                }
            },
            handleValueHelpUntMsrGrpClose: function (params) {
                this.unitOfMsrGrp.close();
            }
	});

});