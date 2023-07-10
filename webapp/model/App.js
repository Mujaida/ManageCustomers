sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/ui/core/EventBus"
], 
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device , EventBus) {
        "use strict";
        const _appObject = {};
        _appObject._eventBus = new EventBus();

        _appObject.getEventBus = function () {
            return _appObject._eventBus;
        };

        _appObject.subscribeEvent = function subscribeEvent (eventId,pFunction,pContext){
            _appObject._eventBus.subscribe("CUST",eventId,pFunction,pContext);
        };

        _appObject.publishEvent = function publishEvent(eventId,pdata)
        {
            var ldata = {};
            if(pdata){
                ldata=pdata;
            }
            _appObject._eventBus.publish("CUST",eventId,ldata);
        };
                 
        return _appObject;
    });