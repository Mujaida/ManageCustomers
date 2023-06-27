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
            onInit: function () {
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
                if (!this.Language) {
                    this.Language = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Language", this);
                    this.getView().addDependent(this.Language);
                    this.Language.setModel(this.getOwnerComponent().getModel("S4D"));
                }
                if (!this.entityType) {
                    this.entityType = new sap.ui.xmlfragment("iffco.managecustomer.fragments.TypeOfEntity", this);
                    this.getView().addDependent(this.entityType);
                    this.entityType.setModel(this.getOwnerComponent().getModel());
                }
            },

            onAfterRendering: function () {
                // Controller.prototype.onAfterRendering.apply(this, arguments);
                var that = this;
                var entityVal = "Co-Operative (COOP)";
                if (entityVal.length > 0) {
                    that.getView().getModel("appView").setProperty("/TypeOfEntity", entityVal);
                }
                that.handleEntityCheckModel();

            },

            //Value Help for Type Of Entity
            handleValueHelpForEntityType: function (evt) {
                this.entityTypeField = evt.getSource();
                this.entityType.getBinding("items").filter([]);
                this.entityType.open();
            },
            handleValueHelpTypOfEntitySearch: function (evt) {
                var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                    var oFilter1 = new sap.ui.model.Filter("ztype_of_entity", 'Contains', sValue);
                    this.entityType.getBinding("items").filter([oFilter1]);
                } else {
                    this.entityType.getBinding("items").filter([]);
                }
            },
            handleValueHelpTypOfEntityConfirm: function (evt) {
                var that = this;
                var entityTypTitle = evt.getParameter("selectedItems")[0].getProperty("title");
                that.entityTypeField.setValue(entityTypTitle);
                that.getView().getModel("appView").setProperty("/TypeOfEntity", entityTypTitle);
                that.handleEntityCheckModel();

            },
            handleValueHelpTypOfEntityClose: function () {
                this.entityType.close();
            },
            //getService for type of entity to update fields
            handleEntityCheckModel: function () {
                var that = this;
                var appView = that.getView().getModel("appView");
                var obj = {
                    "COOP": "Co-Operative (COOP)",
                    "Consort": "CONSORTIUM",
                    "Govt": "Government",
                    "Ltd_Liability_partnrshp": "Limited Liability Partnership",
                    "Other": "Other",
                    "Partnership": "Partnership",
                    "Prt_ltd_Comp": "Private Limited Company",
                    "Pub_ltd_Comp": "Public Limited Company",
                    "Sole_Proprietorship": "Sole Proprietorship"
                }
                that.getView().setModel(new sap.ui.model.json.JSONModel([obj]), "typOfEntityModel");
                that.getView().getModel("typOfEntityModel").updateBindings(true);
                var oModel = that.getView().getModel("typOfEntityModel").oData[0];
                var entityTypTitle = appView.oData.TypeOfEntity;
                if (entityTypTitle && entityTypTitle == oModel.COOP) {
                    appView.setProperty("/TypeOfEntity1", true);
                    appView.setProperty("/TypeOfEntity2", false);
                    appView.setProperty("/TypeOfEntity3", false);
                    appView.setProperty("/TypeOfEntity4", false);
                    appView.setProperty("/TypeOfEntity5", false);
                    appView.setProperty("/TypeOfEntity6", false);
                    appView.setProperty("/TypeOfEntity7", false);
                    appView.setProperty("/TypeOfEntity8", false);
                    appView.setProperty("/TypeOfEntity9", false);
                } else if (entityTypTitle && entityTypTitle == oModel.Consort) {
                    appView.setProperty("/TypeOfEntity1", false);
                    appView.setProperty("/TypeOfEntity2", true);
                    appView.setProperty("/TypeOfEntity3", false);
                    appView.setProperty("/TypeOfEntity4", false);
                    appView.setProperty("/TypeOfEntity5", false);
                    appView.setProperty("/TypeOfEntity6", false);
                    appView.setProperty("/TypeOfEntity7", false);
                    appView.setProperty("/TypeOfEntity8", false);
                    appView.setProperty("/TypeOfEntity9", false);
                } else if (entityTypTitle && entityTypTitle == oModel.Govt) {
                    appView.setProperty("/TypeOfEntity1", false);
                    appView.setProperty("/TypeOfEntity2", false);
                    appView.setProperty("/TypeOfEntity3", true);
                    appView.setProperty("/TypeOfEntity4", false);
                    appView.setProperty("/TypeOfEntity5", false);
                    appView.setProperty("/TypeOfEntity6", false);
                    appView.setProperty("/TypeOfEntity7", false);
                    appView.setProperty("/TypeOfEntity8", false);
                    appView.setProperty("/TypeOfEntity9", false);
                } else if (entityTypTitle && entityTypTitle == oModel.Ltd_Liability_partnrshp) {
                    appView.setProperty("/TypeOfEntity1", false);
                    appView.setProperty("/TypeOfEntity2", false);
                    appView.setProperty("/TypeOfEntity3", false);
                    appView.setProperty("/TypeOfEntity4", true);
                    appView.setProperty("/TypeOfEntity5", false);
                    appView.setProperty("/TypeOfEntity6", false);
                    appView.setProperty("/TypeOfEntity7", false);
                    appView.setProperty("/TypeOfEntity8", false);
                    appView.setProperty("/TypeOfEntity9", false);
                } else if (entityTypTitle && entityTypTitle == oModel.Other) {
                    appView.setProperty("/TypeOfEntity1", false);
                    appView.setProperty("/TypeOfEntity2", false);
                    appView.setProperty("/TypeOfEntity3", false);
                    appView.setProperty("/TypeOfEntity4", false);
                    appView.setProperty("/TypeOfEntity5", true);
                    appView.setProperty("/TypeOfEntity6", false);
                    appView.setProperty("/TypeOfEntity7", false);
                    appView.setProperty("/TypeOfEntity8", false);
                    appView.setProperty("/TypeOfEntity9", false);
                } else if (entityTypTitle && entityTypTitle == oModel.Partnership) {
                    appView.setProperty("/TypeOfEntity1", false);
                    appView.setProperty("/TypeOfEntity2", false);
                    appView.setProperty("/TypeOfEntity3", false);
                    appView.setProperty("/TypeOfEntity4", false);
                    appView.setProperty("/TypeOfEntity5", false);
                    appView.setProperty("/TypeOfEntity6", true);
                    appView.setProperty("/TypeOfEntity7", false);
                    appView.setProperty("/TypeOfEntity8", false);
                    appView.setProperty("/TypeOfEntity9", false);
                } else if (entityTypTitle && entityTypTitle == oModel.Prt_ltd_Comp) {
                    appView.setProperty("/TypeOfEntity1", false);
                    appView.setProperty("/TypeOfEntity2", false);
                    appView.setProperty("/TypeOfEntity3", false);
                    appView.setProperty("/TypeOfEntity4", false);
                    appView.setProperty("/TypeOfEntity5", false);
                    appView.setProperty("/TypeOfEntity6", false);
                    appView.setProperty("/TypeOfEntity7", true);
                    appView.setProperty("/TypeOfEntity8", false);
                    appView.setProperty("/TypeOfEntity9", false);
                } else if (entityTypTitle && entityTypTitle == oModel.Pub_ltd_Comp) {
                    appView.setProperty("/TypeOfEntity1", false);
                    appView.setProperty("/TypeOfEntity2", false);
                    appView.setProperty("/TypeOfEntity3", false);
                    appView.setProperty("/TypeOfEntity4", false);
                    appView.setProperty("/TypeOfEntity5", false);
                    appView.setProperty("/TypeOfEntity6", false);
                    appView.setProperty("/TypeOfEntity7", false);
                    appView.setProperty("/TypeOfEntity8", true);
                    appView.setProperty("/TypeOfEntity9", false);
                } else if (entityTypTitle && entityTypTitle == oModel.Sole_Proprietorship) {
                    appView.setProperty("/TypeOfEntity1", false);
                    appView.setProperty("/TypeOfEntity2", false);
                    appView.setProperty("/TypeOfEntity3", false);
                    appView.setProperty("/TypeOfEntity4", false);
                    appView.setProperty("/TypeOfEntity5", false);
                    appView.setProperty("/TypeOfEntity6", false);
                    appView.setProperty("/TypeOfEntity7", false);
                    appView.setProperty("/TypeOfEntity8", false);
                    appView.setProperty("/TypeOfEntity9", true);
                }
            },
            onEntityConfirm: function (evt) {
                var val = this.getView().byId("entityId").getValue();
                this.getView().getModel("appView").setProperty("/TypeOfEntity", val);
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
                var filters = [];
                if (sValue.length > 0) {
                    var filter1 = new sap.ui.model.Filter({
                        path: "Land1",
                        operator: "Contains",
                        value1: sValue
                    });
                    var filter2 = new sap.ui.model.Filter({
                        path: "Landx",
                        operator: "Contains",
                        value1: sValue
                    });
                    var sFilters = [filter1, filter2];
                    filters.push(new sap.ui.model.Filter(sFilters, false));
                    this.Country.getBinding("items").filter(filters, false);
                } else {
                    this.Country.getBinding("items").filter([]);
                }
            },

            //Value Help for State/Region
            handleValueHelpForRegion: function (evt) {
                this.regionField = evt.getSource();
                var val = this.getView().byId("LAND1").getValue();
                if (val.length > 0) {
                    this.Region.getBinding("items").filter([new sap.ui.model.Filter("Land1", "EQ", val.split(" - ")[0])]);
                    // this.Region.getBinding("items").filter([new sap.ui.model.Filter("Land1", "EQ", val)]);
                    this.Region.open();
                } else {
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
                var val = this.getView().byId("LAND1").getValue();
                var sValue = evt.getParameter("value");
                var filters = [];
                if (sValue.length > 0) {
                    var filter1 = new sap.ui.model.Filter({
                        path: "Bland",
                        operator: "Contains",
                        value1: sValue
                    });
                    var filter2 = new sap.ui.model.Filter({
                        path: "Bezei",
                        operator: "Contains",
                        value1: sValue
                    });
                    var sFilters = [filter1, filter2];
                    filters.push(new sap.ui.model.Filter(sFilters, false));
                    if (val.length > 0) {
                        filters.push(new sap.ui.model.Filter("Land1", "EQ", val.split(" - ")[0]));
                    }
                    this.Region.getBinding("items").filter(filters, true);
                } else {
                    this.Region.getBinding("items").filter([new sap.ui.model.Filter("Land1", "EQ", val.split(" - ")[0])]);
                }
            },

            //Value Help for Transportation Zone
            handleValueHelpForTrsptnZne: function (evt) {
                this.trnsptZonField = evt.getSource();
                var val = this.getView().byId("LAND1").getValue();
                if (val.length > 0) {
                    this.TransprtZone.getBinding("items").filter([new sap.ui.model.Filter("Land1", "EQ", val.split(" - ")[0])]);
                    // this.TransprtZone.getBinding("items").filter([]);
                    this.TransprtZone.open();
                } else {
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
                var filters = [];
                if (sValue.length > 0) {
                    var filter1 = new sap.ui.model.Filter({
                        path: "Zone1",
                        operator: "Contains",
                        value1: sValue
                    });
                    var filter2 = new sap.ui.model.Filter({
                        path: "Vtext",
                        operator: "Contains",
                        value1: sValue
                    });
                    var sFilters = [filter1, filter2];
                    filters.push(new sap.ui.model.Filter(sFilters, false));
                    if (this.val.length > 0) {
                        filters.push(new sap.ui.model.Filter("Land1", "EQ", this.val.split(" - ")[0]));
                    }
                    this.TransprtZone.getBinding("items").filter(filters, true);
                } else {
                    var val = this.getView().byId("LAND1").getValue();
                    this.TransprtZone.getBinding("items").filter([new sap.ui.model.Filter("Land1", "EQ", val.split(" - ")[0])]);
                }
            },
            handleValueHelpTrnsptZoneClose: function (params) {
                this.TransprtZone.close();
            },
            handleValueHelpStateClose: function (params) {
                this.Region.close();
            },

            // Value Help for Language
            handleValueHelpForLanguage: function (evt) {
                this.LanguageField = evt.getSource();
                this.Language.getBinding("items").filter([]);
                this.Language.open();
            },

            handleValueHelpLangConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.LanguageField.setValue(title + " - " + desc);
                this.Language.getBinding("items").filter([]);
                this.Language.close();
            },
            handleValueHelpLangSearch: function (evt) {
                var sValue = evt.getParameter("value");
                var filters = [];
                if (sValue.length > 0) {
                    var filter1 = new sap.ui.model.Filter({
                        path: "Languages",
                        operator: "Contains",
                        value1: sValue
                    });
                    var filter2 = new sap.ui.model.Filter({
                        path: "Description",
                        operator: "Contains",
                        value1: sValue
                    });
                    var sFilters = [filter1, filter2];
                    filters.push(new sap.ui.model.Filter(sFilters, false));
                    this.Language.getBinding("items").filter(filters, false);
                } else {
                    this.Language.getBinding("items").filter([]);
                }
            },
            handleValueHelpLangClose: function (params) {
                this.Language.close();
            }
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