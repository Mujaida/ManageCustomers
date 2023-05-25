sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
        },
        createMasterDataModel: function(){
            var oTemp = {
                "BusinessPartnerDD" : [
                    {"BPKey":"Sold", "BPText":"Sold To"},
                        {"BPKey":"Ship", "BPText":"Ship To"},
                        {"BPKey":"One", "BPText":"One Time"},
                        {"BPKey":"Inte", "BPText":"Intercompany Customer"},
                ],
                "BPRoles": [
                    {"BPRole": "FLCU00", "BPRoleDesc":"FI Customer"},
                    {"BPRole": "FLCU01", "BPRoleDesc":"Customer"},
                    {"BPRole": "UKM000", "BPRoleDesc":"SAP Credit Management"},
                ],
                "Status":[
                    {"value": "All"},
                    {"value": "In Draft"},
                    {"value": "Submitted"}
                    // {"value": "Sendback to Initiator"},
                    // {"value": "Credit Controller Pending"},
                    // {"value": "Credit COntroller Approved"},
                    // {"value": "Sales head Pending"},
                    // {"value": "Reviewer Pending"},
                    // {"value": "Reviewer Rejected"}
                ],
                "RequestType":[
                    {value:"All"},
                    {value:"Create Customer"},
                    {value:"Edit Customer"}
                ],
                "Priority":[
                    {"value":"Low"},
                    {"value":"Medium"},
                    {"value":"High"}
                ]
            };
            var oModel = new JSONModel();
            oModel.setData(oTemp);
            return oModel;
        },
        createAppModel: function () {
            var oTemp = {
                "BusinessPartnerDD" : [
                    {"BPKey":"1", "BPText":"Sold To"},
                    {"BPKey":"2", "BPText":"Ship To"},
                    {"BPKey":"3", "BPText":"One Time"},
                    {"BPKey":"4", "BPText":"Intercompany Customer"},
                ],
                "BPRoles": [
                    {"BPRole": "FLCU00", "BPRoleDesc":"FI Customer"},
                    {"BPRole": "FLCU01", "BPRoleDesc":"Customer"},
                    {"BPRole": "UKM000", "BPRoleDesc":"SAP Credit Management"},
                ],
                "requests": [{
                    "ReqNumber": "101",
                    "ReqType": "New Customer",
                    "CustomerName": "Reliance",
                    "SiteName": "Mumbai",
                    "CustomerCode": "10007",
                    "BusinessUnit": "005",
                    "CustomerGroup": "907",
                    "Status": "InProgress",
                },
                {
                    "ReqNumber": "102",
                    "ReqType": "New Customer",
                    "CustomerName": "Reliance",
                    "SiteName": "Mumbai",
                    "CustomerCode": "10007",
                    "BusinessUnit": "005",
                    "CustomerGroup": "907",
                    "Status": "InProgress",
                },
                {
                    "ReqNumber": "103",
                    "ReqType": "New Customer",
                    "CustomerName": "Reliance",
                    "SiteName": "Mumbai",
                    "CustomerCode": "10007",
                    "BusinessUnit": "005",
                    "CustomerGroup": "907",
                    "Status": "InProgress",
                },
                {
                    "ReqNumber": "104",
                    "ReqType": "New Customer",
                    "CustomerName": "Reliance",
                    "SiteName": "Mumbai",
                    "CustomerCode": "10007",
                    "BusinessUnit": "005",
                    "CustomerGroup": "907",
                    "Status": "InProgress",
                },
                {
                    "ReqNumber": "105",
                    "ReqType": "New Customer",
                    "CustomerName": "Reliance",
                    "SiteName": "Mumbai",
                    "CustomerCode": "10007",
                    "BusinessUnit": "005",
                    "CustomerGroup": "907",
                    "Status": "Pending With Site level Credit Limit",
                },
                {
                    "ReqNumber": "106",
                    "ReqType": "New Customer",
                    "CustomerName": "Reliance",
                    "SiteName": "Mumbai",
                    "CustomerCode": "10007",
                    "BusinessUnit": "005",
                    "CustomerGroup": "907",
                    "Status": "Pending With Credit Limit Team",
                },
                {
                    "ReqNumber": "107",
                    "ReqType": "New Customer",
                    "CustomerName": "Reliance",
                    "SiteName": "Mumbai",
                    "CustomerCode": "10007",
                    "BusinessUnit": "005",
                    "CustomerGroup": "907",
                    "Status": "Pending With Background Verification Team",
                },
                {
                    "ReqNumber": "108",
                    "ReqType": "New Customer",
                    "CustomerName": "TATA",
                    "SiteName": "Mumbai",
                    "CustomerCode": "10007",
                    "BusinessUnit": "005",
                    "CustomerGroup": "907",
                    "Status": "Submitted",
                },
                {
                    "ReqNumber": "109",
                    "ReqType": "New Customer",
                    "CustomerName": "",
                    "SiteName": "",
                    "CustomerCode": "",
                    "BusinessUnit": "",
                    "CustomerGroup": "",
                    "Status": "InProgress (Draft)",
                }],
                "EntryCollection" : [{
                    "Author" : "Alexandrina Victoria",
                    "AuthorPicUrl" : "test-resources/sap/m/images/dronning_victoria.jpg",
                    "Type" : "Request",
                    "Date" : "March 03 2013",
                    "Text" : "Customer documents incomplete. rejecting your request."
                }, {
                    "Author" : "George Washington",
                    "AuthorPicUrl" : "test-resources/sap/m/images/george_washington.jpg",
                    "Type" : "Reply",
                    "Date" : "March 04 2013",
                    "Text" : "New documents uploaded. Please review now."
                }, {
                    "Author" : "Alexandrina Victoria",
                    "AuthorPicUrl" : "test-resources/sap/m/images/dronning_victoria.jpg",
                    "Type" : "Request",
                    "Date" : "March 05 2013",
                    "Text" : "Credit limit is too high."
                }, {
                    "Author" : "George Washington",
                    "AuthorPicUrl" : "test-resources/sap/m/images/george_washington.jpg",
                    "Type" : "Rejection",
                    "Date" : "March 07 2013",
                    "Text" : "Added the customer in Category B. Please review now."
                }]
            }
            var oModel = new JSONModel();
            oModel.setData(oTemp);
            return oModel;
        }
    };
});