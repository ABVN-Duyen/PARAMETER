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
        getClient: async function(){
            try {
                let oResponse = await fetch("/odata/v4/graph/CLIENT_VIEW", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                    return await oResponse.json()
            } catch (error) {
                return error
            }
        },
        upsertParameter: async function (aParam, aNewClient) {
            const oParameter = {"aParameter": aParam, "aNewClient": aNewClient}
            try {
                let oResponse = await fetch("/odata/v4/graph/upsertESGParameter", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(oParameter),
                });
                return await oResponse.json()
            } catch (error) {
                return error
            }
        },

        getParameter: async function(){
            try {
                let oResponse = await fetch("/odata/v4/graph/ESGParameter", {
                    method: "GET",
                });
                return await oResponse.json()
            } catch (error) {
                return error
            }
        },

        getMeasureMaster: async function(){
            try {
                let oResponse = await fetch("/odata/v4/graph/getMeasureMaster()", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                    return await oResponse.json()
            } catch (error) {
                return error
            }
        }
    };
});