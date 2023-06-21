sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.SalesArea.GIController", {
        /**
         * @override
         */
        onInit: function() {
            if (!this.salesData) {
                this.salesData = new sap.ui.xmlfragment("iffco.managecustomer.fragments.SalesFields", this);
                this.getView().addDependent(this.salesData);
                this.salesData.setModel(this.getOwnerComponent().getModel());
            }
            if (!this.salesOrganization) {
                this.salesOrganization = new sap.ui.xmlfragment("iffco.managecustomer.fragments.SalesOrg", this);
                this.getView().addDependent(this.salesOrganization);
                this.salesOrganization.setModel(this.getOwnerComponent().getModel());
            }
            if (!this.distribution) {
                this.distribution = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Distribution", this);
                this.getView().addDependent(this.distribution);
            }
            if (!this.division) {
                this.division = new sap.ui.xmlfragment("iffco.managecustomer.fragments.DivisionSet", this);
                this.getView().addDependent(this.division);
            }
            
        },
        handleAddSales: function (evt) {
            this.salesData.open();
        },
        handleAddSalesGrid: function (evt) {
            // var that = this;
            var salesOrg = this.salesData.getContent()[0].getContent()[1].getValue();
            var distribution = this.salesData.getContent()[0].getContent()[3].getValue();
            var division = this.salesData.getContent()[0].getContent()[5].getValue();
            // var taxClsSplit = taxCls.split(" - ")[0];
            // this.handleUpdateTaxgridOrder();
            var arr = {
                // "zcustomer_num":this.custNum,
                "zsales_orgnization": salesOrg.split(" - ")[0],
                "zsales_orgnization_text": salesOrg.split(" - ")[1],
                "zdivision": division.split(" - ")[0],
                "zdivision_text": division.split(" - ")[1],
                "zdistribution_channel": distribution.split(" - ")[0],
                "zdistribution_channel_text": distribution.split(" - ")[1]
            };
            this.getView().getModel("salesModel").oData.push(arr);
            this.getView().getModel("salesModel").updateBindings(true);

            this.handleCancelOutputTax();
        },
        handleDeleteSalesGrid: function (e) {
            var that = this;
            var oModel = this.getView().getModel();
            var salesAreaId = e.getSource().getBindingContext("salesModel").getObject().zsales_area_id;
            var custNum = e.getSource().getBindingContext("salesModel").getObject().zcustomer_num;
            var salesOrg = e.getSource().getBindingContext("salesModel").getObject().zsales_orgnization;
            that.dPath = "/ZDD_CUST_SALESAREAS(zcustomer_num=guid'" + custNum + "',zsales_orgnization='" + salesOrg + "',zsales_area_id='" + salesAreaId + "')";
            that.getView().getModel("salesModel").oData.splice(e.getSource().getBindingContext("salesModel").getObject().zsales_area_id, 1);
            // that.getView().getModel("salesModel").updateBindings(true);
            e.getSource().getBindingContext("salesModel").getModel().updateBindings(true);
            oModel.remove(that.dPath, {
                method: "DELETE",
                success: function (data) {

                },
                error: function (e) {
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox(e);
                }
            });
        },
        handleCancelOutputTax: function (evt) {
            this.salesData.getContent()[0].getContent()[1].setValue("");
            this.salesData.getContent()[0].getContent()[3].setValue("");
            this.salesData.getContent()[0].getContent()[5].setValue("");
            this.salesData.close();
        },
        handleValueHelpForSalesOrg: function (evt) {
            this.salesOrgField = evt.getSource();
            this.salesOrganization.getBinding("items").filter([]);
            this.salesOrganization.open();
        },
        handleValueHelpSalesOrgClose: function () {
            this.salesOrganization._dialog.close();
        },
        handleValueHelpSalesOrgConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.salesOrgField.setValue(title + " - " + desc);
            this.getView().getModel("appView").setProperty("/salesOrg", title);
        },
        handleValueHelpSalesOrgSearch: function (evt) {
            var sValue = evt.getParameter("value");
            if (sValue.length > 0) {
                if (sValue.length == 2) {
                    var oFilter1 = new sap.ui.model.Filter("SalesOrg", 'EQ', sValue);
                    this.salesOrganization.getBinding("items").filter([oFilter1]);
                } else {
                    var oFilter2 = new sap.ui.model.Filter("SalesOrgText", 'EQ', sValue);
                    this.salesOrganization.getBinding("items").filter([oFilter2]);
                }
            } else {
                this.salesOrganization.getBinding("items").filter([]);
            }
        },

        handleValueHelpForDistChannel: function (evt) {
            this.distributionField = evt.getSource();
            this.distribution.getBinding("items").filter([]);
            this.distribution.open();
        },
        handleValueHelpDistributionClose: function () {
            this.distribution._dialog.close();
        },
        handleValueHelpDistributionConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.distributionField.setValue(title + " - " + desc);
            this.getView().getModel("appView").setProperty("/distributionChannel", title);
        },
        handleValueHelpDistribSearch: function (evt) {
            var sValue = evt.getParameter("value");
            if (sValue.length > 0) {
                if (sValue.length > 2) {
                    var oFilter1 = new sap.ui.model.Filter("DistributionChannel", 'EQ', sValue);
                    this.distribution.getBinding("items").filter([oFilter1]);
                } else {
                    var oFilter2 = new sap.ui.model.Filter("DistributionChannelText", 'EQ', sValue);
                    this.distribution.getBinding("items").filter([oFilter2]);
                }
            } else {
                this.distribution.getBinding("items").filter([]);
            }
        },

        handleValueHelpForDivision: function (evt) {
            this.divisionField = evt.getSource();
            this.division.getBinding("items").filter([]);
            this.division.open();
        },
        handleValueHelpDivisionClose: function () {
            this.division._dialog.close();
        },
        handleValueHelpDivisionConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.divisionField.setValue(title + " - " + desc);
        },
        handleValueHelpDivisionSearch: function (evt) {
            var sValue = evt.getParameter("value");
            if (sValue.length > 0) {
                if (sValue.length == 2) {
                    var oFilter1 = new sap.ui.model.Filter("Division", 'EQ', sValue);
                    this.division.getBinding("items").filter([oFilter1]);
                } else {
                    var oFilter2 = new sap.ui.model.Filter("Divisiontext", 'EQ', sValue);
                    this.division.getBinding("items").filter([oFilter2]);
                }


            } else {
                this.division.getBinding("items").filter([]);
            }
        },
	});
});