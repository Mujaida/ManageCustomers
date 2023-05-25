sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("iffco.managecustomer.controller.App", {
        onInit() {
          var oViewModel = new sap.ui.model.json.JSONModel({
            zcustNum:"",
            zsalesOrg:"",
            ztext:"",
            selectedType: 0,
            newCustId:"",
            custType:"Credit",
            customerType: 0,
            content:"",
            selectedMode:false,
            distributionChannel:"",
            cca:"",
            reqType: "",
            salesOrg:"",
            dmsFile:[{}],
            businessPartnerId:"",
            reqNo:"",
            process:"CHANGE",
            vertical:"Credit",
            bpg:"Sold To",
            mode:"add",
            status: "create",
            generateSale:false
          });
          this.getView().setModel(oViewModel, "appView");
        }
      });
    }
  );
  