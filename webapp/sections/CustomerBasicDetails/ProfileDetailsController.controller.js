sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("iffco.managecustomer.sections.CustomerBasicDetails.ProfileDetailsController", {
            /**
             * @override
             */
            onInit: function() {
                // Controller.prototype.onInit.apply(this, arguments);
                if (!this.Country) {
                    this.Country = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Country", this);
                    this.getView().addDependent(this.Country);
                }
                if (!this.Region) {
                    this.Region = new sap.ui.xmlfragment("iffco.managecustomer.fragments.State", this);
                    this.getView().addDependent(this.Region);
                    //this.Region.setModel(this.getOwnerComponent().getModel("S4D"));
                }
                if (!this.TransprtZone) {
                    this.TransprtZone = new sap.ui.xmlfragment("iffco.managecustomer.fragments.TrsptnZone", this);
                    this.getView().addDependent(this.TransprtZone);
                    this.TransprtZone.setModel(this.getOwnerComponent().getModel("S4D"));
                }
                // if (!this.entityType) {
                //     this.entityType = new sap.ui.xmlfragment("iffco.managecustomer.fragments.EntityType", this);
                //     this.getView().addDependent(this.entityType);
                //     this.entityType.setModel(this.getOwnerComponent().getModel("S4D"));
                // }
            },
            //Value Help for Country
            handleValueHelpForCountry: function (evt) {
                this.countryField = evt.getSource();
                this.Country.getBinding("items").filter([]);
                this.Country.open();
            },
            handleValueHelpCountrClose: function (params) {
                this.Country._dialog.close();
            },
            handleValueHelpCountryConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.countryField.setValue(title + " - " + desc);
            },
            handleValueHelpCountrySearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("Land1", 'EQ', sValue);
                        this.Country.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Landx", 'EQ', sValue);
                        this.Country.getBinding("items").filter([oFilter2]);
                    }
                    // this.Country.getBinding("items").filter([oFilter2]);
                } else {
                    this.Country.getBinding("items").filter([]);
                }
            },

            //Value Help for State/Region
            handleValueHelpForRegion: function (evt) {
                this.regionField = evt.getSource();
                var val = this.getView().byId("LAND1").getValue();
                if(val.length>0){
                    this.Region.getBinding("items").filter([new sap.ui.model.Filter("Land1", "EQ", val.split(" - ")[0])]);
                    this.Region.open();
                }else{
                    sap.m.MessageBox.error("Please select the Country");
                }
            },
            handleValueHelpStateConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.regionField.setValue(title + " - " + desc);
                this.Region.close();
            },
            handleValueHelpStateSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("Bland", 'EQ', sValue);
                        this.Region.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Bezei", 'EQ', sValue);
                        this.Region.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    var val = this.getView().byId("LAND1").getValue();
                    this.Region.getBinding("items").filter([new sap.ui.model.Filter("Land1", "EQ", val.split(" - ")[0])]);
                }
            },

             //Value Help for Transportation Zone
             handleValueHelpForTrsptnZne: function (evt) {
                this.trnsptZonField = evt.getSource();
                var val = this.getView().byId("LAND1").getValue();
                if(val.length>0){
                    this.TransprtZone.getBinding("items").filter([new sap.ui.model.Filter("Land1", "EQ", val.split(" - ")[0])]);
                    // this.TransprtZone.getBinding("items").filter([]);
                    this.TransprtZone.open();
                }else{
                    sap.m.MessageBox.error("Please select the Country");
                }
            },
            handleValueHelpTrnsptZoneConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.trnsptZonField.setValue(title + " - " + desc);
                this.TransprtZone.getBinding("items").filter([]);
                this.TransprtZone.close();
            },
            handleValueHelpTrnsptZoneSearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    if (sValue.length == 2) {
                        var oFilter1 = new sap.ui.model.Filter("Zone1", 'EQ', sValue);
                        this.TransprtZone.getBinding("items").filter([oFilter1]);
                    } else {
                        var oFilter2 = new sap.ui.model.Filter("Vtext", 'EQ', sValue);
                        this.TransprtZone.getBinding("items").filter([oFilter2]);
                    }
                } else {
                    this.TransprtZone.getBinding("items").filter([]);
                }
            },
            handleValueHelpTrnsptZoneClose: function (params) {
                this.TransprtZone.close();
            },
            handleValueHelpStateClose: function (params) {
                this.Region.close();
            },

            //Value Help for Entity Type
            // handleValueHelpForEntityType: function (evt) {
            //     this.entityTypeField = evt.getSource();
            //     this.entityType.getBinding("items").filter([]);
            //     this.entityType.open();
            // },
            // handleValueHelpEntityClose: function () {
            //     this.entityType._dialog.close();
            // },
            // handleValueHelpEntityConfirm: function (evt) {
            //     var title = evt.getParameter("selectedItems")[0].getProperty("title");
            //     var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            //     this.entityTypeField.setValue(title + " - " + desc);
            // }
            // handleSetMaxLength:function (evt) {
            //     var val = evt.getSource().getValue().length;
            //     var maxLen = evt.getSource().getMaxLength();
            //     if(val >= maxLen){
            //         evt.getSource().setType("Text");
            //     }else{
            //         evt.getSource().setType("Number");
            //     }
            // }
	});

});