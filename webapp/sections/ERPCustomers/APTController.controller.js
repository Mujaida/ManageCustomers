sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.ERPCustomers.APTController", {
        onInit: function() {
            // Controller.prototype.onInit.apply(this, arguments);
            if (!this.Authorization) {
                this.Authorization = new sap.ui.xmlfragment("iffco.managecustomer.fragments.AuthorizationGrp", this);
                this.getView().addDependent(this.Authorization);
            }
            if (!this.GroupingKey) {
                this.GroupingKey = new sap.ui.xmlfragment("iffco.managecustomer.fragments.GroupingKey", this);
                this.getView().addDependent(this.GroupingKey);
            }
            if (!this.SortKey) {
                this.SortKey = new sap.ui.xmlfragment("iffco.managecustomer.fragments.SortKey", this);
                this.getView().addDependent(this.SortKey);
            }
            if (!this.HouseBank) {
                this.HouseBank = new sap.ui.xmlfragment("iffco.managecustomer.fragments.HouseBank", this);
                this.getView().addDependent(this.HouseBank);
            }
            if (!this.PaymntMethdSuplmnt) {
                this.PaymntMethdSuplmnt = new sap.ui.xmlfragment("iffco.managecustomer.fragments.PaymntMethdSuplmnt", this);
                this.getView().addDependent(this.PaymntMethdSuplmnt);
            }
            if (!this.ReleaseGrp) {
                this.ReleaseGrp = new sap.ui.xmlfragment("iffco.managecustomer.fragments.ReleaseGroup", this);
                this.getView().addDependent(this.ReleaseGrp);
            }
            if (!this.PlanningGrp) {
                this.PlanningGrp = new sap.ui.xmlfragment("iffco.managecustomer.fragments.PlanningGroup", this);
                this.getView().addDependent(this.PlanningGrp);
            }
            if (!this.ValueAdjustment) {
                this.ValueAdjustment = new sap.ui.xmlfragment("iffco.managecustomer.fragments.ValueAdjustment", this);
                this.getView().addDependent(this.ValueAdjustment);
            }
            if (!this.HeadOffice) {
                this.HeadOffice = new sap.ui.xmlfragment("iffco.managecustomer.fragments.HeadOffice", this);
                this.getView().addDependent(this.HeadOffice);
            }
            if (!this.CompCode) {
                this.CompCode = new sap.ui.xmlfragment("iffco.managecustomer.fragments.CompCode", this);
                this.getView().addDependent(this.CompCode);
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
             var filters = [];
             if (sValue.length > 0) {
                 var filter1 = new sap.ui.model.Filter({
                     path: "Authori",
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
                 this.Authorization.getBinding("items").filter(filters, false);
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

        //Value Help for Grouping Key
        handleValueHelpForGroupingKey: function (evt) {
            this.GroupingKeyField = evt.getSource();
            this.GroupingKey.getBinding("items").filter([]);
            this.GroupingKey.open();
        },
        handleValueHelpGrpngKeySearch: function (evt) {
            var sValue = evt.getParameter("value");
                var filters = [];
                if (sValue.length > 0) {
                    var filter1 = new sap.ui.model.Filter({
                        path: "Groupingkey",
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
                    this.GroupingKey.getBinding("items").filter(filters, false);
                } else {
                    this.GroupingKey.getBinding("items").filter([]);
                }
        },
        handleValueHelpGrpngKeyConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.GroupingKeyField.setValue(title + " - " + desc);
            this.GroupingKey.getBinding("items").filter([]);
            this.GroupingKey.close();
        },
        handleValueHelpGrpngKeyClose: function (evt) {
            this.GroupingKey.close();
        },

        //Value Help for Sort Key
        handleValueHelpForSortKey: function (evt) {
            this.SortKeyField = evt.getSource();
            this.SortKey.getBinding("items").filter([]);
            this.SortKey.open();
        },
        handleValueHelpSortKeySearch: function (evt) {
            var sValue = evt.getParameter("value");
            var filters = [];
            if (sValue.length > 0) {
                var filter1 = new sap.ui.model.Filter({
                    path: "Sortkey",
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
                this.SortKey.getBinding("items").filter(filters, false);
            } else {
                this.SortKey.getBinding("items").filter([]);
            }
        },
        handleValueHelpSortKeyConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.SortKeyField.setValue(title + " - " + desc);
            this.SortKey.getBinding("items").filter([]);
            this.SortKey.close();
        },
        handleValueHelpSortKeyClose: function (evt) {
            this.SortKey.close();
        },

        //Value Help for House Bank
        handleValueHelpForHouseBank: function (evt) {
            this.HouseBankField = evt.getSource();
            this.HouseBank.getBinding("items").filter([]);
            this.HouseBank.open();
        },
        handleValueHelpHouseBankSearch: function (evt) {
            var sValue = evt.getParameter("value");
            var filters = [];
            if (sValue.length > 0) {
                var filter1 = new sap.ui.model.Filter({
                    path: "Housebank",
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
                this.HouseBank.getBinding("items").filter(filters, false);
            } else {
                this.HouseBank.getBinding("items").filter([]);
            }
        },
        handleValueHelpHouseBankConfirm: function (evt) {
                var title = evt.getParameter("selectedItems")[0].getProperty("title");
                var desc = evt.getParameter("selectedItems")[0].getProperty("description");
                this.HouseBankField.setValue(title + " - " + desc);
                this.HouseBank.getBinding("items").filter([]);
                this.HouseBank.close();
        },
        handleValueHelpHouseBankClose: function (evt) {
                this.HouseBank.close();
            },

        //Value Help for Payment Method Supplement
        handleValueHelpForPaymntMethdSupplmnt: function (evt) {
            this.PaymntMethdSuplmntField = evt.getSource();
            this.PaymntMethdSuplmnt.getBinding("items").filter([]);
            this.PaymntMethdSuplmnt.open();
        },
        handleValueHelpPaymntMethdSupplmntSearch: function (evt) {
            var sValue = evt.getParameter("value");
             var filters = [];
             if (sValue.length > 0) {
                 var filter1 = new sap.ui.model.Filter({
                     path: "PaymentMethodSupplement",
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
                 this.PaymntMethdSuplmnt.getBinding("items").filter(filters, false);
             } else {
                 this.PaymntMethdSuplmnt.getBinding("items").filter([]);
             }
         },
        handleValueHelpPaymntMethdSupplmntConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.PaymntMethdSuplmntField.setValue(title + " - " + desc);
            this.PaymntMethdSuplmnt.getBinding("items").filter([]);
            this.PaymntMethdSuplmnt.close();
        },
        handleValueHelpPaymntMethdSupplmntClose: function (evt) {
            this.PaymntMethdSuplmnt.close();
        },

        //Value Help for Release Group
        handleValueHelpForReleaseGrp: function (evt) {
            this.ReleaseGrpField = evt.getSource();
            this.ReleaseGrp.getBinding("items").filter([]);
            this.ReleaseGrp.open();
        },
        handleValueHelpReleasGrpSearch: function (evt) {
            var sValue = evt.getParameter("value");
            if (sValue.length > 0) {
                var oFilter1 = new sap.ui.model.Filter("Releasegroup", 'Contains', sValue);
                this.ReleaseGrp.getBinding("items").filter([oFilter1]);
            } else {
                this.ReleaseGrp.getBinding("items").filter([]);
            }
        },
        handleValueHelpReleasGrpConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.ReleaseGrpField.setValue(title + " - " + desc);
            this.ReleaseGrp.getBinding("items").filter([]);
            this.ReleaseGrp.close();
        },
        handleValueHelpReleasGrpClose: function (evt) {
            this.ReleaseGrp.close();
        },

        //Value Help for Planning Group
        handleValueHelpForPlanningGrp: function (evt) {
            this.PlanningGrpField = evt.getSource();
            this.PlanningGrp.getBinding("items").filter([]);
            this.PlanningGrp.open();
        },
        handleValueHelpPlanngGrpSearch: function (evt) {
            var sValue = evt.getParameter("value");
            var filters = [];
            if (sValue.length > 0) {
                var filter1 = new sap.ui.model.Filter({
                    path: "Planninggrp",
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
                this.PlanningGrp.getBinding("items").filter(filters, false);
            } else {
                this.PlanningGrp.getBinding("items").filter([]);
            }
        },
        handleValueHelpPlanngGrpConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.PlanningGrpField.setValue(title + " - " + desc);
            this.PlanningGrp.getBinding("items").filter([]);
            this.PlanningGrp.close();
        },
        handleValueHelpPlanngGrpClose: function (evt) {
            this.PlanningGrp.close();
        },

        //Value Help for Value Adjustment
        handleValueHelpForValueAdjustment: function (evt) {
            this.ValueAdjustmentField = evt.getSource();
            this.ValueAdjustment.getBinding("items").filter([]);
            this.ValueAdjustment.open();
        },
        handleValueHelpValueAdjstmntSearch: function (evt) {
            var sValue = evt.getParameter("value");
            if (sValue.length > 0) {
                var oFilter1 = new sap.ui.model.Filter("Wbrsl", 'Contains', sValue);
                this.ValueAdjustment.getBinding("items").filter([oFilter1]);
            } else {
                this.ValueAdjustment.getBinding("items").filter([]);
            }
        },
        handleValueHelpValueAdjstmntConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.ValueAdjustmentField.setValue(title + " - " + desc);
            this.ValueAdjustment.getBinding("items").filter([]);
            this.ValueAdjustment.close();
        },
        handleValueHelpValueAdjstmntClose: function (evt) {
            this.ValueAdjustment.close();
        },

        //Value Help for Head Office
        handleValueHelpForHeadOffice: function (evt) {
            this.HeadOfficeField = evt.getSource();
            this.HeadOffice.getBinding("items").filter([]);
            this.HeadOffice.open();
        },
        handleValueHelpHeadOffcSearch: function (evt) {
            var sValue = evt.getParameter("value");
            var filters = [];
            if (sValue.length > 0) {
                var filter1 = new sap.ui.model.Filter({
                    path: "Zuawa",
                    operator: "Contains",
                    value1: sValue
                });
                var filter2 = new sap.ui.model.Filter({
                    path: "Ttext",
                    operator: "Contains",
                    value1: sValue
                });
                var sFilters = [filter1, filter2];
                filters.push(new sap.ui.model.Filter(sFilters, false));
                this.HeadOffice.getBinding("items").filter(filters, false);
            } else {
                this.HeadOffice.getBinding("items").filter([]);
            }
        },
        handleValueHelpHeadOffcConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.HeadOfficeField.setValue(title + " - " + desc);
            this.HeadOffice.getBinding("items").filter([]);
            this.HeadOffice.close();
        },
        handleValueHelpHeadOffcClose: function (evt) {
            this.HeadOffice.close();
        },

        //Value Help for Company Code
        handleValueHelpForCompCode: function (evt) {
            this.CompCodeField = evt.getSource();
            this.CompCode.getBinding("items").filter([]);
            this.CompCode.open();
        },
        handleValueHelpCompCodeSearch: function (evt) {
            var sValue = evt.getParameter("value");
            var filters = [];
            if (sValue.length > 0) {
                var filter1 = new sap.ui.model.Filter({
                    path: "Bukrs",
                    operator: "Contains",
                    value1: sValue
                });
                var filter2 = new sap.ui.model.Filter({
                    path: "Butxt",
                    operator: "Contains",
                    value1: sValue
                });
                var sFilters = [filter1, filter2];
                filters.push(new sap.ui.model.Filter(sFilters, false));
                this.CompCode.getBinding("items").filter(filters, false);
            } else {
                this.CompCode.getBinding("items").filter([]);
            }
        },
        handleValueHelpCompCodeConfirm: function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
            var desc = evt.getParameter("selectedItems")[0].getProperty("description");
            this.CompCodeField.setValue(title + " - " + desc);
            this.CompCode.getBinding("items").filter([]);
            this.CompCode.close();
        },
        handleValueHelpCompCodeClose: function (evt) {
            this.CompCode.close();
        }
        

	});
});