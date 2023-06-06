sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "iffco/managecustomer/formatter/formatter",
    "sap/m/MessageBox"
], function(
	Controller,
    formatter,
    MessageBox
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.CreditLimit.SecuredCreditLimitController", {
        formatter: formatter,
        onInit: function() {
            // Controller.prototype.onInit.apply(this, arguments);
            if (!this.bankCountry) {
                this.bankCountry = new sap.ui.xmlfragment("iffco.managecustomer.fragments.BankCountry", this);
                this.getView().addDependent(this.bankCountry);
            }
            if (!this.bank) {
                this.bank = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Bank", this);
                this.getView().addDependent(this.bank);
            }
            if (!this.bankCountry1) {
                this.bankCountry1 = new sap.ui.xmlfragment("iffco.managecustomer.fragments.BankCountryIc", this);
                this.getView().addDependent(this.bankCountry1);
            }
            if (!this.bank1) {
                this.bank1 = new sap.ui.xmlfragment("iffco.managecustomer.fragments.BankIc", this);
                this.getView().addDependent(this.bank1);
            }
        
        },
        handleValueHelpForBankCountry:function (evt) {
            this.bankCountryField = evt.getSource();
                this.bankCountry.getBinding("items").filter([]);
                this.bankCountry.open();
        },
        handleValueHelpForBank:function (evt) {
            this.bankField = evt.getSource();
            this.bank.getBinding("items").filter([]);
            if(this.bankCountryVal !== undefined){
                
                this.bank.getBinding("items").filter([new sap.ui.model.Filter("country", "EQ", this.bankCountryVal)]);
                this.bank.open();
            }else{
                MessageBox.error("Please Select Bank Country first");
            }
        },
        handleValueHelpBankCountryConfirm:function (evt){
            this.bankCountryVal = evt.getParameter("selectedItems")[0].getProperty("title");
                this.bankCountryField.setValue(this.bankCountryVal);
        },
        handleValueHelpBankConfirm:function (evt){
            this.bankVal = evt.getParameter("selectedItems")[0].getProperty("title");
                this.bankField.setValue(this.bankVal);
        },
        handleValueHelpBankClose:function () {
            this.bank._dialog.close();
        },
        handleValueHelpBankCountryClose:function () {
            this.bankCountry._dialog.close();
        },
        handleValueHelpBankSearch:function (evt) {
            var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                        var oFilter1 = new sap.ui.model.Filter("bank", 'EQ', sValue);
                        this.bank.getBinding("items").filter([oFilter1]);
                } else {
                    this.bank.getBinding("items").filter([]);
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
        handleValueHelpBankCountrySearch:function (evt) {
            var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                        var oFilter1 = new sap.ui.model.Filter("Country", 'EQ', sValue);
                        this.bankCountry.getBinding("items").filter([oFilter1]);
                } else {
                    this.bankCountry.getBinding("items").filter([]);
                }
        },
        handleValueHelpForBankCountry1:function (evt) {
            this.bankCountryField1 = evt.getSource();
                this.bankCountry1.getBinding("items").filter([]);
                this.bankCountry1.open();
        },
        handleValueHelpBankCountryConfirm1:function (evt){
            this.bankCountryVal1 = evt.getParameter("selectedItems")[0].getProperty("title");
                this.bankCountryField1.setValue(this.bankCountryVal1);
        },
        handleValueHelpBankCountryClose1:function () {
            this.bankCountry1._dialog.close();
        },
        handleValueHelpBankCountrySearch1:function (evt) {
            var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                        var oFilter1 = new sap.ui.model.Filter("Country", 'EQ', sValue);
                        this.bankCountry1.getBinding("items").filter([oFilter1]);
                } else {
                    this.bankCountry1.getBinding("items").filter([]);
                }
        },
        handleValueHelpForBank1:function (evt) {
            this.bankField1 = evt.getSource();
                this.bank1.getBinding("items").filter([]);
                if(this.bankCountryVal1 !== undefined){
                this.bank1.getBinding("items").filter([new sap.ui.model.Filter("country", "EQ", this.bankCountryVal1)]);
                this.bank1.open();
                }else{
                    MessageBox.error("Please Select Bank Country first");
                }
        },
        handleValueHelpBankConfirm1:function (evt){
            this.bankVal1 = evt.getParameter("selectedItems")[0].getProperty("title");
                this.bankField1.setValue(this.bankVal1);
        },
        handleValueHelpBankClose1:function () {
            this.bank1._dialog.close();
        },
        handleValueHelpBankSearch1:function (evt) {
            var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                        var oFilter1 = new sap.ui.model.Filter("bank", 'EQ', sValue);
                        this.bank1.getBinding("items").filter([oFilter1]);
                } else {
                    this.bank1.getBinding("items").filter([]);
                }
        },
        onConfirm:function (evt) {
            // var oFormData = new FormData();
            this.getView().getModel("appView").setProperty("/dmsFile", new FormData());
            // var oFileUploader = evt.getSource();
            var id=evt.getSource().getId().split("Collapsed--")[1];
            // var oFile = oFileUploader.getFocusDomRef().files[0];
            var oFile = evt.getParameter("files")[0];
            var fileName = evt.getParameters().files[0].name;
            var dmsData = this.getView().getModel("dmsModel").getData();
            this.getView().getModel("appView").getProperty("/dmsFile").append("file", oFile);
            dmsData.push({
                file:this.getView().getModel("appView").getProperty("/dmsFile"),
                fileName: id+"_"+fileName
            });
            this.getView().getModel("dmsModel").updateBindings(true);
            this.firstTime=false;
        },


	});
});