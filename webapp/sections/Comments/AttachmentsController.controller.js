sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "iffco/managecustomer/formatter/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, formatter) {
        "use strict";

        return Controller.extend("iffco.managecustomer.sections.Comments.AttachmentsController", {
            formatter: formatter,
            onClickAttachment:function (evt) {
                var serviceURL = this.getOwnerComponent().getModel("DMS").sServiceUrl;
                var oModel = new sap.ui.model.odata.ODataModel(serviceURL, true);
                
                var path = "https://port8082-workspaces-ws-swxlg.eu10.applicationstudio.cloud.sap/sap/opu/odata/sap/API_CV_ATTACHMENT_SRV/AttachmentContentSet(DocumentInfoRecordDocType='" + evt.getSource().getBindingContext("attachmentsModel").getObject().DocumentInfoRecordDocType +
                                        "',DocumentInfoRecordDocNumber='" + evt.getSource().getBindingContext("attachmentsModel").getObject().DocumentInfoRecordDocNumber +
                                         "',DocumentInfoRecordDocVersion='" + '00'+
                                          "',DocumentInfoRecordDocPart='" + '000' +
                                           "',LogicalDocument='" + evt.getSource().getBindingContext("attachmentsModel").getObject().LogicalDocument 
                                           + "',ArchiveDocumentID='" + evt.getSource().getBindingContext("attachmentsModel").getObject().ArchiveDocumentID 
                                            + "',LinkedSAPObjectKey='" + evt.getSource().getBindingContext("attachmentsModel").getObject().LinkedSAPObjectKey 
                                            +"',BusinessObjectTypeName='" + evt.getSource().getBindingContext("attachmentsModel").getObject().BusinessObjectTypeName + ")/$value";
                                            path = path.replaceAll("KNA1","KNA1'");
                                            window.open(path);
           

                                        },
              handleDeleteAttachment : function (evt) {
                 this.inputValue = evt.getSource();
                this.objs = evt.getSource().getBindingContext("attachmentsModel").getObject();
               this.DocumentInfoRecordDocType = evt.getSource().getBindingContext("attachmentsModel").getObject().DocumentInfoRecordDocType;
               this.LogicalDocument = evt.getSource().getBindingContext("attachmentsModel").getObject().LogicalDocument;
               this.ArchiveDocumentID = evt.getSource().getBindingContext("attachmentsModel").getObject().ArchiveDocumentID;
               this.LinkedSAPObjectKey = evt.getSource().getBindingContext("attachmentsModel").getObject().LinkedSAPObjectKey;
               this.BusinessObjectTypeName = evt.getSource().getBindingContext("attachmentsModel").getObject().BusinessObjectTypeName;
        
               this.DocumentInfoRecordDocNumber = evt.getSource().getBindingContext("attachmentsModel").getObject().DocumentInfoRecordDocNumber;
                MessageBox.confirm("Are you sure you want to delete this File?", {
                    actions: ["Yes", "No"],
                    emphasizedAction: "Yes",
                    onClose: function (oEvent) {
                        if (oEvent == "Yes"){
                var serviceURL = this.getOwnerComponent().getModel("DMS").sServiceUrl;
                var oModel = new sap.ui.model.odata.ODataModel(serviceURL, true);
                var path = "/AttachmentContentSet(DocumentInfoRecordDocType='" + this.DocumentInfoRecordDocType +
                "',DocumentInfoRecordDocNumber='" + this.DocumentInfoRecordDocNumber +
                 "',DocumentInfoRecordDocVersion='" + '00'+
                  "',DocumentInfoRecordDocPart='" + '000' +
                   "',LogicalDocument='" + this.LogicalDocument 
                   + "',ArchiveDocumentID='" + this.ArchiveDocumentID 
                    + "',LinkedSAPObjectKey='" + this.LinkedSAPObjectKey 
                    +"',BusinessObjectTypeName='" + this.BusinessObjectTypeName + ")";
                    path = path.replaceAll("KNA1","KNA1'");
                    this.inputValue.getBindingContext("attachmentsModel").getObject().Flag="D";
                    this.inputValue.getBindingContext("attachmentsModel").getModel().updateBindings(true);
                                            oModel.remove(path, {
                                                
                                                success: function (oData, oResponse) {
                                                 
                                            }.bind(this),
                                            error:function (err) {
                                                
                                            }
                                        })
                                    }
                                }.bind(this),
                                });
                                
                                        
              }
	});

});