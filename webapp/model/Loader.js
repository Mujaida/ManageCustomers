sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "iffco/managecustomer/model/Data",
    "iffco/managecustomer/model/App"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device,Data,App) {
        "use strict";
        const _loader = {};

        _loader.getRuleId = function getRuleId(model){
            
               App.publishEvent("DataReceived","testdata");
      
    } 
        return _loader; 
    });