sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.CustomerBasicDetails.InitiationDetailsController", {
		onInit: function () {
            if (!this.businessUnit) {
                this.businessUnit = new sap.ui.xmlfragment("iffco.managecustomer.fragments.BusinessUnit", this);
                this.getView().addDependent(this.businessUnit);
            }
            if (!this.vertical) {
                this.vertical = new sap.ui.xmlfragment("iffco.managecustomer.fragments.Vertical", this);
                this.getView().addDependent(this.vertical);
            }
            
        },


        onDescriptionSelect:function (evt) {
            console.log("a");
            this.getView().getModel("appView").setProperty("/customerType",evt.getParameters().selectedIndex);
        },
		handleValueHelpForBusinessUnit:function (evt) {
			this.businessUnitField = evt.getSource();
			this.businessUnit.getBinding("items").filter([]);
			this.businessUnit.open();
	},
	handleValueHelpForVertical:function (evt) {
		this.verticalField = evt.getSource();
		var val = this.getView().byId("businessId").getValue();
		if(val){
			this.vertical.getBinding("items").filter([new sap.ui.model.Filter("Businessunit", "EQ", val)]);
			this.vertical.open();
		}else{
			sap.m.MessageBox.error("Please select Business Unit");
		}
	},

	handleValueHelpBusinessunitConfirm: function (evt) {
		this.businessUntVal = evt.getParameter("selectedItems")[0].getProperty("title");
		this.businessUnitField.setValue(this.businessUntVal);
	},
	handleValueHelpVerticalConfirm: function (evt) {
		this.verticalVal = evt.getParameter("selectedItems")[0].getProperty("title");
		this.verticalField.setValue(this.verticalVal);
		this.getView().getModel("appView").setProperty("/vertical", this.verticalVal);
            this.handleRuleEngineConfiguration();
	},

	handleValueHelpBusinessunitClose:function () {
		this.businessUnit._dialog.close();
	},
	handleValueHelpBusinessUnitSearch:function (evt) {
			var sValue = evt.getParameter("value");
			if (sValue.length > 0) {   
				var oFilter2 = new sap.ui.model.Filter("Businessunit", 'EQ', sValue);
				this.businessUnit.getBinding("items").filter([oFilter2]);
	}else {
        this.businessUnit.getBinding("items").filter([]);
      }
},
handleValueHelpVerticalSearch :function (evt) {
	var sValue = evt.getParameter("value");
			if (sValue.length > 0) {   
				var oFilter2 = new sap.ui.model.Filter("vertical", 'EQ', sValue);
				this.vertical.getBinding("items").filter([oFilter2]);
	}else {
        this.vertical.getBinding("items").filter([]);
      }
},
handleRuleEngineConfiguration: function (oEvent) {
	console.log("ty");
	// var process = "CREATE";
	var process = this.getView().getModel("appView").getProperty("/process");
	var sCustomerType = this.getView().getModel("appView").getProperty("/vertical") === 'Cash' ? 'Cash' : 'Credit';
	// var sCustomerType = this.getView().byId("orderdata").getParent().getSubSections()[0].getBlocks()[0].getAggregation("_views")[0].getContent()[0].getContent()[5].getSelectedButton().getText();
	var sBPGrouping = this.getView().getModel("appView").getProperty("/bpg");
	this.ruleId = "";
	if (process !== "" && sCustomerType !== "" && sBPGrouping !== "") {
		var oModel = this.getView().getModel("RuleEngine");
		oModel.read("/Zdd_rule_engine", {
			urlParameters: {
				"$top": 10000
			},
			success: function (oData, oResponse) {
				for (var i = 0; i < oData.results.length; i++) {
					if (oData.results[i].process === process && oData.results[i].customer_type === sCustomerType.toUpperCase() && oData.results[i].zbusiness_partner_id === sBPGrouping.toUpperCase()) {

						this.ruleId = oData.results[i].rule_id;
						console.log(this.ruleId);
					}
				}

				if (this.ruleId == "" || this.ruleId == undefined) {
					MessageBox.confirm("Rule engine Configuration does not exist for the selected keys?", {
						actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						emphasizedAction: MessageBox.Action.OK,
						onClose: function (sAction) {
							if (sAction === "CANCEL") {
								oFilterBar.getFilterItems()[1].getControl().setSelectedItem(null);
							}
							else {
								this.onCreate(process, sCustomerType, sBPGrouping);
							}
						}.bind(this)
					});
				} else {
					this.onRead(this.ruleId);
				}
			}.bind(this),
			error: function (oError) { }
		});
	}
},
onRead: function (ruleid) {
	var oModel = this.getView().getModel("RuleEngine");
	// this.getView().setBusy(true);
	oModel.read("/ZDD_RULE_UPDATE_FIELDS", {
		filters: [new sap.ui.model.Filter("rule_id", "EQ", ruleid)],
		urlParameters: {
			"$top": 10000
		},

		success: function (oData, oResponse) {
			console.log(oData.results);
			var flatObj = {};
			oData.results.forEach(function (obj) {
				var sField = "";
				var rField = "";
				sField += obj.fieldname.split(" ").join("");
				rField += obj.fieldname.split(" ").join("");

				if(obj.visibility){
				sField += "Visible";
				if (obj.visibility === "Y") {
					flatObj[sField] = true;
				} else {
					flatObj[sField] = false;
				}
				}
				if(obj.mandatory){
				rField += "Mandatory";
				if (obj.mandatory === "Y") {
					flatObj[rField] = true;
				} else {
					flatObj[rField] = false;
				}
				}
			})
			console.log(flatObj);
			// this.getView().setModel(new sap.ui.model.json.JSONModel({}), "fieldMappingModels");
			this.getView().getModel("fieldMappingModels").oData = flatObj;
			this.getView().getModel("fieldMappingModels").updateBindings(true);
			console.log(this.getView().getModel("fieldMappingModels").oData);

		}.bind(this),
		error: function (oError) {
			this.getView().setBusy(false);
		}.bind(this)
	});
},
	});
});