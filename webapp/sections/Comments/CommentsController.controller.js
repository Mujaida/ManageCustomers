sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("iffco.managecustomer.sections.Comments.CommentsController", {
            onPost : function(evt){
                console.log("hii");
                var oModel = this.getView().getModel();      
                this.getView().getModel("appView").setProperty("/ztext", evt.getParameters().value);
                var listItem = this.getOwnerComponent().getModel("commentsModel").getData(); 
                
                // var commentsEntry = this.getView().getModel("commentsInfoModel").getData();
                
                var commentsArr = [];
                listItem.push({
                    zcomment : this.getView().getModel("appView").getProperty("/ztext")
                });
                
                // this.getOwnerComponent().getModel("commentsModel").oData.push(obj);
                this.getOwnerComponent().getModel("commentsModel").updateBindings(true);
                // this.getView().byId("list").setModel(this.getOwnerComponent().getModel("commentsModel"));
			// this.getView().byId("list").updateBindings(true);
                
            
        }
	});

});