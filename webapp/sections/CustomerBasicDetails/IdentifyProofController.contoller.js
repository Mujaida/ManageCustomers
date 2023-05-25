sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.CustomerBasicDetails.IdentifyProof", {
		
		onConfirm:function (evt) {
            // var oFormData = new FormData();
            this.getView().getModel("appView").setProperty("/dmsFile", new FormData());
            var oFileUploader = evt.getSource();
            var oFile = evt.getParameter("files")[0];
            var fileName = evt.getParameters().files[0].name;
            var dmsData = this.getView().getModel("dmsModel").getData();
            this.getView().getModel("appView").getProperty("/dmsFile").append("file", oFile);
            dmsData.push({
                file:this.getView().getModel("appView").getProperty("/dmsFile"),
                fileName: fileName
            });
              this.getView().getModel("dmsModel").updateBindings(true);
            this.firstTime=false;
        }
	});
});