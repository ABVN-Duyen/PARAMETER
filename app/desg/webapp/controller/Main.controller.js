sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/model/Binding",
    "../model/models",
    "sap/m/MessageBox",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    Controller,
    JSONModel,
    Fragment,
    Filter,
    FilterOperator,
    MessageToast,
    Binding,
    Model,
    MessageBox
  ) {
    "use strict";
    let idInput = "";
    return Controller.extend("desg.controller.Main", {
      onInit: async function () {
        this.setModelInputField();
        await this.fetchClientSetModel();
        await this.fetchMearsureSetModel();
        this.setModelLogarithm();
        this.displayData();
      },

      /**
       * Fetch data from db, get external data from internal data and setProperty for model to display on input field
       */
      displayData: async function () {
        let oView = this.getView();
        let that = this;
        /**
         * Get Parameter for first display
         */
        let aParam = await Model.getParameter();
        if (aParam.error) {
          // fail case
          console.log(aParam.error);
        } else {
          // success
          let dataDisplay = aParam.value;
          console.log(dataDisplay);

          // get data to 2 array 
          let overviewData = dataDisplay[1];
          let valueData = dataDisplay[0];

          await that.getOverviewDataDisplay(overviewData);
          await that.getClientDataDisplay("overview", overviewData);
          await that.getValueDataDisplay(valueData);
          await that.getClientDataDisplay("value", valueData);
          console.log(this.getView().getModel().getData());
        }
      },
      getOverviewDataDisplay: function (data) {
        let oView = this.getView();
        let aMearsureData = oView.getModel("mearsureData").getData().data;
        let keyMearsureData = [
          "objective1",
          "objective2",
          "subjective1",
          "rugsub",
          "subjective2",
        ];
        for (let key in data) {
          // Check status checkbox
          if (`${key}` == "usage_flag" && `${data[key]}` == "X") {
            oView.getModel().setProperty("/overview/status/external", true);
            oView.getModel().setProperty("/overview/status/internal", "X");
          } else if (`${key}` == "usage_flag" && `${data[key]}` == "") {
            oView.getModel().setProperty("/overview/status/external", false);
          }

          // Check comboBox
          if (`${key}` == "logarithm") {
            oView
              .byId("input_overview_logarithm")
              .setSelectedKey(`${data[key]}`);
          }

          // Check pValue and Year
          if (`${key}` == "pValue" || `${key}` == "year") {
            oView
              .getModel()
              .setProperty(`/overview/${key}/internal`, `${data[key]}`);
          }

          // Check another fields with mearsure data
          let checkKeyMearsureData = keyMearsureData.find(
            (item) => item == `${key}`
          );
          if (checkKeyMearsureData != undefined) {
            let aCheckMearsureData = aMearsureData.find(
              (item) => item.var == `${data[key]}`
            );
            if (aCheckMearsureData != undefined) {
              oView
                .getModel()
                .setProperty(
                  `/overview/${key}/internal`,
                  aCheckMearsureData.var
                );
              oView
                .getModel()
                .setProperty(
                  `/overview/${key}/external`,
                  aCheckMearsureData.var_name
                );
            }
          }
        }
      },
      getValueDataDisplay: function (data) {
        let oView = this.getView();
        let aMearsureData = oView.getModel("mearsureData").getData().data;
        let keyMearsureData = [
          "objective1",
          "objective2",
          "subjective1",
          "rugsub",
          "subjective2",
        ];
        for (let key in data) {
          // Check status checkbox
          if (`${key}` == "usage_flag" && `${data[key]}` == "X") {
            oView.getModel().setProperty("/value/status/external", true);
            oView.getModel().setProperty("/value/status/internal", "X");
          } else if (`${key}` == "usage_flag" && `${data[key]}` == "") {
            oView.getModel().setProperty("/value/status/external", false);
          }

          // Check comboBox
          if (`${key}` == "logarithm") {
            oView.byId("input_value_logarithm").setSelectedKey(`${data[key]}`);
          }

          // Check pValue and Year
          if (`${key}` == "pValue" || `${key}` == "year") {
            oView.getModel().setProperty(`/value/${key}/internal`, `${data[key]}`);
          }

          // Check another fields with mearsure data
          let checkKeyMearsureData = keyMearsureData.find(
            (item) => item == `${key}`
          );
          if (checkKeyMearsureData != undefined) {
            let aCheckMearsureData = aMearsureData.find(
              (item) => item.var == `${data[key]}`
            );
            if (aCheckMearsureData != undefined) {
              oView
                .getModel()
                .setProperty(`/value/${key}/internal`, aCheckMearsureData.var);
              oView
                .getModel()
                .setProperty(
                  `/value/${key}/external`,
                  aCheckMearsureData.var_name
                );
            }
          }
        }
      },

      /**
       * Get client data from db and compare clientKey match with data in value and get title of clienKey, display data
       */
      getClientDataDisplay: function (columnName, oDataDisplay) {
        let that = this;
        if (columnName == "overview") {
          let aOverviewClient = that
            .getView()
            .getModel("allClient")
            .getData().data;
          let oCheckOverviewClient = aOverviewClient.find(
            (oClient) => oClient.CLIENTKEY == oDataDisplay.client
          );
          if (oCheckOverviewClient != undefined) {
            that
              .getView()
              .getModel()
              .setProperty(
                "/overview/client/internal",
                oCheckOverviewClient.CLIENTKEY
              );
            that
              .getView()
              .getModel()
              .setProperty(
                "/overview/client_item/internal",
                oCheckOverviewClient.CLIENT_ITEM
              );
          }
        } else {
          let aValueClient = that
            .getView()
            .getModel("allClient")
            .getData().data;
          let oCheckValueClient = aValueClient.find(
            (oClient) => oClient.CLIENTKEY == oDataDisplay.client
          );
          if (oCheckValueClient != undefined) {
            that
              .getView()
              .getModel()
              .setProperty(
                "/value/client/internal",
                oCheckValueClient.CLIENTKEY
              );
            that
              .getView()
              .getModel()
              .setProperty(
                "/value/client_item/internal",
                oCheckValueClient.CLIENT_ITEM
              );
          }
        }
      },
      /**
       * Check mark on checkBox and set data to internal data of model
       */
      onSelectCheckbox: function (oEvent) {
        let oView = this.getView();
        let oModel = oView.getModel();
        if (oModel.getData().overview.status.external == true) {
          oModel.setProperty("/overview/status/internal", "X");
        } else {
          oModel.setProperty("/overview/status/internal", "");
        }

        if (oModel.getData().value.status.external == true) {
          oModel.setProperty("/value/status/internal", "X");
        } else {
          oModel.setProperty("/value/status/internal", "");
        }
      },
      /**
       * Fecth data from db, call dialog for mearsureData and set title of dialog
       */
      onOpenMearsureValueHelp: async function (oEvent) {
        let oView = this.getView();
        let that = this;
        await this.fetchMearsureSetModel;
        if (!this._pDialog) {
          this._pDialog = this.loadFragment({
            name: "desg.view.ValueHelp",
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this._pDialog.then(function (oDialog) {
          // Set title for Dialog
          that.setTitleDialog(oEvent, oDialog);
          // Open dialog
          oDialog.open();
        });
      },
      /**
       * Close dialog and get external data to display, set internal data to model
       */
      onConfirmMearsureValueHelp: function (oEvent) {
        let oView = this.getView();
        // reset the filter
        let oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([]);

        let aContexts = oEvent.getParameter("selectedContexts");
        if (aContexts && aContexts.length) {
          let dataConfirm = aContexts.map(function (oContext) {
            return oContext.getObject();
          });
          oView.byId(idInput).setValue(dataConfirm[0].var_name);

          let sPath = oView
            .byId(idInput)
            .mBindingInfos.value.binding.sPath.replace("external", "internal");
          oView.getModel().setProperty(sPath, dataConfirm[0].var);
        }
      },
      /**
       * Fecth data from db, call dialog for clientData of Value Column and set title of dialog
       */
      onOpenOverviewClientValueHelp: async function (oEvent) {
        let oView = this.getView();
        let that = this;
        // fetch client data and set model
        await this.fetchClientSetModel();

        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "desg.view.OverviewClientValueHelp",
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this.pDialog.then(function (oDialog) {
          // Set title for Dialog
          that.setTitleDialog(oEvent, oDialog);
          // Open dialog
          oDialog.open();
        });
      },
      /**
       * Fecth data from db, call dialog for clientData of Value Column and set title of dialog
       */
      onOpenValueClientValueHelp: async function (oEvent) {
        let oView = this.getView();
        let that = this;
        // fetch client data and set model
        await this.fetchClientSetModel();

        if (!this.qDialog) {
          this.qDialog = this.loadFragment({
            name: "desg.view.ValueClientValueHelp",
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            return oDialog;
          });
        }
        this.qDialog.then(function (oDialog) {
          // Set title for Dialog
          that.setTitleDialog(oEvent, oDialog);
          // Open dialog
          oDialog.open();
        });
      },
      /**
       * Close dialog and get external data to display, set internal data to model of Overview Column
       */
      onConfirmOverviewClientValueHelp: function (oEvent) {
        let oView = this.getView();
        // reset the filter
        let oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([]);

        let aContexts = oEvent.getParameter("selectedContexts");
        if (aContexts && aContexts.length) {
          let dataConfirm = aContexts.map(function (oContext) {
            return oContext.getObject();
          });
          oView
            .getModel()
            .setProperty("/overview/client/internal", dataConfirm[0].CLIENTKEY);
          oView
            .getModel()
            .setProperty(
              "/overview/client_item/internal",
              dataConfirm[0].CLIENT_ITEM
            );
        }
      },
      /**
       * Close dialog and get external data to display, set internal data to model of Value Column
       */
      onConfirmValueClientValueHelp: function (oEvent) {
        let oView = this.getView();
        // reset the filter
        let oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([]);

        let aContexts = oEvent.getParameter("selectedContexts");
        if (aContexts && aContexts.length) {
          let dataConfirm = aContexts.map(function (oContext) {
            return oContext.getObject();
          });
          oView
            .getModel()
            .setProperty("/value/client/internal", dataConfirm[0].CLIENTKEY);
          oView
            .getModel()
            .setProperty(
              "/value/client_item/internal",
              dataConfirm[0].CLIENT_ITEM
            );
        }
      },
      /**
       * Search by var column or varname column
       */
      handleMearsureSearch: function (oEvent) {
        let sValue = oEvent.getParameter("value");
        let oFilterVar = new Filter("var", FilterOperator.Contains, sValue);
        let oFilterVarname = new Filter(
          "var_name",
          FilterOperator.Contains,
          sValue
        );
        let oFilter = new Filter([oFilterVar, oFilterVarname], false);
        let oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter(oFilter);
      },
      /**
       * Search by clientKey column or Title column
       */
      handleClientSearch: function (oEvent) {
        let sValue = oEvent.getParameter("value");
        let oFilterClientKey = new Filter(
          "CLIENTKEY",
          FilterOperator.Contains,
          sValue
        );
        let oFilterTitle = new Filter("TITLE", FilterOperator.Contains, sValue);
        let oFilterClientItem = new Filter(
          "CLIENT_ITEM",
          FilterOperator.Contains,
          sValue
        );
        let oFilter = new Filter(
          [oFilterClientKey, oFilterTitle, oFilterClientItem],
          false
        );
        let oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter(oFilter);
      },
      /**
       * Check data if fields is empty or invalid data and set state change color input field if error
       */
      validateEmptyInput: function () {
        let oView = this.getView();
        let that = this;
        let returnError = false;
        let oDataOverview = oView.getModel().getProperty("/overview");
        let oDataValue = oView.getModel().getProperty("/value");
        let aKeyCheckInputOverview = [
          "objective1",
          "subjective1",
          "client",
          "client_item",
          "logarithm",
          "rugsub",
          "subjective2",
          "year",
        ];
        let aKeyCheckInputValue = [
          "objective1",
          "subjective1",
          "client",
          "client_item",
          "logarithm",
          "rugsub",
          "pValue",
          "year",
        ];

        // Check input fields of overview column
        for (let key in oDataOverview) {
          let oCheckEmptyInput = aKeyCheckInputOverview.find(
            (item) => item == key
          );
          if (oCheckEmptyInput != undefined) {
            if (
              (key == "client_item" && oDataOverview[key].internal == "") ||
              (key == "year" && oDataOverview[key].internal == "") ||
              (key == "client" && oDataOverview[key].external == "") ||
              oDataOverview[key].external == ""
            ) {
              that.setStateError("overview", key, "error");
              MessageToast.show("Please input all fields on screen");
              returnError = true;
            } else {
              that.setStateError("overview", key, "None");
            }

            if (key == "logarithm") {
              let selectedKey = that
                .byId("input_overview_logarithm")
                .getSelectedKey();
              if (selectedKey == "") {
                that.setStateError("overview", key, "error");
                MessageToast.show("Please input all fields on screen");
                returnError = true;
              } else {
                that.setStateError("overview", key, "None");
              }
            }
          }
        }

        // Check input fields of value column
        for (let key in oDataValue) {
          let oCheckEmptyInput = aKeyCheckInputValue.find(
            (item) => item == key
          );
          if (oCheckEmptyInput != undefined) {
            if (
              (key == "year" && oDataValue[key].internal == "") ||
              (key == "client" && oDataValue[key].external == "") ||
              (key == "pValue" && oDataValue[key].internal == "") ||
              oDataValue[key].external == ""
            ) {
              that.setStateError("value", key, "error");
              MessageToast.show("Please input all fields on screen");
              returnError = true;
            } else {
              that.setStateError("value", key, "None");
            }

            if (key == "logarithm") {
              let selectedKey = that
                .byId("input_value_logarithm")
                .getSelectedKey();
              if (selectedKey == "") {
                that.setStateError("value", key, "error");
                MessageToast.show("Please input all fields on screen");
                returnError = true;
              } else {
                that.setStateError("value", key, "None");
              }
            }
          }
        }

        // //Check input fields of overview column
        // for (let key in oDataValue) {
        //     let oCheckEmptyInput = aKeyCheckInputValue.find((item) => item == key);
        //     if(oCheckEmptyInput != undefined) {
        //         if (oDataOverview.key == "") {
        //                 that.setStateError("value",key);
        //                 return false;
        //         }
        //     }
        // }
        return returnError;
      },
      validateValueNumber: function (){
        let yearOverview = this.getView().getModel().getProperty("/overview/year/internal");
        let yearValue = this.getView().getModel().getProperty("/value/year/internal");
        let error = false;
        if (parseInt(yearOverview) > 99 || parseInt(yearOverview) < 1) {
          MessageToast.show("Please enter value of year from 1 to 99")
          error = true;
        }else{
          error = false;
        };
        
        if (parseInt(yearValue) > 99 || parseInt(yearValue) < 1) {
          MessageToast.show("Please enter value of year from 1 to 99")
          error = true;
        }else{
          error = false;
        };

        return error;
      },
      setStateError: function (column, key, state) {
        if (state == "error") {
          this.getView()
            .getModel()
            .setProperty(`/${column}/${key}/state`, "Error");
        } else {
          this.getView()
            .getModel()
            .setProperty(`/${column}/${key}/state`, "None");
        }
      },
      /**
       * Get data from model and create structure before post data to db
       */
      setStructureDataBeforeUpdate: function () {
        let dataUpdate = [];
        let oView = this.getView();
        let data = oView.getModel().getData();
        let dataOverviewCbBox = oView
          .byId("input_overview_logarithm")
          .getSelectedKey();
        let dataValueCbBox = oView
          .byId("input_value_logarithm")
          .getSelectedKey();
        dataUpdate = [
          {
            category: "2",
            usage_flag: data.overview.status.internal,
            objective1: data.overview.objective1.internal,
            objective2: "",
            subjective1: data.overview.subjective1.internal,
            logarithm: dataOverviewCbBox,
            rugsub: data.overview.rugsub.internal,
            subjective2: data.overview.subjective2.internal,
            client: data.overview.client.internal,
            client_item: data.overview.client_item.internal,
            pValue: null,
            year: parseInt(data.overview.year.internal),
          },
          {
            category: "1",
            usage_flag: data.value.status.internal,
            objective1: data.value.objective1.internal,
            objective2: data.value.objective2.internal,
            subjective1: data.value.subjective1.internal,
            logarithm: dataValueCbBox,
            rugsub: data.value.rugsub.internal,
            subjective2: "",
            client: data.value.client.internal,
            client_item: data.value.client_item.internal,
            pValue: parseFloat(data.value.pValue.internal),
            year: parseInt(data.value.year.internal),
          },
        ];
        return dataUpdate;
      },
      /**
       * handle after user click button update onscreen, if error show message on screen, if success check data by function onUpdateNewClient
       */
      onUpdatePress: async function (oEvent) {
        let that = this;
        let emptyInput = this.validateEmptyInput();
        if (emptyInput == false) {
          let numberYear = that.validateValueNumber();
          if (numberYear == false) {
            let checkClient = that.validateClient();
            if (checkClient == true) {
              that.updateParam([]);
            }
          }
        }
      },
      updateParam: async function(aNewClient){
        let aData = this.setStructureDataBeforeUpdate();
        let updateData = await Model.upsertParameter(aData, aNewClient);
          if (updateData.error) {
            if (updateData.error.code == "400") {
              MessageToast.show("Update Successfully!")
            } else {
              MessageToast.show("Update no success, please check again!");
            }
          }else{
            MessageToast.show("Update Successfully!")
          }
      },
      onShowConfirmMessageBox: function (title, confirmMessage, callback) {
        MessageBox.confirm(confirmMessage, {
          title: title,
          actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
          onClose: callback,
        });
      },
      fetchClientSetModel: async function () {
        /**
         * Get Client
         */
        let aClient = await Model.getClient();
        if (aClient.error) {
          // fail case
          console.log(aClient.error);
        } else {
          // success
          aClient = aClient.value;

          // Filter array match with condition FLAG .
          let allClient = aClient;
          let aOverviewClient = aClient.filter((item) => item.MATRIX == "O");
          let aValueClient = aClient.filter((item) => item.CHART == "O");

          // Structure array client
          let strucOverviewClient = {
            data: aOverviewClient,
          };

          let strucValueClient = {
            data: aValueClient,
          };

          let strucAllClient= {
            data: allClient,
          }
          // Create JSONModel and create 2 model for overview and value.
          let overviewClientModel = new JSONModel(strucOverviewClient);
          this.getView().setModel(overviewClientModel, "overviewClient");

          let valueClientModel = new JSONModel(strucValueClient);
          this.getView().setModel(valueClientModel, "valueClient");

          let AllClientModel = new JSONModel(strucAllClient);
          this.getView().setModel(AllClientModel, "allClient");
        }
      },
      fetchMearsureSetModel: async function () {
        /**
         * Get Measure Master Data
         */
        let aMeasureMaster = await Model.getMeasureMaster();
        let mearsureMaster = [];
        if (aMeasureMaster.error) {
          // fail case
          console.log(aMeasureMaster.error);
        } else {
          // success
          mearsureMaster = aMeasureMaster.value;

          let strucMearsureData = {
            data: mearsureMaster,
          };

          let oMearsureModel = new JSONModel(strucMearsureData);
          this.getView().setModel(oMearsureModel, "mearsureData");
        }
      },

      /**
       * validate and Notify if user want to create new client  in db
       * 1st case: User choose existed client/client-item in both column --> No new client created
       * 2nd case: Create new overview client/client_item and reuse relevance client --> 1 new client created
       * 3rd case: Reuse overview client&client_item and create new relevance client --> 1 new client created (client_item = "TESTING")
       * 4th case: Both overview & relevance client newly created
       * --> If both client have the same name --> 1 new client created (client_item = overview client_item)
       * --> Else --> 2 new clients created
       *
       */
      validateClient: function () {
        const oModel = this.getView().getModel();
        const that = this;
        const sOverviewClient = oModel.getProperty("/overview/client/internal");
        const sOverviewClientItem = oModel.getProperty(
          "/overview/client_item/internal"
        );
        const sValueClient = oModel.getProperty("/value/client/internal");
        this.fetchClientSetModel();
        const oOverviewClientData = this.getView()
          .getModel("allClient")
          .getProperty("/data");
        const oValueClientData = this.getView()
          .getModel("allClient")
          .getProperty("/data");
        this.aNewClient = [];
        const oMappingOverviewClient = oOverviewClientData.find(
          (oClient) => oClient.CLIENTKEY == sOverviewClient
        );
        const oMappingOverviewClientItem = oOverviewClientData.find(
          (oClient) => oClient.CLIENT_ITEM == sOverviewClientItem
        );
        const oMappingValueClient = oValueClientData.find(
          (oClient) => oClient.CLIENTKEY == sValueClient
        );
        if (
          oMappingOverviewClient &&
          oMappingOverviewClientItem &&
          oMappingValueClient
        ) {
          // 1st case
          return true;
        } else {
          const sTitle = "Confirm";
          let sMessage = "Are you sure to create new client: ";
          let fnCallback;
          if (oMappingValueClient) {
            // 2nd case
            sMessage += `${sOverviewClient} - ${sOverviewClientItem}`;
            fnCallback = function (oAction) {
              if (oAction == "YES") {
                this.aNewClient.push({
                  CLIENTKEY: sOverviewClient,
                  CLIENT_ITEM: sOverviewClientItem,
                  TITLE: sOverviewClient,
                });

                if (oMappingOverviewClient == undefined) {
                  oModel.setProperty("/overview/client/internal", sOverviewClient);
                }
                that.updateParam(this.aNewClient);
              } else {
                this.aNewClient = undefined;
              }
            }.bind(this);
          } else if (oMappingOverviewClient && oMappingOverviewClientItem) {
            // 3rd case
            sMessage += `${sValueClient} - TESTING`;
            fnCallback = function (oAction) {
              if (oAction == "YES") {
                this.aNewClient.push({
                  CLIENTKEY: sValueClient,
                  CLIENT_ITEM: "TESTING",
                  TITLE: sValueClient,
                });
                oModel.setProperty("/value/client_item/internal", "TESTING");
                oModel.setProperty("/value/client/internal", sValueClient);
                that.updateParam(this.aNewClient);
              } else {
                this.aNewClient = undefined;
              }
            }.bind(this);
          } else if (sOverviewClient == sValueClient) {
            // 4th case - overview client == relevance client gán internal client = external, client_item = internal
            sMessage += `${sOverviewClient} - ${sOverviewClientItem}`;
            fnCallback = function (oAction) {
              if (oAction == "YES") {
                this.aNewClient.push({
                  CLIENTKEY: sOverviewClient,
                  CLIENT_ITEM: sOverviewClientItem,
                  TITLE: sOverviewClient,
                });
                let client_item = oModel.getProperty("/overview/client_item/internal");
                oModel.setProperty("/overview/client/internal", sOverviewClient);
                oModel.setProperty("/value/client_item/internal", client_item);
                oModel.setProperty("/value/client/internal", sValueClient);
                that.updateParam(this.aNewClient);
              } else {
                this.aNewClient = undefined;
              }
            }.bind(this);
          } else {
            // 4th case - overview client !== relevance client gán client external = interanl, gán 
            sMessage += `${sOverviewClient} - ${sOverviewClientItem} and ${sValueClient} - TESTING`;
            fnCallback = function (oAction) {
              if (oAction == "YES") {
                this.aNewClient.push({
                  CLIENTKEY: sOverviewClient,
                  CLIENT_ITEM: sOverviewClientItem,
                  TITLE: sOverviewClient,
                });
                this.aNewClient.push({
                  CLIENTKEY: sValueClient,
                  CLIENT_ITEM: "TESTING",
                  TITLE: sValueClient,
                });
                oModel.setProperty("/overview/client/internal", sOverviewClient);
                oModel.setProperty("/value/client/internal", sValueClient);
                oModel.setProperty("/value/client_item/internal", "TESTING");
                that.updateParam(this.aNewClient);
              } else {
                this.aNewClient = undefined;
              }
            }.bind(this);
          }
          this.onShowConfirmMessageBox(sTitle, sMessage, fnCallback);
          console.log(this.aNewClient);
          return false;
        }
      },

      setModelLogarithm: function () {
        let dataLog = {
          value: [
            {
              key: 1,
              text: "Yes",
            },
            {
              key: 0,
              text: "No",
            },
          ],
        };

        // Create model logarithmCollections for comboBox logarithm input field
        const dataCbBox = new JSONModel(dataLog);
        this.getView().setModel(dataCbBox, "logarithmCollections");
      },
      setModelInputField: function () {
        let statusInput = {
          overview: {
            status: {
              internal: "",
              external: false,
              state: "None",
            },
            objective1: {
              internal: "",
              external: "",
              state: "None",
            },
            objective2: {
              internal: "",
              external: "",
              state: "None",
            },
            subjective1: {
              internal: "",
              external: "",
              state: "None",
            },
            logarithm: {
              state: "None",
            },
            rugsub: {
              internal: "",
              external: "",
              state: "None",
            },
            subjective2: {
              internal: "",
              external: "",
              state: "None",
            },
            client: {
              internal: "",
              state: "None",
            },
            client_item: {
              internal: "",
            },
            pValue: {
              internal: "",
              state: "None",
            },
            year: {
              internal: "",
              state: "None",
            },
          },
          value: {
            status: {
              internal: "",
              external: false,
              state: "None",
            },
            objective1: {
              internal: "",
              external: "",
              state: "None",
            },
            objective2: {
              internal: "",
              external: "",
              state: "None",
            },
            subjective1: {
              internal: "",
              external: "",
              state: "None",
            },
            logarithm: {
              state: "None",
            },
            rugsub: {
              internal: "",
              external: "",
              state: "None",
            },
            subjective2: {
              internal: "",
              external: "",
              state: "None",
            },
            client: {
              internal: "",
              state: "None",
            },
            client_item: {
              internal: "",
            },
            pValue: {
              internal: "",
              state: "None",
            },
            year: {
              internal: "",
              state: "None",
            },
          },
        };

        // set model for all input fields on screen
        const oInputModel = new JSONModel(statusInput);
        this.getView().setModel(oInputModel);
      },
      getIdInputClicked: function (oEvent) {
        idInput = oEvent.getParameters().id;
        let shortIdInput = idInput
          .replace("container-desg---Main--", "")
          .split("_");
        return shortIdInput;
      },
      setTitleDialog: function (oEvent, oDialog) {
        let idColumn = this.getIdInputClicked(oEvent);
        let idTitle = "";
        if (idColumn.length > 3) {
          idTitle = `title_${idColumn[2]}_${idColumn[3]}`;
        } else {
          idTitle = "title_" + idColumn[2];
        }
        let getText = document.getElementById(
          "container-desg---Main--" + idTitle
        );
        oDialog.setTitle(getText.innerText);
      },
    });
  }
);
