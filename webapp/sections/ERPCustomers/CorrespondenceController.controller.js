sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.ERPCustomers.CorrespondenceController", {
        onInit: function() {

                if (!this.AccountingClerk) {
                        this.AccountingClerk = new sap.ui.xmlfragment("iffco.managecustomer.fragments.AccoutingClerk", this);
                        this.getView().addDependent(this.AccountingClerk);
                }
                if (!this.AccountStatement) {
                        this.AccountStatement = new sap.ui.xmlfragment("iffco.managecustomer.fragments.AccountStatement", this);
                        this.getView().addDependent(this.AccountStatement);
                }
        },
        
        //Value Help for Accounting Clerk
        handleValueHelpForAccountingClerk: function (evt) {
                this.AccountingClerkField = evt.getSource();
                this.AccountingClerk.getBinding("items").filter([]);
                this.AccountingClerk.open();
            },
            handleValueHelpAcctClerkSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("Accountingclerk", 'EQ', sValue);
                        this.AccountingClerk.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Description", 'EQ', sValue);
                        this.AccountingClerk.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    this.AccountingClerk.getBinding("items").filter([]);
                }
            },
            handleValueHelpAcctClerkConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.AccountingClerkField.setValue(title + " - " + desc);
                this.AccountingClerk.getBinding("items").filter([]);
                this.AccountingClerk.close();
            },
            handleValueHelpAcctClerkClose: function (evt) {
                this.AccountingClerk.close();
            },

        //Value Help for Accounting Statement
        handleValueHelpForAccountStatement: function (evt) {
                this.AcctStatemntField = evt.getSource();
                this.AccountStatement.getBinding("items").filter([]);
                this.AccountStatement.open();
            },
            handleValueHelpAcctStatemntSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("Accountstatements", 'EQ', sValue);
                        this.AccountStatement.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Description", 'EQ', sValue);
                        this.AccountStatement.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    this.AccountStatement.getBinding("items").filter([]);
                }
            },
            handleValueHelpAcctStatemntConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.AcctStatemntField.setValue(title + " - " + desc);
                this.AccountStatement.getBinding("items").filter([]);
                this.AccountStatement.close();
            },
            handleValueHelpAcctStatemntClose: function (evt) {
                this.AccountStatement.close();
            }
	});
});