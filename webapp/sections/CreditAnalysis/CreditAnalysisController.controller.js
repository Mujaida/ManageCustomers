sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("iffco.managecustomer.sections.CreditAnalysis.CreditAnalysisController", {
        /**
         * @override
         */
        onInit: function() {
            if (!this.CountryRating) {
                this.CountryRating = new sap.ui.xmlfragment("iffco.managecustomer.fragments.CountryRating", this);
                this.getView().addDependent(this.CountryRating);
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

        handleValueHelpForCountryRating:function (evt) {
            this.CountryRatingField = evt.getSource();
            this.CountryRating.getBinding("items").filter([]);
            this.CountryRating.open();
            
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
        handleValueHelpCountryRatingConfirm:function (evt) {
            var title = evt.getParameter("selectedItems")[0].getProperty("title");
                this.CountryRatingField.setValue(title);

                // var oFilter1 = new sap.ui.model.Filter("country", 'EQ', title);
                this.getView().getModel().read("/zdd_country_vh",{
                    filters: [new sap.ui.model.Filter("country", "EQ", title)],
                    success: function (oData, oResponse) {
                        this.getView().byId("ctryRtng").setValue(oData.results[0].rating);
                        console.log(oData);
                    }.bind(this),
                    error:function (err) {
                        
                    }

                });
            
        },
        handleValueHelpCountryRatingSearch:function (evt) {
            var sValue = evt.getParameter("value");
                if (sValue.length > 0) {
                        var oFilter1 = new sap.ui.model.Filter("country", 'EQ', sValue);
                        this.CountryRating.getBinding("items").filter([oFilter1]);
                
                } else {
                    this.CountryRating.getBinding("items").filter([]);
                }
        }
	});
});