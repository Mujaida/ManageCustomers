sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, MessageBox, Message, library, Fragment, Filter, FilterOperator) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = library.ValueState;

    // shortcut for sap.ui.core.MessageType
    var MessageType = library.MessageType;

    return Controller.extend("iffco.managecustomer.controller.view2", {
      onInit: function () {
        var oMessageManager, oModel, oView;

        oView = this.getView();
        // set message model
        oMessageManager = sap.ui.getCore().getMessageManager();
        oView.setModel(oMessageManager.getMessageModel(), "message");

        var oRouter = this.getOwnerComponent().getRouter();
        oRouter
          .getRoute("CustomerDetail")
          .attachPatternMatched(this._onRouteMatched, this);
        // new sap.m.BusyDialog().close();
        // this.getView().setModel(new sap.ui.model.json.JSONModel([]), "salesModel")
        new sap.m.BusyDialog().close();
        this.flagForFirstTime = true;
        // this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel([]), "commentsModel");

        if (!this.currency) {
          this.currency = new sap.ui.xmlfragment(
            "iffco.managecustomer.fragments.Currency",
            this
          );
          this.getView().addDependent(this.currency);
        }

        if (!this.Incoterms) {
          this.Incoterms = new sap.ui.xmlfragment(
            "iffco.managecustomer.fragments.Incoterms",
            this
          );
          this.getView().addDependent(this.Incoterms);
        }
      },
      _onRouteMatched: function (oEvent) {
        this.busyDialog = new sap.m.BusyDialog();
        this.busyDialog.close();
        this.zcustomer_legal_name = oEvent.getParameters().arguments.zcustomer_legal_name;
        this.businessPartnerId = oEvent.getParameters().arguments.zbusinessPartnerId;
        this.mode = oEvent.getParameters().arguments.mode;
        this.getView().getModel("appView").setProperty("/mode", this.mode);

        // if(this.mode === "edit"){
        this.bpg = oEvent.getParameters().arguments.bpg ? oEvent.getParameters().arguments.bpg : this.getView().getModel("appView").getProperty("/bpg");
        this.getView().getModel("appView").setProperty("/bpg", this.bpg);
        this.zsales_orgnization = oEvent.getParameters().arguments.zsales_orgnization ? oEvent.getParameters().arguments.zsales_orgnization : "";
        this.zcustomer_num = oEvent.getParameters().arguments.zcustomer_num;
        this.uPath = "/ZDD_CUSTOMER(zcustomer_num=guid'" + this.zcustomer_num + "',zsales_orgnization='" + this.zsales_orgnization + "')";
        // }
        var serviceURL =
          this.getOwnerComponent().getModel("S4D111").sServiceUrl;
        var oModel = new sap.ui.model.odata.ODataModel(serviceURL, true);
        this.busyDialog.open();

        this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel([]), "commentsModel");
        // this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel([]), "salesModel");
        this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel([]), "creditSegmentModel");
        this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel([]), "dmsModel");
        this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel([]), "attachmentsModel");

        this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel([]), "salesDataModel");
        // this.getOwnerComponent().getModel("salesModel").oData = [];

        if (oEvent.getParameters().arguments.zprocess === 'CHANGE') {
          this.evtProcessExt = 'Change Customer';
        } else if (oEvent.getParameters().arguments.zprocess === 'Change Customer') {
          this.evtProcessExt = 'Change Customer';
        } else if (oEvent.getParameters().arguments.zprocess === 'EXTEND') {
          this.evtProcessExt = 'Extend Customer';
        } else {
          this.evtProcessExt = 'Extend Customer';
        }


        if (oEvent.getParameters().arguments.zprocess === 'Change Customer') {
          this.evtProcess = 'CHANGE';
        } else if (oEvent.getParameters().arguments.zprocess === 'Extend Customer') {
          this.evtProcess = 'EXTEND';
        } else {
          this.evtProcess = oEvent.getParameters().arguments.zprocess;
        }

        this.extendExistingCustomerSet();
        this.busyDialog.close();
        if (this.flagForFirstTime) {
          window.setTimeout(
            function () {
              this.handleRuleEngineConfiguration();
            }.bind(this),
            2000
          );
        }
        else {
          this.handleRuleEngineConfiguration();
        }
        this.getView()
          .getModel("appView")
          .setProperty("/reqType", oEvent.getParameters().arguments.zprocess);
        this.handleHistory();

        // this.getDmsData();
      },

      getDmsData: function (evt) {
        var serviceURL = this.getOwnerComponent().getModel("DMS").sServiceUrl;
        var oModel = new sap.ui.model.odata.ODataModel(serviceURL, true);
        var path = "/GetAllOriginals?LinkedSAPObjectKey='" + this.getView().getModel("Customers").getData().zcustomer_num
          + "'&BusinessObjectTypeName='" + "KNA1" + "";

        console.log(path);
        path = path.replaceAll("KNA1", "KNA1%27");

        oModel.read(path, {
          success: function (oData, oResponse) {
            var attachmentsItem = this.getOwnerComponent().getModel("attachmentsModel").getData();

            for (var i = 0; i < oData.results.length; i++) {
              attachmentsItem.push({
                "FieldName": oData.results[i].FileName.split("_")[0],
                "FileName": oData.results[i].FileName.split("_")[1],
                "DocumentInfoRecordDocType": oData.results[i].DocumentInfoRecordDocType,
                "DocumentInfoRecordDocNumber": oData.results[i].DocumentInfoRecordDocNumber,
                "ArchiveDocumentID": oData.results[i].ArchiveDocumentID,
                "LinkedSAPObjectKey": oData.results[i].LinkedSAPObjectKey,
                "BusinessObjectTypeName": oData.results[i].BusinessObjectTypeName,
                "MimeType": oData.results[i].MimeType,
                "LogicalDocument": oData.results[i].LogicalDocument,
                "DocumentInfoRecordDocVersion": oData.results[i].DocumentInfoRecordDocVersion,
                "DocumentInfoRecordDocPart": oData.results[i].DocumentInfoRecordDocPart,
                "Flag": "U",
              });
            }
            this.getOwnerComponent().getModel("attachmentsModel").updateBindings(true);

            var flatObj = {};
            oData.results.forEach(function (obj) {
              var sField = "";
              sField += obj.FileName.split("_")[0];
              flatObj[sField] = obj.FileName.split("_")[1];
            })
            console.log(flatObj);
            this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({}), "getDmsModel");
            this.getView().getModel("getDmsModel").oData = flatObj;
            this.getView().getModel("getDmsModel").updateBindings(true);
            console.log(oData);
          }.bind(this), error: function (err) {

          }
        });
      },


      handleHistory: function (evt) {
        var oModel = this.getOwnerComponent().getModel();
        oModel.read("/ZDD_REQ_HISTORY", {
          filters: [
            new sap.ui.model.Filter("zrequest_no", "EQ", this.requestNo),
          ],
          success: function (oData, oResponse) {
            //   console.log(oData);
            var arr = [];
            for (var i = 0; i < oData.results.length; i++) {
              arr.push({
                "srno": oData.results[i].srno,
                "zrequest_no": oData.results[i].zrequest_no,
                "zpending_with": oData.results[i].zpending_with,
                "ztrail_role": oData.results[i].ztrail_role,
                "ztrail_status": oData.results[i].ztrail_status,
                "ztrail_tot_cl_approved": oData.results[i].ztrail_tot_cl_approved,
                "ztrailmax_credit_days": oData.results[i].ztrailmax_credit_days,
                "ztrail_version": oData.results[i].ztrail_version,
                "ztrail_remarks": oData.results[i].ztrail_remarks
              })
            }
            this.getView().setModel(new sap.ui.model.json.JSONModel([]), "historyModel");
            this.getView().getModel("historyModel").oData = arr;
            this.getView().getModel("historyModel").updateBindings(true);
          }.bind(this),
          error: function (error) { },
        });
      },
      extendExistingCustomerSet: function () {
        var oModel = this.getOwnerComponent().getModel();
        this.sPath = "/ZDD_CUSTOMER";
        this.getView().getModel("Customers").updateBindings(true);
        //   var filters = [];
        // if(this.mode === 'edit' && this.evtProcess === 'CHANGE'){
        //   filters.push(new sap.ui.model.Filter("zbusiness_partner_id", "EQ", this.businessPartnerId));
        //   filters.push(new sap.ui.model.Filter("zrequest_type", "EQ", this.evtProcessExt));
        // }else if(this.mode === 'edit' && this.evtProcess === 'EXTEND'){
        //   filters.push(new sap.ui.model.Filter("zbusiness_partner_id", "EQ", this.businessPartnerId));
        //   filters.push(new sap.ui.model.Filter("zrequest_type", "EQ", this.evtProcessExt));
        // }else{
        //   filters.push(new sap.ui.model.Filter("zbusiness_partner_id", "EQ", this.businessPartnerId));
        // }



        // this.sPath = "/ZDD_CUSTOMER(zcustomer_num=guid'" + this.getView().getModel("Customers").getData().zcustomer_num + "',zsales_orgnization='" + this.getView().getModel("Customers").getData().zsales_orgnization + "')"
        oModel.read(this.sPath, {
          // filters: filters,
          filters: [
            new sap.ui.model.Filter("zbusiness_partner_id", "EQ", this.businessPartnerId),
          ],
          urlParameters: {
            "$expand": "to_salesarea,to_comments,to_credit"
          },
          success: function (oData, oResponse) {
            if (oData.results.length > 0) {
              oData.results.sort((a, b) => b.zcreated_date - a.zcreated_date);
              for (var i = 0; i < oData.results.length; i++) {
                delete oData.results[i].__metadata;
                delete oData.results[i].to_zdd_comments;
                delete oData.results[i].to_zdd_sale;

                console.log(oData);
                var oCustomerDetailModel = this.getView().getModel("Customers");
                delete oData.__metadata;
                delete oData.to_zdd_comments;


                var salesItem = this.getOwnerComponent().getModel("salesDataModel").getData();
                var listItem = this.getOwnerComponent().getModel("commentsModel").getData();
                var creditSegmentItem = this.getOwnerComponent().getModel("creditSegmentModel").getData();

                if (oData.results[i].to_comments.results.length > 0) {
                  for (var j = 0; j < oData.results[i].to_comments.results.length; j++) {
                    delete oData.results[i].to_comments.results[j].__metadata;
                    listItem.push({
                      "zcomment": oData.results[i].to_comments.results[j].zcomment,
                      "zcustomer_num": oData.results[i].to_comments.results[j].zcustomer_num,
                      "Flag": "U",
                      "createdat": oData.results[i].to_comments.results[j].createdat,
                      "createdby": oData.results[i].to_comments.results[j].createdby,

                    });
                  }
                  this.getOwnerComponent().getModel("commentsModel").updateBindings(true);
                }
                if (oData.results[i].to_salesarea.results.length > 0) {
                  // for (var k = 0; k < oData.results[i].to_salesarea.results.length; k++) {
                    // delete oData.results[i].to_salesarea.results[k].__metadata;
                    // salesItem.push({
                    //   "zsales_area_id": oData.results[i].to_salesarea.results[k].zsales_area_id,
                    //   "zcustomer_num": oData.results[i].to_salesarea.results[k].zcustomer_num,
                    //   "Flag": "U",
                    //   "zdistribution_channel": oData.results[i].to_salesarea.results[k].zdistribution_channel,
                    //   "zdistribution_channel_text": oData.results[i].to_salesarea.results[k].zdistribution_channel_text,
                    //   "zdivision": oData.results[i].to_salesarea.results[k].zdivision,
                    //   "zdivision_text": oData.results[i].to_salesarea.results[k].zdivision_text,
                    //   "zsales_orgnization": oData.results[i].to_salesarea.results[k].zsales_orgnization,
                    //   "zsales_orgnization_text": oData.results[i].to_salesarea.results[k].zsales_orgnization_text

                    // });

                    for (var k = 0; k < oData.results[i].to_salesarea.results.length; k++) {
                      delete oData.results[i].to_salesarea.results[k].__metadata;
                      salesItem.push({
                          "zsales_area_id": oData.results[i].to_salesarea.results[k].zsales_area_id,
                          "zcustomer_num": oData.results[i].to_salesarea.results[k].zcustomer_num,
                          "Flag": "U",
                          "zdistribution_channel": oData.results[i].to_salesarea.results[k].zdistribution_channel,
                          "zdistribution_channel_text": oData.results[i].to_salesarea.results[k].zdistribution_channel_text,
                          "zdivision": oData.results[i].to_salesarea.results[k].zdivision,
                          "zdivision_text": oData.results[i].to_salesarea.results[k].zdivision_text,
                          "zsales_orgnization": oData.results[i].to_salesarea.results[k].zsales_orgnization,
                          "zsales_orgnization_text": oData.results[i].to_salesarea.results[k].zsales_orgnization_text,
                          "zsettlement_group": oData.results[i].to_salesarea.results[k].zsettlement_group,
                          "zaccount_assignment_group": oData.results[i].to_salesarea.results[k].zaccount_assignment_group,
                          "zagency_business": oData.results[i].to_salesarea.results[k].zagency_business,
                          "zdocument_index_active": oData.results[i].to_salesarea.results[k].zdocument_index_active,
                          "zmanual_invoice_maintenance": oData.results[i].to_salesarea.results[k].zmanual_invoice_maintenance,
                          "zrebate": oData.results[i].to_salesarea.results[k].zrebate,
                          "zpricing": oData.results[i].to_salesarea.results[k].zpricing,
                          "zinvoicing_dates": oData.results[i].to_salesarea.results[k].zinvoicing_dates,
                          "zinvoicing_list_dates": oData.results[i].to_salesarea.results[k].zinvoicing_list_dates,
                          "zcustomer_group1": oData.results[i].to_salesarea.results[k].zcustomer_group1,
                          "zcustomer_group2": oData.results[i].to_salesarea.results[k].zcustomer_group2,
                          "zcustomer_group3": oData.results[i].to_salesarea.results[k].zcustomer_group3,
                          "zcustomer_group4": oData.results[i].to_salesarea.results[k].zcustomer_group4,
                          "zcustomer_group5": oData.results[i].to_salesarea.results[k].zcustomer_group5,
                          "zcustomer_group": oData.results[i].to_salesarea.results[k].zcustomer_group,
                          "zinco_term": oData.results[i].to_salesarea.results[k].zinco_term,
                          "zinco_location1": oData.results[i].to_salesarea.results[k].zinco_location1,
                          "zpayment_terms": oData.results[i].to_salesarea.results[k].zpayment_terms,
                          "zcredit_control_area": oData.results[i].to_salesarea.results[k].zcredit_control_area,
                          "zpayment_gurantee_procedure": oData.results[i].to_salesarea.results[k].zpayment_gurantee_procedure,
                          "zcomplete_delivery": oData.results[i].to_salesarea.results[k].zcomplete_delivery,
                          "zmaximum_number_of_part_delive": oData.results[i].to_salesarea.results[k].zmaximum_number_of_part_delive,
                          "zpartial_delivery_per_item": oData.results[i].to_salesarea.results[k].zpartial_delivery_per_item,
                          "zunlimited_tolerance": oData.results[i].to_salesarea.results[k].zunlimited_tolerance,
                          "zunder_delivery_tolerance": oData.results[i].to_salesarea.results[k].zunder_delivery_tolerance,
                          "zover_delivery_tolerance": oData.results[i].to_salesarea.results[k].zover_delivery_tolerance,
                          "zbill_to_buyer": oData.results[i].to_salesarea.results[k].zbill_to_buyer,
                          "zonly_ship_to": oData.results[i].to_salesarea.results[k].zonly_ship_to,
                          "zsales_person": oData.results[i].to_salesarea.results[k].zsales_person,
                          "zagent": oData.results[i].to_salesarea.results[k].zagent,
                          "zprice_group": oData.results[i].to_salesarea.results[k].zprice_group,
                          "zpricelist": oData.results[i].to_salesarea.results[k].zpricelist,
                          "zprice_procedured_term": oData.results[i].to_salesarea.results[k].zprice_procedured_term,
                          "zcustomer_statistics_group": oData.results[i].to_salesarea.results[k].zcustomer_statistics_group,
                          "zsales_district": oData.results[i].to_salesarea.results[k].zsales_district,
                          "zsales_office": oData.results[i].to_salesarea.results[k].zsales_office,
                          "zsales_group": oData.results[i].to_salesarea.results[k].zsales_group,
                          "zabc_class": oData.results[i].to_salesarea.results[k].zabc_class,
                          "zcurrency": oData.results[i].to_salesarea.results[k].zcurrency,
                          "zaccount_at_customer": oData.results[i].to_salesarea.results[k].zaccount_at_customer,
                          "zswitch_off_rounding": oData.results[i].to_salesarea.results[k].zswitch_off_rounding,
                          "zorderprobability": oData.results[i].to_salesarea.results[k].zorderprobability,
                          "zauthorization_group": oData.results[i].to_salesarea.results[k].zauthorization_group,
                          "zitemproposal": oData.results[i].to_salesarea.results[k].zitemproposal,
                          "zunit_of_measure_group": oData.results[i].to_salesarea.results[k].zunit_of_measure_group,
                          "zexchange_rate_type": oData.results[i].to_salesarea.results[k].zexchange_rate_type,
                          "zpp_customer_procedure": oData.results[i].to_salesarea.results[k].zpp_customer_procedure,
                          "zshipping_conditions": oData.results[i].to_salesarea.results[k].zshipping_conditions,
                          "zdelivery_plant": oData.results[i].to_salesarea.results[k].zdelivery_plant,
                          "zdelivery_priority": oData.results[i].to_salesarea.results[k].zdelivery_priority,
                          "zorder_combination": oData.results[i].to_salesarea.results[k].zorder_combination,
                          "zrelevant_pod": oData.results[i].to_salesarea.results[k].zrelevant_pod,
                          "zpod_timeframe": oData.results[i].to_salesarea.results[k].zpod_timeframe,
                          "zcountry": oData.results[i].to_salesarea.results[k].zcountry,
                          "ztaxcategory": oData.results[i].to_salesarea.results[k].ztaxcategory,
                          "ztax_classification": oData.results[i].to_salesarea.results[k].ztax_classification,
                          "ztax_category2": oData.results[i].to_salesarea.results[k].ztax_category2,
                          "ztax_classification2": oData.results[i].to_salesarea.results[k].ztax_classification2
                          

                      });
                  }
                  this.getOwnerComponent().getModel("salesDataModel").updateBindings(true);
                  // }

                  // this.getOwnerComponent().getModel("salesModel").updateBindings(true);
                }

                if (oData.results[0].to_credit.results.length > 0) {

                  for (var l = 0; l < oData.results[i].to_credit.results.length; l++) {
                    delete oData.results[i].to_credit.results[l].__metadata;
                    creditSegmentItem.push({
                      "zcredit_id": oData.results[i].to_credit.results[l].zcredit_id,
                      "zcustomer_num": oData.results[i].to_credit.results[l].zcustomer_num,
                      "Flag": "U",
                      "zinfo_type": oData.results[i].to_credit.results[l].zinfo_type,
                      "zname_of_type": oData.results[i].to_credit.results[l].zname_of_type,
                      "zrelevant": oData.results[i].to_credit.results[l].zrelevant === "" ? false : true,
                      "zindividual_step": oData.results[i].to_credit.results[l].zindividual_step,
                      "zcredit_amount": oData.results[i].to_credit.results[l].zcredit_amount,
                      "zcredit_curr": oData.results[i].to_credit.results[l].zcredit_curr,
                      "zdate_from": oData.results[i].to_credit.results[l].zdate_from,
                      "zdate_to": oData.results[i].to_credit.results[l].zdate_to,
                      "zentered_on": oData.results[i].to_credit.results[l].zentered_on,
                      "zdeleted_on": oData.results[i].to_credit.results[l].zdeleted_on,
                      "zresubmission_date": oData.results[i].to_credit.results[l].zresubmission_date,
                      "ztext_field": oData.results[i].to_credit.results[l].ztext_field,

                    });
                  }
                  this.getOwnerComponent().getModel("creditSegmentModel").updateBindings(true);
                }

                oCustomerDetailModel.setData(oData.results[i]);
                this.getView().getModel("appView").setProperty("/status", oData.results[i].zrequest_status);
                oCustomerDetailModel.refresh();
                this.getDmsData();
                break;
              }
            }
          }.bind(this),
          error: function (error) { },
        });

      },
      handleRuleEngineConfiguration: function (oEvent) {
        console.log("ty");
        if (this.evtProcess === 'Change Customer') {
          var process = 'CHANGE';
        } else if (this.evtProcess === 'Extend Customer') {
          var process = 'EXTEND';
        } else {
          var process = this.evtProcess;
        }
        this.getView().getModel("appView").setProperty("/process", this.evtProcess);
        // var process = "CREATE";
        var sCustomerType = this.getView().getModel("appView").getProperty("/vertical") === 'Cash' ? 'Cash' : 'Credit';
        // var sCustomerType = "Credit"
        // var sCustomerType = this.getView().byId("orderdata").getParent().getSubSections()[0].getBlocks()[0].getAggregation("_views")[0].getContent()[0].getContent()[5].getSelectedButton().getText();
        // var sBPGrouping = this.getView()
        //   .byId("orderdata")
        //   .getParent()
        //   .getSubSections()[1]
        //   .getBlocks()[0]
        //   .getAggregation("_views")[0]
        //   .getContent()[0]
        //   .getContent()[1]
        //   .getSelectedItem()
        //   .getText();
        // var sBPGrouping = "Ship To"
        if (this.getView().getModel("appView").getProperty("/bpg") === "Sold") {
          var sBPGrouping = "Sold To";
        } else if (this.getView().getModel("appView").getProperty("/bpg") === "Ship") {
          var sBPGrouping = "Ship To";
        } else if (this.getView().getModel("appView").getProperty("/bpg") === "One") {
          var sBPGrouping = "One";
        } else if (this.getView().getModel("appView").getProperty("/bpg") === "Inte") {
          var sBPGrouping = "Inte";
        } else {
          var sBPGrouping = this.getView().getModel("appView").getProperty("/bpg");
        }


        // var sBPGrouping = this.getView().byId("orderdata").getParent().getSubSections()[1].getBlocks()[0].getAggregation("_views")[0].getContent()[0].getContent()[1].getSelectedItem().getText();
        this.ruleId = "";
        if (process !== "" && sCustomerType !== "" && sBPGrouping !== "") {
          var oModel = this.getView().getModel("RuleEngine");
          oModel.read("/Zdd_rule_engine", {
            urlParameters: {
              $top: 10000,
            },
            success: function (oData, oResponse) {
              for (var i = 0; i < oData.results.length; i++) {
                if (
                  oData.results[i].process === process &&
                  oData.results[i].customer_type ===
                  sCustomerType.toUpperCase() &&
                  oData.results[i].zbusiness_partner_id ===
                  sBPGrouping.toUpperCase()
                ) {
                  this.ruleId = oData.results[i].rule_id;
                  console.log(this.ruleId);
                }
              }

              if (this.ruleId == "" || this.ruleId == undefined) {
                MessageBox.confirm(
                  "Rule engine Configuration does not exist for the selected keys?",
                  {
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function (sAction) {
                      if (sAction === "CANCEL") {
                        oFilterBar
                          .getFilterItems()[1]
                          .getControl()
                          .setSelectedItem(null);
                      } else {
                        this.onCreate(process, sCustomerType, sBPGrouping);
                      }
                    }.bind(this),
                  }
                );
              } else {
                this.onRead(this.ruleId);
              }
            }.bind(this),
            error: function (oError) { },
          });
        }
      },
      onRead: function (ruleid) {
        var oModel = this.getView().getModel("RuleEngine");
        this.getView().setBusy(true);
        oModel.read("/ZDD_RULE_UPDATE_FIELDS", {
          filters: [new sap.ui.model.Filter("rule_id", "EQ", ruleid)],
          urlParameters: {
            $top: 10000,
          },

          success: function (oData, oResponse) {
            console.log(oData.results);
            var flatObj = {};
            oData.results.forEach(function (obj) {
              var sField = "";
              var rField = "";
              sField += obj.fieldname.split(" ").join("");
              rField += obj.fieldname.split(" ").join("");

              // if(obj.visibility){
              sField += "Visible";
              if (obj.visibility === "Y") {
                flatObj[sField] = true;
              } else {
                flatObj[sField] = false;
              }
              // }
              // if(obj.mandatory){
              rField += "Mandatory";
              if (obj.mandatory === "Y") {
                flatObj[rField] = true;
              } else {
                flatObj[rField] = false;
              }
              // }
            });
            console.log(flatObj);
            this.getOwnerComponent().setModel(
              new sap.ui.model.json.JSONModel({}),
              "fieldMappingModels"
            );

            this.getView().getModel("fieldMappingModels").oData = flatObj;
            this.getView().getModel("fieldMappingModels").updateBindings(true);
            console.log(this.getView().getModel("fieldMappingModels").oData);

            this.getView().setBusy(false);

          }.bind(this),
          error: function (oError) {
            // this.busyDialog.close();
            this.getView().setBusy(false);
          }.bind(this),
        });
      },

      onDescriptionSelect: function (oEvent) {
        var oCustomerDetailModel = this.getView().getModel("Customers");
        oCustomerDetailModel.setProperty(
          "/zdescription",
          oEvent.getParameters().selectedIndex
        );
      },


      submitRequest: function () {
        var that = this;
        var validFromState = this.getView()
          .byId("orderData193")
          .getAggregation("_views")
          ? this.getView()
            .byId("orderData193")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[5]
            .getValueState()
          : "Success";
        var validToState = this.getView()
          .byId("orderData193")
          .getAggregation("_views")
          ? this.getView()
            .byId("orderData193")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[7]
            .getValueState()
          : "Success";
        var emailState = this.getView()
          .byId("orderData8")
          .getAggregation("_views")
          ? this.getView()
            .byId("orderData8")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[14]
            .getValueState()
          : "Success";

        if (
          emailState !== "Error" &&
          validFromState !== "Error" &&
          validToState !== "Error"
        ) {
          var state = this.handleValidateFormFields();
          if (state == true) {
            var oModel = this.getView().getModel();
            var oCustomerDetailModel = this.getView().getModel("Customers");
            delete oCustomerDetailModel.getData().to_zdd_sale;
            delete oCustomerDetailModel.getData().to_zdd_comments;
            var oEntry = oCustomerDetailModel.getData();

            // if(this.mode === "edit"){
            this.reqNumber = oEntry.zrequest_no;
            oEntry.zrequest_type =
              this.getView().getModel("appView").getProperty("/reqType") ==
                "CHANGE"
                ? "Change Customer"
                : "Extend Customer";
            //  oEntry.zrequest_type = "Change Customer";
            oEntry.zrequest_status = "In Progress";
            oEntry.zcredit_limit_type =
              this.getView()
                .getModel("appView")
                .getProperty("/selectedType") === 0
                ? "Secured Credit"
                : "UnSecured Credit";
            if (
              this.getView()
                .byId("CreditProfileSection2")
                .getAggregation("_views") !== null
            ) {
              oEntry.zblockedincm = this.getView()
                .byId("CreditProfileSection2")
                .getAggregation("_views")[0]
                .getContent()[0]
                .getContent()[1]
                .getSelected()
                ? "Y"
                : "N";
              oEntry.zspecialattention = this.getView()
                .byId("CreditProfileSection2")
                .getAggregation("_views")[0]
                .getContent()[0]
                .getContent()[3]
                .getSelected()
                ? "Y"
                : "N";
            }

            oEntry.zdescription = this.getView()
              .getModel("appView")
              .getProperty("/custType");

            oEntry.zblock_reason =
              this.getView()
                .byId("CreditProfileSection2")
                .getAggregation("_views") !== null
                ? this.getView()
                  .byId("CreditProfileSection2")
                  .getAggregation("_views")[0]
                  .getContent()[0]
                  .getContent()[5]
                  .getValue()
                  .split(" - ")[0]
                : "";

            if (
              this.getView()
                .byId("CreditProfileSection4")
                .getAggregation("_views") !== null
            ) {
              oEntry.zdata_outdated = this.getView()
                .byId("CreditProfileSection4")
                .getAggregation("_views")[0]
                .getContent()[0]
                .getContent()[2]
                .getSelected()
                ? "Y"
                : "N";
            }
            if (
              this.getView()
                .byId("salesAreadata15")
                .getAggregation("_views") !== null
            ) {
              oEntry.zcredit_control_area = this.getView()
                .byId("salesAreadata15")
                .getAggregation("_views")[0]
                .getContent()[0]
                .getContent()[3]
                .getValue()
                .split(" - ")[0];
            }
            oEntry.zcredit_control_area = "";

            if (this.getView().getModel("Customers").getData().zdate_founded === null || this.getView().getModel("Customers").getData().zdate_founded.length < 13) {
              oEntry.zdate_founded = oEntry.zdate_founded ? this.dateFormatter(oEntry.zdate_founded) : null;
            }
            if (this.getView().getModel("Customers").getData().zliquidationdate === null || this.getView().getModel("Customers").getData().zliquidationdate.length < 13) {
              oEntry.zliquidationdate = oEntry.zliquidationdate ? this.dateFormatter(oEntry.zliquidationdate) : null;
            }
            if (this.getView().getModel("Customers").getData().zdate === null || this.getView().getModel("Customers").getData().zdate.length < 13) {
              oEntry.zdate = oEntry.zdate ? this.dateFormatter(oEntry.zdate) : null;
            }
            if (this.getView().getModel("Customers").getData().zvalidity_to === null || this.getView().getModel("Customers").getData().zvalidity_to.length < 13) {
              oEntry.zvalidity_to = oEntry.zvalidity_to ? this.dateFormatter(oEntry.zvalidity_to) : null;
            }
            if (this.getView().getModel("Customers").getData().zvalid_from === null || this.getView().getModel("Customers").getData().zvalid_from.length < 13) {
              oEntry.zvalid_from = oEntry.zvalid_from ? this.dateFormatter(oEntry.zvalid_from) : null;
            }
            if (this.getView().getModel("Customers").getData().zvalid_to === null || this.getView().getModel("Customers").getData().zvalid_to.length < 13) {
              oEntry.zvalid_to = oEntry.zvalid_to ? this.dateFormatter(oEntry.zvalid_to) : null;
            }
            if (this.getView().getModel("Customers").getData().zentry_date === null || this.getView().getModel("Customers").getData().zentry_date.length < 13) {
              oEntry.zentry_date = oEntry.zentry_date ? this.dateFormatter(oEntry.zentry_date) : null;
            }
            if (this.getView().getModel("Customers").getData().zduedate === null || this.getView().getModel("Customers").getData().zduedate.length < 13) {
              oEntry.zduedate = oEntry.zduedate ? this.dateFormatter(oEntry.zduedate) : null;
            }
            //oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
            if (this.getView().getModel("Customers").getData().zupdated_date === null || this.getView().getModel("Customers").getData().zupdated_date.length < 13) {
              oEntry.zupdated_date = oEntry.zupdated_date ? this.dateFormatter(oEntry.zupdated_date) : null;
            }
            if (this.getView().getModel("Customers").getData().zfinalizedon === null || this.getView().getModel("Customers").getData().zfinalizedon.length < 13) {
              oEntry.zfinalizedon = oEntry.zfinalizedon ? this.dateFormatter(oEntry.zfinalizedon) : null;
            }
            if (this.getView().getModel("Customers").getData().zlast_key_date === null || this.getView().getModel("Customers").getData().zlast_key_date.length < 13) {
              oEntry.zlast_key_date = oEntry.zlast_key_date ? this.dateFormatter(oEntry.zlast_key_date) : null;
            }
            if (this.getView().getModel("Customers").getData().zpayment_on === null || this.getView().getModel("Customers").getData().zpayment_on.length < 13) {
              oEntry.zpayment_on = oEntry.zpayment_on ? this.dateFormatter(oEntry.zpayment_on) : null;
            }
            if (this.getView().getModel("Customers").getData().zcreated_date === null || this.getView().getModel("Customers").getData().zcreated_date.length < 13) {
              oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
            }
            if (this.getView().getModel("Customers").getData().zcl_validity_proposed_date === null || this.getView().getModel("Customers").getData().zcl_validity_proposed_date.length < 13) {
              oEntry.zcl_validity_proposed_date = oEntry.zcl_validity_proposed_date ? this.dateFormatter(oEntry.zcl_validity_proposed_date) : null;
            }
            if (this.getView().getModel("Customers").getData().zresubmission_on === null || this.getView().getModel("Customers").getData().zresubmission_on.length < 13) {
              oEntry.zresubmission_on = oEntry.zresubmission_on ? this.dateFormatter(oEntry.zresubmission_on) : null;
            }
            if (this.getView().getModel("Customers").getData().zvalid_passport_date === null || this.getView().getModel("Customers").getData().zvalid_passport_date.length < 13) {
              oEntry.zvalid_passport_date = oEntry.zvalid_passport_date ? this.dateFormatter(oEntry.zvalid_passport_date) : null;
            }
            if (this.getView().getModel("Customers").getData().zvisa_valid_date === null || this.getView().getModel("Customers").getData().zvisa_valid_date.length < 13) {
              oEntry.zvisa_valid_date = oEntry.zvisa_valid_date ? this.dateFormatter(oEntry.zvisa_valid_date) : null;
            }
            if (this.getView().getModel("Customers").getData().znet_due_date === null || this.getView().getModel("Customers").getData().znet_due_date.length < 13) {
              oEntry.znet_due_date = oEntry.znet_due_date ? this.dateFormatter(oEntry.znet_due_date) : null;
            }


            delete oEntry.to_comments;
            delete oEntry.to_salesarea;
            delete oEntry.to_credit;

            oModel.update(this.uPath, oEntry, {
              success: function (oData, oResponse) {
                jQuery.sap.require("sap.m.MessageBox");
                // sap.m.MessageBox.success("Customer Id " + this.getView().getModel("Customers").getData().zrequest_no + " saved Successfully");
                this.handleSalesData();

                // trigger workflow
                var sCreatedAt = "";
                if (oEntry.zcreated_date) {
                  if (oEntry.zcreated_date.getDate() < 10) {
                    sCreatedAt += "0" + oEntry.zcreated_date.getDate() + ".";
                  } else {
                    sCreatedAt += oEntry.zcreated_date.getDate() + ".";
                  }
                  if ((oEntry.zcreated_date.getMonth() + 1) < 10) {
                    sCreatedAt += "0" + (oEntry.zcreated_date.getMonth() + 1);
                  } else {
                    sCreatedAt += (oEntry.zcreated_date.getMonth() + 1);
                  }
                  sCreatedAt += "." + oEntry.zcreated_date.getFullYear();
                }
                
                var sWFRequest;
                var sCustomerId;
                if (oEntry.zrequest_type === "Change Customer") {
                  sWFRequest = "change";
                  sCustomerId = that.businessPartnerId;
                } else {
                  sWFRequest = "create";
                  sCustomerId = oEntry.zcustomer_num;
                }
                var oWFModel = that.getOwnerComponent().getModel("Workflow");
                var body = {
                  definitionId:
                    "eu10.iffcodevprocessautomation.iffcocustomerservices.iFFCOCustomerCreate",
                  "context": {
                    "requesttype": sWFRequest,
                    "customerid": sCustomerId,
                    "customername": oEntry.zfirst_name,
                    "customersitename": oEntry.zfirst_name,
                    "customercountry": oEntry.zcountry,
                    "businessunit": oEntry.zbusiness_unit_name,
                    "createdbyuserid": oEntry.zcreated_by,
                    "createdbyname": oEntry.zcreated_by,
                    "createdbyrole": "Sales Person",
                    "createdon": sCreatedAt,
                    "salesorganizationid": oEntry.zsales_orgnization ? oEntry.zsales_orgnization : "",
                    "linktotask": "",
                    "testmode": true,
                    "bulkdocumentid": ""
                  }
                };
                oWFModel.create(
                  "/createWF",
                  { body: JSON.stringify(body) },
                  {
                    success: function (oData) {
                      sap.m.MessageToast.show(
                        "Customer is submitted Successfully"
                      );
                    },
                    error: function (oError) {
                      sap.m.MessageToast.show(
                        "Error while initiating workflow request!"
                      );
                    },
                  }
                );

              }.bind(this),
              error: function (err) {

              }
            });
            // }
            // else{

            //   var req_no = Math.floor(1000 + Math.random() * 9000) + "";
            //   oEntry.zrequest_no = req_no;
            //   // oEntry.zsales_orgnization = "20";
            //   oEntry.zsales_orgnization = this.getView()
            //     .getModel("appView")
            //     .getProperty("/salesOrg");
            //   oEntry.zrequest_type =
            //     this.getView().getModel("appView").getProperty("/reqType") ==
            //     "CHANGE"
            //       ? "Change Customer"
            //       : "Extend Customer";
            //   // oEntry.zrequest_type = "Change Customer";
            //   oEntry.zrequest_status = "In Progress";

            //   delete oEntry.zint_city_name;
            //   delete oEntry.__metadata;

            //   delete oEntry.ztelephone_country_number_exte;
            //   delete oEntry.zfax_country_number_extension;

            //   delete oEntry.to_comments;
            //   delete oEntry.to_salesarea;
            //   delete oEntry.zmobile_country_number;
            //   delete oEntry.zstreet_house_number;

            //   delete oEntry.Telephone;
            //   delete oEntry.Mandt;
            //   delete oEntry.CustomerId;
            //   delete oEntry.zregion2;

            //   // maxlength issue
            //   oEntry.zpo_box_without_number = "";
            //   // oEntry.zindividual_paymen="";
            //   oEntry.zaccounting = "";
            //   oEntry.zagent = "";
            //   oEntry.zcomplete_delivery = "";
            //   oEntry.zcustomer_w_o_ci = "";
            //   oEntry.zcustomer_with_ci = "";
            //   oEntry.zdocument_index_active = "";
            //   oEntry.zindividual_payment = "";
            //   oEntry.zlocal_processing = "";
            //   oEntry.zorder_combination = "";
            //   oEntry.zrelevant_pod = "";
            //   oEntry.zswitch_off_rounding = "";
            //   oEntry.zunlimited_tolerance = "";
            //   oEntry.zlegal_deparment = "";
            //   oEntry.zpayment_history_record = "";
            //   oEntry.zmanual_invoice_maintenance = "";
            //   oEntry.zsettlement_group = "";
            //   oEntry.zstandard_usage = "";
            //   // oEntry.ztele_number = "";
            //   oEntry.zsales = "";
            //   oEntry.zrebate = "";

            //   delete oEntry.BusinessPartnerDD;
            //   delete oEntry.BPRoles;
            //   delete oEntry.requests;
            //   delete oEntry.EntryCollection;

            //   oEntry.zcredit_limit_type =
            //     this.getView()
            //       .getModel("appView")
            //       .getProperty("/selectedType") === 0
            //       ? "Secured Credit"
            //       : "UnSecured Credit";
            //   if (
            //     this.getView()
            //       .byId("CreditProfileSection2")
            //       .getAggregation("_views") !== null
            //   ) {
            //     oEntry.zblockedincm = this.getView()
            //       .byId("CreditProfileSection2")
            //       .getAggregation("_views")[0]
            //       .getContent()[0]
            //       .getContent()[1]
            //       .getSelected()
            //       ? "Y"
            //       : "N";
            //     oEntry.zspecialattention = this.getView()
            //       .byId("CreditProfileSection2")
            //       .getAggregation("_views")[0]
            //       .getContent()[0]
            //       .getContent()[3]
            //       .getSelected()
            //       ? "Y"
            //       : "N";
            //   }
            //   // if(this.getView().byId("orderData13").getAggregation("_views") !==null){
            //   //     oEntry.zroute_audit_is_performed = this.getView().byId("orderData13").getAggregation("_views")[0].getContent()[0].getContent()[25].getSelected() ? 'Y' : 'N';
            //   // }
            //   oEntry.zdescription = this.getView()
            //     .getModel("appView")
            //     .getProperty("/custType");
            //   // oEntry.zbusiness_partner_id_grouping = this.getView()
            //   //   .getModel("appView")
            //   //   .getProperty("/bpg");
            //   // oEntry.zcountry = this.getView()
            //   //   .byId("orderData9")
            //   //   .getAggregation("_views")[0]
            //   //   .getContent()[0]
            //   //   .getContent()[3]
            //   //   .getValue()
            //   //   .split(" - ")[0];
            //   oEntry.zblock_reason =
            //     this.getView()
            //       .byId("CreditProfileSection2")
            //       .getAggregation("_views") !== null
            //       ? this.getView()
            //           .byId("CreditProfileSection2")
            //           .getAggregation("_views")[0]
            //           .getContent()[0]
            //           .getContent()[5]
            //           .getValue()
            //           .split(" - ")[0]
            //       : "";

            //   if (
            //     this.getView()
            //       .byId("CreditProfileSection4")
            //       .getAggregation("_views") !== null
            //   ) {
            //     oEntry.zdata_outdated = this.getView()
            //       .byId("CreditProfileSection4")
            //       .getAggregation("_views")[0]
            //       .getContent()[0]
            //       .getContent()[2]
            //       .getSelected()
            //       ? "Y"
            //       : "N";
            //   }
            //   if (
            //     this.getView()
            //       .byId("salesAreadata15")
            //       .getAggregation("_views") !== null
            //   ) {
            //     oEntry.zcredit_control_area = this.getView()
            //       .byId("salesAreadata15")
            //       .getAggregation("_views")[0]
            //       .getContent()[0]
            //       .getContent()[3]
            //       .getValue()
            //       .split(" - ")[0];
            //   }
            //   // if (
            //   //   this.getView()
            //   //     .byId("CreditAnalysisView")
            //   //     .getAggregation("_views") !== null
            //   // ) {
            //   //   oEntry.zcountry_rating = this.getView()
            //   //     .byId("CreditAnalysisView")
            //   //     .getAggregation("_views")[0]
            //   //     .getContent()[0]
            //   //     .getContent()[23]
            //   //     .getValue()
            //   //     .split(" ; ")[0];
            //   // }
            //   if (this.getView().getModel("Customers").getData().zdate_founded === undefined || this.getView().getModel("Customers").getData().zdate_founded === null || this.getView().getModel("Customers").getData().zdate_founded.length < 13) {
            //     oEntry.zdate_founded = oEntry.zdate_founded ? this.dateFormatter(oEntry.zdate_founded) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zliquidationdate === undefined || this.getView().getModel("Customers").getData().zliquidationdate === null || this.getView().getModel("Customers").getData().zliquidationdate.length < 13) {
            //     oEntry.zliquidationdate = oEntry.zliquidationdate ? this.dateFormatter(oEntry.zliquidationdate) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zdate === undefined || this.getView().getModel("Customers").getData().zdate === null || this.getView().getModel("Customers").getData().zdate.length < 13) {
            //     oEntry.zdate = oEntry.zdate ? this.dateFormatter(oEntry.zdate) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zvalidity_to === undefined || this.getView().getModel("Customers").getData().zvalidity_to === null || this.getView().getModel("Customers").getData().zvalidity_to.length < 13) {
            //     oEntry.zvalidity_to = oEntry.zvalidity_to ? this.dateFormatter(oEntry.zvalidity_to) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zvalid_from === undefined || this.getView().getModel("Customers").getData().zvalid_from === null || this.getView().getModel("Customers").getData().zvalid_from.length < 13) {
            //     oEntry.zvalid_from = oEntry.zvalid_from ? this.dateFormatter(oEntry.zvalid_from) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zvalid_to === undefined || this.getView().getModel("Customers").getData().zvalid_to === null || this.getView().getModel("Customers").getData().zvalid_to.length < 13) {
            //     oEntry.zvalid_to = oEntry.zvalid_to ? this.dateFormatter(oEntry.zvalid_to) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zentry_date === undefined || this.getView().getModel("Customers").getData().zentry_date === null || this.getView().getModel("Customers").getData().zentry_date.length < 13) {
            //     oEntry.zentry_date = oEntry.zentry_date ? this.dateFormatter(oEntry.zentry_date) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zduedate === undefined || this.getView().getModel("Customers").getData().zduedate === null || this.getView().getModel("Customers").getData().zduedate.length < 13) {
            //     oEntry.zduedate = oEntry.zduedate ? this.dateFormatter(oEntry.zduedate) : null;
            // }
            // //oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
            // if (this.getView().getModel("Customers").getData().zupdated_date === undefined || this.getView().getModel("Customers").getData().zupdated_date === null || this.getView().getModel("Customers").getData().zupdated_date.length < 13) {
            //     oEntry.zupdated_date = oEntry.zupdated_date ? this.dateFormatter(oEntry.zupdated_date) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zfinalizedon === undefined || this.getView().getModel("Customers").getData().zfinalizedon === null || this.getView().getModel("Customers").getData().zfinalizedon.length < 13) {
            //     oEntry.zfinalizedon = oEntry.zfinalizedon ? this.dateFormatter(oEntry.zfinalizedon) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zlast_key_date === undefined || this.getView().getModel("Customers").getData().zlast_key_date === null || this.getView().getModel("Customers").getData().zlast_key_date.length < 13) {
            //     oEntry.zlast_key_date = oEntry.zlast_key_date ? this.dateFormatter(oEntry.zlast_key_date) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zpayment_on === undefined || this.getView().getModel("Customers").getData().zpayment_on === null || this.getView().getModel("Customers").getData().zpayment_on.length < 13) {
            //     oEntry.zpayment_on = oEntry.zpayment_on ? this.dateFormatter(oEntry.zpayment_on) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zcreated_date === undefined || this.getView().getModel("Customers").getData().zcreated_date === null || this.getView().getModel("Customers").getData().zcreated_date.length < 13) {
            //     oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
            // }
            // if ( this.getView().getModel("Customers").getData().zcl_validity_proposed_date === undefined || this.getView().getModel("Customers").getData().zcl_validity_proposed_date === null || this.getView().getModel("Customers").getData().zcl_validity_proposed_date.length < 13) {
            //     oEntry.zcl_validity_proposed_date = oEntry.zcl_validity_proposed_date ? this.dateFormatter(oEntry.zcl_validity_proposed_date) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zresubmission_on === undefined || this.getView().getModel("Customers").getData().zresubmission_on === null || this.getView().getModel("Customers").getData().zresubmission_on.length < 13) {
            //     oEntry.zresubmission_on = oEntry.zresubmission_on ? this.dateFormatter(oEntry.zresubmission_on) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zvalid_passport_date === undefined || this.getView().getModel("Customers").getData().zvalid_passport_date === null || this.getView().getModel("Customers").getData().zvalid_passport_date.length < 13) {
            //     oEntry.zvalid_passport_date = oEntry.zvalid_passport_date ? this.dateFormatter(oEntry.zvalid_passport_date) : null;
            // }
            // if (this.getView().getModel("Customers").getData().zvisa_valid_date === undefined || this.getView().getModel("Customers").getData().zvisa_valid_date === null || this.getView().getModel("Customers").getData().zvisa_valid_date.length < 13) {
            //     oEntry.zvisa_valid_date = oEntry.zvisa_valid_date ? this.dateFormatter(oEntry.zvisa_valid_date) : null;
            // }
            // if (this.getView().getModel("Customers").getData().znet_due_date === undefined || this.getView().getModel("Customers").getData().znet_due_date === null || this.getView().getModel("Customers").getData().znet_due_date.length < 13) {
            //     oEntry.znet_due_date = oEntry.znet_due_date ? this.dateFormatter(oEntry.znet_due_date) : null;
            // }
            //   // oEntry.zpaytterm_proposed_paymentterm !== undefined
            //   //   ? oEntry.zpaytterm_proposed_paymentterm.split(" ")[0]
            //   //   : "";
            //   // delete oEntry.zcredit_limit_type;

            //   delete oEntry.BusinessPartnerDD;
            //   delete oEntry.BPRoles;
            //   delete oEntry.requests;
            //   delete oEntry.EntryCollection;
            //   delete oEntry.zcredit_control_area;
            //   delete oEntry.zvat_gstno_attachment;
            //   delete oEntry.to_comments;
            //           delete oEntry.to_salesarea;
            //           delete oEntry.to_credit;
            //   oModel.create("/ZDD_CUSTOMER", oEntry, {
            //     success: function (oData, oResponse) {
            //       this.reqestNo = oData.zrequest_no;
            //       this.custNum = oData.zcustomer_num;
            //       this.getView()
            //         .getModel("appView")
            //         .setProperty("/newCustId", oData.zcustomer_num);
            //       this.handleSalesData();

            //       var sCreatedAt = "";
            //       if (oEntry.zcreated_date) {
            //         if (oEntry.zcreated_date.getDate() < 10) {
            //               sCreatedAt += "0" + oEntry.zcreated_date.getDate() + ".";
            //        } else {
            //         sCreatedAt += oEntry.zcreated_date.getDate() + ".";
            //        }
            //                           if ((oEntry.zcreated_date.getMonth() + 1) < 10) {
            //                               sCreatedAt += "0" +  (oEntry.zcreated_date.getMonth() + 1);  
            //                           } else {
            //                               sCreatedAt += (oEntry.zcreated_date.getMonth() + 1);
            //                           }
            //                           sCreatedAt +=  "." + oEntry.zcreated_date.getFullYear();
            //                       }
            //                       oEntry.zrequest_type =
            //                       this.getView().getModel("appView").getProperty("/reqType") ==
            //                       "CHANGE"
            //                         ? "Change Customer"
            //                         : "Extend Customer"

            //       var oWFModel = that.getOwnerComponent().getModel("Workflow");
            //       var body = {
            //         definitionId:
            //           "eu10.iffcodevprocessautomation.iffcocustomerservices.iFFCOCustomerCreate",
            //           "context": {
            //             "requesttype": "create",
            //             "customerid": that.custNum,
            //             "customername": oEntry.zfirst_name,
            //             "customersitename": oEntry.zfirst_name,
            //             "customercountry": oEntry.zcountry,
            //             "businessunit": oEntry.zbusiness_unit_name,
            //             "createdbyuserid": oEntry.zcreated_by,
            //             "createdbyname": oEntry.zcreated_by,
            //             "createdbyrole": "Sales Person",
            //             "createdon": sCreatedAt,
            //             "salesorganizationid": oEntry.zsales_orgnization ? oEntry.zsales_orgnization : "",
            //             "linktotask": "",
            //             "testmode": true,
            //             "bulkdocumentid": ""
            //         }
            //       };
            //       oWFModel.create(
            //         "/createWF",
            //         { body: JSON.stringify(body) },
            //         {
            //           success: function (oData) {
            //             sap.m.MessageToast.show(
            //               "Customer is submitted Successfully"
            //             );
            //           },
            //           error: function (oError) {
            //             sap.m.MessageToast.show(
            //               "Error while initiating workflow request!"
            //             );
            //           },
            //         }
            //       );
            //     }.bind(this),
            //     error: function (oError) {
            //       jQuery.sap.require("sap.m.MessageBox");
            //       sap.m.MessageBox.error(oError.message);
            //     },
            //   });
            // }
          } else {
            that.getView().setBusy(false);
            MessageBox.error(this.ValidationMesg);
          }
        } else {
          MessageBox.error("Please validate the error fields");
        }
      },

      saveRequest: function () {
        var that = this;
        var validFromState = this.getView()
          .byId("orderData193")
          .getAggregation("_views")
          ? this.getView()
            .byId("orderData193")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[5]
            .getValueState()
          : "Success";
        var validToState = this.getView()
          .byId("orderData193")
          .getAggregation("_views")
          ? this.getView()
            .byId("orderData193")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[7]
            .getValueState()
          : "Success";
        var emailState = this.getView()
          .byId("orderData8")
          .getAggregation("_views")
          ? this.getView()
            .byId("orderData8")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[14]
            .getValueState()
          : "Success";

        // Key fields 

        var legalName = this.getView().byId("orderData6").getAggregation("_views")[0].getContent()[0].getContent()[3].getValue().length;
        var vertical = this.getView().byId("orderData1").getAggregation("_views")[0].getContent()[0].getContent()[7].getValue().length;
        var channelGrp = this.getView().byId("orderData5").getAggregation("_views")[0].getContent()[0].getContent()[13].getValue().length;
        var custType = this.getView().byId("orderData5").getAggregation("_views")[0].getContent()[0].getContent()[17].getValue().length;
        // var compCode = this.getView().byId("erpCustomersydata1").getAggregation("_views")[0].getContent()[0].getContent()[1].getValue().length;

        //  if(legalName > 0 && vertical > 0 && channelGrp > 0 && custType > 0 && compCode > 0){
        var oModel = this.getView().getModel();
        var oCustomerDetailModel = this.getView().getModel("Customers");
        delete oCustomerDetailModel.getData().to_zdd_sale;
        delete oCustomerDetailModel.getData().to_zdd_comments;
        var oEntry = oCustomerDetailModel.getData();

        // if(this.mode === "edit"){
        this.reqNumber = oEntry.zrequest_no;
        oEntry.zrequest_type =
          this.getView().getModel("appView").getProperty("/reqType") ==
            "CHANGE"
            ? "Change Customer"
            : "Extend Customer";
        oEntry.zrequest_status = "In Draft";
        oEntry.zcredit_limit_type =
          this.getView()
            .getModel("appView")
            .getProperty("/selectedType") === 0
            ? "Secured Credit"
            : "UnSecured Credit";
        if (
          this.getView()
            .byId("CreditProfileSection2")
            .getAggregation("_views") !== null
        ) {
          oEntry.zblockedincm = this.getView()
            .byId("CreditProfileSection2")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[1]
            .getSelected()
            ? "Y"
            : "N";
          oEntry.zspecialattention = this.getView()
            .byId("CreditProfileSection2")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[3]
            .getSelected()
            ? "Y"
            : "N";
        }

        oEntry.zdescription = this.getView()
          .getModel("appView")
          .getProperty("/custType");

        oEntry.zblock_reason =
          this.getView()
            .byId("CreditProfileSection2")
            .getAggregation("_views") !== null
            ? this.getView()
              .byId("CreditProfileSection2")
              .getAggregation("_views")[0]
              .getContent()[0]
              .getContent()[5]
              .getValue()
              .split(" - ")[0]
            : "";

        if (
          this.getView()
            .byId("CreditProfileSection4")
            .getAggregation("_views") !== null
        ) {
          oEntry.zdata_outdated = this.getView()
            .byId("CreditProfileSection4")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[2]
            .getSelected()
            ? "Y"
            : "N";
        }
        if (
          this.getView()
            .byId("salesAreadata15")
            .getAggregation("_views") !== null
        ) {
          oEntry.zcredit_control_area = this.getView()
            .byId("salesAreadata15")
            .getAggregation("_views")[0]
            .getContent()[0]
            .getContent()[3]
            .getValue()
            .split(" - ")[0];
        }
        oEntry.zcredit_control_area = "";


        if (this.getView().getModel("Customers").getData().zdate_founded === null || this.getView().getModel("Customers").getData().zdate_founded.length < 13) {
          oEntry.zdate_founded = oEntry.zdate_founded ? this.dateFormatter(oEntry.zdate_founded) : null;
        }
        if (this.getView().getModel("Customers").getData().zliquidationdate === null || this.getView().getModel("Customers").getData().zliquidationdate.length < 13) {
          oEntry.zliquidationdate = oEntry.zliquidationdate ? this.dateFormatter(oEntry.zliquidationdate) : null;
        }
        if (this.getView().getModel("Customers").getData().zdate === null || this.getView().getModel("Customers").getData().zdate.length < 13) {
          oEntry.zdate = oEntry.zdate ? this.dateFormatter(oEntry.zdate) : null;
        }
        if (this.getView().getModel("Customers").getData().zvalidity_to === null || this.getView().getModel("Customers").getData().zvalidity_to.length < 13) {
          oEntry.zvalidity_to = oEntry.zvalidity_to ? this.dateFormatter(oEntry.zvalidity_to) : null;
        }
        if (this.getView().getModel("Customers").getData().zvalid_from === null || this.getView().getModel("Customers").getData().zvalid_from.length < 13) {
          oEntry.zvalid_from = oEntry.zvalid_from ? this.dateFormatter(oEntry.zvalid_from) : null;
        }
        if (this.getView().getModel("Customers").getData().zvalid_to === null || this.getView().getModel("Customers").getData().zvalid_to.length < 13) {
          oEntry.zvalid_to = oEntry.zvalid_to ? this.dateFormatter(oEntry.zvalid_to) : null;
        }
        if (this.getView().getModel("Customers").getData().zentry_date === null || this.getView().getModel("Customers").getData().zentry_date.length < 13) {
          oEntry.zentry_date = oEntry.zentry_date ? this.dateFormatter(oEntry.zentry_date) : null;
        }
        if (this.getView().getModel("Customers").getData().zduedate === null || this.getView().getModel("Customers").getData().zduedate.length < 13) {
          oEntry.zduedate = oEntry.zduedate ? this.dateFormatter(oEntry.zduedate) : null;
        }
        //oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
        if (this.getView().getModel("Customers").getData().zupdated_date === null || this.getView().getModel("Customers").getData().zupdated_date.length < 13) {
          oEntry.zupdated_date = oEntry.zupdated_date ? this.dateFormatter(oEntry.zupdated_date) : null;
        }
        if (this.getView().getModel("Customers").getData().zfinalizedon === null || this.getView().getModel("Customers").getData().zfinalizedon.length < 13) {
          oEntry.zfinalizedon = oEntry.zfinalizedon ? this.dateFormatter(oEntry.zfinalizedon) : null;
        }
        if (this.getView().getModel("Customers").getData().zlast_key_date === null || this.getView().getModel("Customers").getData().zlast_key_date.length < 13) {
          oEntry.zlast_key_date = oEntry.zlast_key_date ? this.dateFormatter(oEntry.zlast_key_date) : null;
        }
        if (this.getView().getModel("Customers").getData().zpayment_on === null || this.getView().getModel("Customers").getData().zpayment_on.length < 13) {
          oEntry.zpayment_on = oEntry.zpayment_on ? this.dateFormatter(oEntry.zpayment_on) : null;
        }
        if (this.getView().getModel("Customers").getData().zcreated_date === null || this.getView().getModel("Customers").getData().zcreated_date.length < 13) {
          oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
        }
        if (this.getView().getModel("Customers").getData().zcl_validity_proposed_date === null || this.getView().getModel("Customers").getData().zcl_validity_proposed_date.length < 13) {
          oEntry.zcl_validity_proposed_date = oEntry.zcl_validity_proposed_date ? this.dateFormatter(oEntry.zcl_validity_proposed_date) : null;
        }
        if (this.getView().getModel("Customers").getData().zresubmission_on === null || this.getView().getModel("Customers").getData().zresubmission_on.length < 13) {
          oEntry.zresubmission_on = oEntry.zresubmission_on ? this.dateFormatter(oEntry.zresubmission_on) : null;
        }
        if (this.getView().getModel("Customers").getData().zvalid_passport_date === null || this.getView().getModel("Customers").getData().zvalid_passport_date.length < 13) {
          oEntry.zvalid_passport_date = oEntry.zvalid_passport_date ? this.dateFormatter(oEntry.zvalid_passport_date) : null;
        }
        if (this.getView().getModel("Customers").getData().zvisa_valid_date === null || this.getView().getModel("Customers").getData().zvisa_valid_date.length < 13) {
          oEntry.zvisa_valid_date = oEntry.zvisa_valid_date ? this.dateFormatter(oEntry.zvisa_valid_date) : null;
        }
        if (this.getView().getModel("Customers").getData().znet_due_date === null || this.getView().getModel("Customers").getData().znet_due_date.length < 13) {
          oEntry.znet_due_date = oEntry.znet_due_date ? this.dateFormatter(oEntry.znet_due_date) : null;
        }

        delete oEntry.to_comments;
        delete oEntry.to_salesarea;
        delete oEntry.to_credit;

        oModel.update(this.uPath, oEntry, {
          success: function (oData, oResponse) {
            jQuery.sap.require("sap.m.MessageBox");
            // sap.m.MessageBox.success("Customer Id " + this.getView().getModel("Customers").getData().zrequest_no + " saved Successfully");
            this.handleSalesData();
          }.bind(this),
          error: function (err) {

          }
        });
        // }
        //   else{

        //   var req_no = Math.floor(1000 + Math.random() * 9000) + "";
        //   oEntry.zrequest_no = req_no;
        //   // oEntry.zsales_orgnization = "20";
        //   oEntry.zsales_orgnization = this.getView()
        //     .getModel("appView")
        //     .getProperty("/salesOrg");
        //   oEntry.zrequest_type =
        //     this.getView().getModel("appView").getProperty("/reqType") ==
        //     "CHANGE"
        //       ? "Change Customer"
        //       : "Extend Customer";
        //   // oEntry.zrequest_type = "Change Customer";
        //   oEntry.zrequest_status = "In Draft";

        //   delete oEntry.ztelephone_country_number_exte;
        //   delete oEntry.zfax_country_number_extension;

        //   delete oEntry.to_comments;
        //   delete oEntry.to_salesarea;
        //   delete oEntry.zmobile_country_number;
        //   delete oEntry.zstreet_house_number;

        //   delete oEntry.Telephone;
        //   delete oEntry.Mandt;
        //   delete oEntry.CustomerId;
        //   delete oEntry.zregion2;

        //   // maxlength issue
        //   oEntry.zpo_box_without_number = "";
        //   // oEntry.zindividual_paymen="";
        //   oEntry.zaccounting = "";
        //   oEntry.zagent = "";
        //   oEntry.zcomplete_delivery = "";
        //   oEntry.zcustomer_w_o_ci = "";
        //   oEntry.zcustomer_with_ci = "";
        //   oEntry.zdocument_index_active = "";
        //   oEntry.zindividual_payment = "";
        //   oEntry.zlocal_processing = "";
        //   oEntry.zorder_combination = "";
        //   oEntry.zrelevant_pod = "";
        //   oEntry.zswitch_off_rounding = "";
        //   oEntry.zunlimited_tolerance = "";
        //   oEntry.zlegal_deparment = "";
        //   oEntry.zpayment_history_record = "";
        //   oEntry.zmanual_invoice_maintenance = "";
        //   oEntry.zsettlement_group = "";
        //   oEntry.zstandard_usage = "";
        //   // oEntry.ztele_number = "";
        //   oEntry.zsales = "";
        //   oEntry.zrebate = "";

        //   delete oEntry.BusinessPartnerDD;
        //   delete oEntry.BPRoles;
        //   delete oEntry.requests;
        //   delete oEntry.EntryCollection;
        //   delete oEntry.zint_city_name;
        //   delete oEntry.__metadata;

        //   oEntry.zcredit_limit_type =
        //     this.getView()
        //       .getModel("appView")
        //       .getProperty("/selectedType") === 0
        //       ? "Secured Credit"
        //       : "UnSecured Credit";
        //   if (
        //     this.getView()
        //       .byId("CreditProfileSection2")
        //       .getAggregation("_views") !== null
        //   ) {
        //     oEntry.zblockedincm = this.getView()
        //       .byId("CreditProfileSection2")
        //       .getAggregation("_views")[0]
        //       .getContent()[0]
        //       .getContent()[1]
        //       .getSelected()
        //       ? "Y"
        //       : "N";
        //     oEntry.zspecialattention = this.getView()
        //       .byId("CreditProfileSection2")
        //       .getAggregation("_views")[0]
        //       .getContent()[0]
        //       .getContent()[3]
        //       .getSelected()
        //       ? "Y"
        //       : "N";
        //   }

        //   oEntry.zdescription = this.getView()
        //     .getModel("appView")
        //     .getProperty("/custType");
        //   // oEntry.zbusiness_partner_id_grouping = this.getView()
        //   //   .getModel("appView")
        //   //   .getProperty("/bpg");
        //   // oEntry.zcountry = this.getView()
        //   //   .byId("orderData9")
        //   //   .getAggregation("_views")[0]
        //   //   .getContent()[0]
        //   //   .getContent()[3]
        //   //   .getValue()
        //   //   .split(" - ")[0];
        //   oEntry.zblock_reason =
        //     this.getView()
        //       .byId("CreditProfileSection2")
        //       .getAggregation("_views") !== null
        //       ? this.getView()
        //           .byId("CreditProfileSection2")
        //           .getAggregation("_views")[0]
        //           .getContent()[0]
        //           .getContent()[5]
        //           .getValue()
        //           .split(" - ")[0]
        //       : "";

        //   if (
        //     this.getView()
        //       .byId("CreditProfileSection4")
        //       .getAggregation("_views") !== null
        //   ) {
        //     oEntry.zdata_outdated = this.getView()
        //       .byId("CreditProfileSection4")
        //       .getAggregation("_views")[0]
        //       .getContent()[0]
        //       .getContent()[2]
        //       .getSelected()
        //       ? "Y"
        //       : "N";
        //   }
        //   if (
        //     this.getView()
        //       .byId("salesAreadata15")
        //       .getAggregation("_views") !== null
        //   ) {
        //     oEntry.zcredit_control_area = this.getView()
        //       .byId("salesAreadata15")
        //       .getAggregation("_views")[0]
        //       .getContent()[0]
        //       .getContent()[3]
        //       .getValue()
        //       .split(" - ")[0];
        //   }


        //   if (this.getView().getModel("Customers").getData().zdate_founded === undefined || this.getView().getModel("Customers").getData().zdate_founded === null || this.getView().getModel("Customers").getData().zdate_founded.length < 13) {
        //     oEntry.zdate_founded = oEntry.zdate_founded ? this.dateFormatter(oEntry.zdate_founded) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zliquidationdate === undefined || this.getView().getModel("Customers").getData().zliquidationdate === null || this.getView().getModel("Customers").getData().zliquidationdate.length < 13) {
        //     oEntry.zliquidationdate = oEntry.zliquidationdate ? this.dateFormatter(oEntry.zliquidationdate) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zdate === undefined || this.getView().getModel("Customers").getData().zdate === null || this.getView().getModel("Customers").getData().zdate.length < 13) {
        //     oEntry.zdate = oEntry.zdate ? this.dateFormatter(oEntry.zdate) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zvalidity_to === undefined || this.getView().getModel("Customers").getData().zvalidity_to === null || this.getView().getModel("Customers").getData().zvalidity_to.length < 13) {
        //     oEntry.zvalidity_to = oEntry.zvalidity_to ? this.dateFormatter(oEntry.zvalidity_to) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zvalid_from === undefined || this.getView().getModel("Customers").getData().zvalid_from === null || this.getView().getModel("Customers").getData().zvalid_from.length < 13) {
        //     oEntry.zvalid_from = oEntry.zvalid_from ? this.dateFormatter(oEntry.zvalid_from) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zvalid_to === undefined || this.getView().getModel("Customers").getData().zvalid_to === null || this.getView().getModel("Customers").getData().zvalid_to.length < 13) {
        //     oEntry.zvalid_to = oEntry.zvalid_to ? this.dateFormatter(oEntry.zvalid_to) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zentry_date === undefined || this.getView().getModel("Customers").getData().zentry_date === null || this.getView().getModel("Customers").getData().zentry_date.length < 13) {
        //     oEntry.zentry_date = oEntry.zentry_date ? this.dateFormatter(oEntry.zentry_date) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zduedate === undefined || this.getView().getModel("Customers").getData().zduedate === null || this.getView().getModel("Customers").getData().zduedate.length < 13) {
        //     oEntry.zduedate = oEntry.zduedate ? this.dateFormatter(oEntry.zduedate) : null;
        // }
        // //oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
        // if (this.getView().getModel("Customers").getData().zupdated_date === undefined || this.getView().getModel("Customers").getData().zupdated_date === null || this.getView().getModel("Customers").getData().zupdated_date.length < 13) {
        //     oEntry.zupdated_date = oEntry.zupdated_date ? this.dateFormatter(oEntry.zupdated_date) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zfinalizedon === undefined || this.getView().getModel("Customers").getData().zfinalizedon === null || this.getView().getModel("Customers").getData().zfinalizedon.length < 13) {
        //     oEntry.zfinalizedon = oEntry.zfinalizedon ? this.dateFormatter(oEntry.zfinalizedon) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zlast_key_date === undefined || this.getView().getModel("Customers").getData().zlast_key_date === null || this.getView().getModel("Customers").getData().zlast_key_date.length < 13) {
        //     oEntry.zlast_key_date = oEntry.zlast_key_date ? this.dateFormatter(oEntry.zlast_key_date) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zpayment_on === undefined || this.getView().getModel("Customers").getData().zpayment_on === null || this.getView().getModel("Customers").getData().zpayment_on.length < 13) {
        //     oEntry.zpayment_on = oEntry.zpayment_on ? this.dateFormatter(oEntry.zpayment_on) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zcreated_date === undefined || this.getView().getModel("Customers").getData().zcreated_date === null || this.getView().getModel("Customers").getData().zcreated_date.length < 13) {
        //     oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
        // }
        // if ( this.getView().getModel("Customers").getData().zcl_validity_proposed_date === undefined || this.getView().getModel("Customers").getData().zcl_validity_proposed_date === null || this.getView().getModel("Customers").getData().zcl_validity_proposed_date.length < 13) {
        //     oEntry.zcl_validity_proposed_date = oEntry.zcl_validity_proposed_date ? this.dateFormatter(oEntry.zcl_validity_proposed_date) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zresubmission_on === undefined || this.getView().getModel("Customers").getData().zresubmission_on === null || this.getView().getModel("Customers").getData().zresubmission_on.length < 13) {
        //     oEntry.zresubmission_on = oEntry.zresubmission_on ? this.dateFormatter(oEntry.zresubmission_on) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zvalid_passport_date === undefined || this.getView().getModel("Customers").getData().zvalid_passport_date === null || this.getView().getModel("Customers").getData().zvalid_passport_date.length < 13) {
        //     oEntry.zvalid_passport_date = oEntry.zvalid_passport_date ? this.dateFormatter(oEntry.zvalid_passport_date) : null;
        // }
        // if (this.getView().getModel("Customers").getData().zvisa_valid_date === undefined || this.getView().getModel("Customers").getData().zvisa_valid_date === null || this.getView().getModel("Customers").getData().zvisa_valid_date.length < 13) {
        //     oEntry.zvisa_valid_date = oEntry.zvisa_valid_date ? this.dateFormatter(oEntry.zvisa_valid_date) : null;
        // }
        // if (this.getView().getModel("Customers").getData().znet_due_date === undefined || this.getView().getModel("Customers").getData().znet_due_date === null || this.getView().getModel("Customers").getData().znet_due_date.length < 13) {
        //     oEntry.znet_due_date = oEntry.znet_due_date ? this.dateFormatter(oEntry.znet_due_date) : null;
        // }


        //   delete oEntry.BusinessPartnerDD;
        //   delete oEntry.BPRoles;
        //   delete oEntry.requests;
        //   delete oEntry.EntryCollection;
        //   delete oEntry.zcredit_control_area;
        //   delete oEntry.zvat_gstno_attachment;
        //   oModel.create("/ZDD_CUSTOMER", oEntry, {
        //     success: function (oData, oResponse) {
        //       this.reqestNo = oData.zrequest_no;
        //       this.custNum = oData.zcustomer_num;
        //       this.getView()
        //         .getModel("appView")
        //         .setProperty("/newCustId", oData.zcustomer_num);
        //       this.handleSalesData();

        //       var sCreatedAt = "";
        //       if (oData.zcreated_date) {
        //         sCreatedAt =
        //           oData.zcreated_date.getDate() +
        //           "." +
        //           (oData.zcreated_date.getMonth() + 1) +
        //           "." +
        //           oData.zcreated_date.getFullYear();
        //       }

        //       var oWFModel = that.getOwnerComponent().getModel("Workflow");
        //       var body = {
        //         definitionId:
        //           "eu10.iffcodevprocessautomation.iffcocustomerservices.iFFCOCustomerCreate",
        //         context: {
        //           requesttype: "change",
        //           customerid: that.custNum,
        //           customername: oData.zfirst_name,
        //           customersitename: oData.zfirst_name,
        //           customercountry: oData.zcountry,
        //           businessunit: oData.zbusiness_unit_name,
        //           createdby: oData.zcreated_by,
        //           createdbyrole: "Sales Person",
        //           createdat: sCreatedAt,
        //           salesorganizationid: "", //this.getView().getModel("salesModel").getData() !== undefined ? this.getView().getModel("salesModel").getData().zsales_orgnization.split(" - ")[0] : "1",
        //           linktotask: "https://www.sap.com",
        //           testmode: true,
        //           bulkdocumentid: "",
        //         },
        //       };
        //       oWFModel.create(
        //         "/createWF",
        //         { body: JSON.stringify(body) },
        //         {
        //           success: function (oData) {
        //             sap.m.MessageToast.show(
        //               "Customer is submitted Successfully"
        //             );
        //           },
        //           error: function (oError) {
        //             sap.m.MessageToast.show(
        //               "Error while initiating workflow request!"
        //             );
        //           },
        //         }
        //       );
        //     }.bind(this),
        //     error: function (oError) {
        //       jQuery.sap.require("sap.m.MessageBox");
        //       sap.m.MessageBox.error(oError.message);
        //     },
        //   });
        // }
        // }else{
        //   MessageBox.error("Please fill Legal name, Vertical, Channel Group and Customer Type");
        // }

      },

      dateFormatter: function (value) {
        if (value) {
          value = new Date(value);
          var sNotifDate = new Date(value.toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0];
          // var sNotifDate = new Date(value.toString().split('GMT')[0]).toISOString().split('.')[0];
          return sNotifDate;
        } else return "";
      },
      handleSalesData: function (evt) {
        var that = this;
        var serviceURL = this.getOwnerComponent().getModel().sServiceUrl;
        var oModel = new sap.ui.model.odata.ODataModel(serviceURL, true);

        this.salesPath = "/ZDD_CUST_SALESAREAS";

        var salesEntry = this.getView().getModel("salesDataModel").getData();
        var batchSalesChanges = [];
      
        salesEntry.forEach(function (obj, index) {
            if (obj.Flag == undefined) {

                obj.zcustomer_num = this.custNum == undefined ? this.zcustomer_num : this.custNum;

            }
        }.bind(this));

        salesEntry.forEach(function (obj, index) {

            if (obj.Flag == undefined) {
                obj.zsales_area_id = index.toString();
                obj.zsales_orgnization = obj.zsales_orgnization ? obj.zsales_orgnization.split(" - ")[0] : "";
                obj.zdistribution_channel = obj.zsales_orgnization ? obj.zdistribution_channel.split(" - ")[0] : "";
                obj.zdivision = obj.zsales_orgnization ? obj.zdivision.split(" - ")[0] : "";

                obj.zinvoicing_dates = obj.zinvoicing_dates ? obj.zinvoicing_dates.split(" - ")[0] : "";
                obj.zinvoicing_list_dates = obj.zinvoicing_list_dates ? obj.zinvoicing_list_dates.split(" - ")[0] : "";
                obj.zcustomer_group1 = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[0] : "";
                obj.zcustomer_group2 = obj.zcustomer_group2 ? obj.zcustomer_group2.split(" - ")[0] : "";
                obj.zcustomer_group3 = obj.zcustomer_group3 ? obj.zcustomer_group3.split(" - ")[0] : "";
                obj.zcustomer_group4 = obj.zcustomer_group4 ? obj.zcustomer_group4.split(" - ")[0] : "";
                obj.zcustomer_group5 = obj.zcustomer_group5 ? obj.zcustomer_group5.split(" - ")[0] : "";
                obj.zcustomer_group = obj.zcustomer_group ? obj.zcustomer_group.split(" - ")[0] : "";
                // obj.zinco_term = obj.zsales_orgnization ? obj.zinco_term.split(" - ")[0] : "";
                obj.zcredit_control_area = obj.zcredit_control_area ? obj.zcredit_control_area.split(" - ")[0] : "";
                obj.zprice_group = obj.zprice_group ? obj.zprice_group.split(" - ")[0] : "";
                obj.zpricelist = obj.zpricelist ? obj.zpricelist.split(" - ")[0] : "";
                obj.zprice_procedured_term = obj.zprice_procedured_term ? obj.zprice_procedured_term.split(" - ")[0] : "";
                obj.ztaxcategory = obj.ztaxcategory ? obj.ztaxcategory.split(" - ")[0] : "";
                obj.ztax_classification = obj.ztax_classification ? obj.ztax_classification.split(" - ")[0] : "";
                obj.zdelivery_priority = obj.zdelivery_priority ? obj.zdelivery_priority.split(" - ")[0] : "";
                obj.zshipping_conditions = obj.zshipping_conditions ? obj.zshipping_conditions.split(" - ")[0] : "";
                obj.zdelivery_plant = obj.zdelivery_plant ? obj.zdelivery_plant.split(" - ")[0] : "";
                // obj.zcurrency = obj.zcurrency ? obj.zcurrency.split(" - ")[0] : "";
                obj.zauthorization_group = obj.zauthorization_group ? obj.zauthorization_group.split(" - ")[0] : "";
                obj.zsales_district = obj.zsales_district ? obj.zsales_district.split(" - ")[0] : "";

                // delete obj.Flag;
                batchSalesChanges.push(oModel.createBatchOperation("/ZDD_CUST_SALESAREAS", "POST", obj));
            }else if(obj.Flag === 'U'){
                var salesUpdatePath = "/ZDD_CUST_SALESAREAS(zcustomer_num=guid'" + obj.zcustomer_num + "',zsales_orgnization='" + obj.zsales_orgnization + "',zsales_area_id='" + obj.zsales_area_id + "')";
                obj.zsales_orgnization = obj.zsales_orgnization ? obj.zsales_orgnization.split(" - ")[0] : "";
                obj.zdistribution_channel = obj.zsales_orgnization ? obj.zdistribution_channel.split(" - ")[0] : "";
                obj.zdivision = obj.zsales_orgnization ? obj.zdivision.split(" - ")[0] : "";

                obj.zinvoicing_dates = obj.zinvoicing_dates ? obj.zinvoicing_dates.split(" - ")[0] : "";
                obj.zinvoicing_list_dates = obj.zinvoicing_list_dates ? obj.zinvoicing_list_dates.split(" - ")[0] : "";
                obj.zcustomer_group1 = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[0] : "";
                // obj.zcustomer_group_text1 = obj.zcustomer_group1 ? obj.zcustomer_group.split(" - ")[1] : "";

                obj.zcustomer_group2 = obj.zcustomer_group2 ? obj.zcustomer_group2.split(" - ")[0] : "";
                obj.zcustomer_group_text2 = obj.zcustomer_group2 ? obj.zcustomer_group2.split(" - ")[1] : "";

                obj.zcustomer_group3 = obj.zcustomer_group3 ? obj.zcustomer_group3.split(" - ")[0] : "";
                obj.zcustomer_group_text3 = obj.zcustomer_group3 ? obj.zcustomer_group3.split(" - ")[1] : "";

                obj.zcustomer_group4 = obj.zcustomer_group4 ? obj.zcustomer_group4.split(" - ")[0] : "";
                obj.zcustomer_group_text4 = obj.zcustomer_group4 ? obj.zcustomer_group4.split(" - ")[1] : "";

                obj.zcustomer_group5 = obj.zcustomer_group5 ? obj.zcustomer_group5.split(" - ")[0] : "";
                obj.zcustomer_group_text5 = obj.zcustomer_group5 ? obj.zcustomer_group5.split(" - ")[1] : "";

                obj.zcustomer_group = obj.zcustomer_group ? obj.zcustomer_group.split(" - ")[0] : "";
                obj.zcustomer_group_text = obj.zcustomer_group ? obj.zcustomer_group.split(" - ")[1] : "";
                // obj.zinco_term = obj.zsales_orgnization ? obj.zinco_term.split(" - ")[0] : "";
                obj.zcredit_control_area = obj.zcredit_control_area ? obj.zcredit_control_area.split(" - ")[0] : "";

                obj.zprice_group = obj.zprice_group ? obj.zprice_group.split(" - ")[0] : "";
                obj.zprice_group_text = obj.zprice_group ? obj.zprice_group.split(" - ")[1] : "";
                
                obj.zpricelist = obj.zpricelist ? obj.zpricelist.split(" - ")[0] : "";
                obj.zpricelist_text = obj.zpricelist ? obj.zpricelist.split(" - ")[1] : "";
                
                obj.zprice_procedured_term = obj.zprice_procedured_term ? obj.zprice_procedured_term.split(" - ")[0] : "";
                obj.zprice_procedured_term_text = obj.zprice_procedured_term ? obj.zprice_procedured_term.split(" - ")[1] : "";
                
                obj.ztaxcategory = obj.ztaxcategory ? obj.ztaxcategory.split(" - ")[0] : "";
                obj.ztax_classification = obj.ztax_classification ? obj.ztax_classification.split(" - ")[0] : "";

                obj.zdelivery_priority = obj.zdelivery_priority ? obj.zdelivery_priority.split(" - ")[0] : "";
                obj.zdelivery_priority_text = obj.zdelivery_priority ? obj.zdelivery_priority.split(" - ")[1] : "";

                obj.zshipping_conditions = obj.zshipping_conditions ? obj.zshipping_conditions.split(" - ")[0] : "";
                obj.zshipping_conditions_text = obj.zshipping_conditions ? obj.zshipping_conditions.split(" - ")[1] : "";

                obj.zdelivery_plant = obj.zdelivery_plant ? obj.zdelivery_plant.split(" - ")[0] : "";
                obj.zdelivery_priority_text = obj.zdelivery_plant ? obj.zdelivery_plant.split(" - ")[1] : "";

                // obj.zcurrency = obj.zcurrency ? obj.zcurrency.split(" - ")[0] : "";
                obj.zauthorization_group = obj.zauthorization_group ? obj.zauthorization_group.split(" - ")[0] : "";
                obj.zauthorization_group_text = obj.zauthorization_group ? obj.zauthorization_group.split(" - ")[1] : "";

                obj.zsales_district = obj.zsales_district ? obj.zsales_district.split(" - ")[0] : "";
                obj.zsales_district_text = obj.zsales_district ? obj.zsales_district.split(" - ")[1] : "";

                delete obj.Flag;
                batchSalesChanges.push(oModel.createBatchOperation(salesUpdatePath, "PUT", obj));
            }else if(obj.Flag === 'D'){
                var salesDeletePath = "/ZDD_CUST_SALESAREAS(zcustomer_num=guid'" + obj.zcustomer_num + "',zsales_orgnization='" + obj.zsales_orgnization + "',zsales_area_id='" + obj.zsales_area_id + "')";
                oModel.remove(salesDeletePath, {
                    method: "DELETE",
                    success: function (data) {
    
                    },
                    error: function (e) {
                        jQuery.sap.require("sap.m.MessageBox");
                        sap.m.MessageBox(e);
                    }
                });
            }
        });

        oModel.addBatchChangeOperations(batchSalesChanges);
        oModel.submitBatch(function (data) {

        }, function (err) {
            sap.m.MessageBox.error("Internal Server Error");
            // that.getView().setBusy(false);
        });

    
        this.handleCreditSegmentData();

    },
      handleCreditSegmentData: function (evt) {
        var that = this;
        var serviceURL = this.getOwnerComponent().getModel().sServiceUrl;
        var oModel = new sap.ui.model.odata.ODataModel(serviceURL, true);

        var creditEntry = this.getView()
          .getModel("creditSegmentModel")
          .getData();
        var batchCreditChanges = [];
        creditEntry.forEach(
          function (obj, index) {
            if (obj.Flag == "A") {
              obj.zcustomer_num =
                this.custNum == undefined ? this.zcustomer_num : this.custNum;
              // obj.zrequest_no =
              //   this.reqestNo == undefined ? this.zcustomer_num : this.reqestNo;
              obj.zrelevant = obj.zrelevant == true ? "Y" : "N";
            }
          }.bind(this)
        );

        creditEntry.forEach(function (obj, index) {
          if (obj.Flag == "A") {
            obj.zcredit_id = index.toString();
            delete obj.Flag;
            batchCreditChanges.push(
              oModel.createBatchOperation("/ZCDS_CREDIT_MGT", "POST", obj)
            );
          }
        });

        oModel.addBatchChangeOperations(batchCreditChanges);
        oModel.submitBatch(
          function (data) { },
          function (err) {
            sap.m.MessageBox.error("Internal Server Error");
          }
        );
        this.handleCommentsData();
      },

      handleCommentsData: function () {
        // var oModel = this.getView().getModel();
        // this.getView().getModel("appView").setProperty("/ztext", evt.getParameters().value);

        var that = this;
        this.onConfirm();
        var listItem = this.getOwnerComponent()
          .getModel("commentsModel")
          .getData();
        var serviceURL = this.getOwnerComponent().getModel().sServiceUrl;
        var oModel = new sap.ui.model.odata.ODataModel(serviceURL, true);

        var batchChanges = [];
        listItem.forEach(
          function (obj, index) {
            if (obj.Flag == undefined) {
              obj.zcustomer_num =
                this.custNum == undefined ? this.zcustomer_num : this.custNum;

            }
          }.bind(this)
        );
        listItem.forEach(function (obj, index) {
          obj.zcomment_id = index.toString();
          // obj.zcustomer_num == undefined ? that.zcustomer_num : that.zcustomer_num;
          if (obj.Flag == undefined) {
            delete obj.Flag;
            batchChanges.push(
              oModel.createBatchOperation("/ZDD_CUST_COMMENTS", "POST", obj)
            );
          }
        });

        oModel.addBatchChangeOperations(batchChanges);

        oModel.submitBatch(
          function (data) { },
          function (err) {
            this.getView().setBusy(false);
            sap.m.MessageBox.error("Internal Server Error");

          }
        );
        this.getView().setBusy(false);
        var oRouter = this.getOwnerComponent().getRouter();
        // this.reqNumber
        this.reqestNo = this.reqNumber ? this.reqNumber : this.getView().getModel("Customers").getData().zrequest_no;
        this.successMesg = this.buttonText === 'save' ? 'saved' : 'submitted';

        MessageBox.confirm(
          "Customer id " + this.reqestNo + " has be " + this.successMesg + " successfully",
          {
            actions: [MessageBox.Action.OK],
            emphasizedAction: MessageBox.Action.OK,
            onClose: function (sAction) {
              if (sAction === "OK") {

                oRouter.navTo("RouteView1");
              }
            }
          })


      },

      handleValueHelpForIncoterms: function (evt) {
        this.IncotermsField = evt.getSource();
        this.Incoterms.getBinding("items").filter([]);
        this.Incoterms.open();
      },
      handleValueHelpIncotermsClose: function () {
        this.Incoterms._dialog.close();
      },
      handleValueHelpIncotermsConfirm: function (evt) {
        var title = evt.getParameter("selectedItems")[0].getProperty("title");
        var desc = evt
          .getParameter("selectedItems")[0]
          .getProperty("description");
        this.IncotermsField.setValue(title + " - " + desc);
        // this.busyDialog.close();
      },
      handleValueHelpIncotermsSearch: function (evt) {
        var sValue = evt.getParameter("value");
        if (sValue.length > 0) {
          var oFilter1 = new sap.ui.model.Filter("Inco1", "EQ", sValue);

          this.Incoterms.getBinding("items").filter([oFilter1]);
        } else {
          this.Incoterms.getBinding("items").filter([]);
        }
      },


      handleValueHelpForCurrency: function (evt) {
        this.currencyField = evt.getSource();
        this.currency.getBinding("items").filter([]);
        this.currency.open();
      },
      handleValueHelpCurrencyClose: function () {
        this.currency._dialog.close();
      },
      handleValueHelpCurrencyConfirm: function (evt) {
        var title = evt.getParameter("selectedItems")[0].getProperty("title");
        var desc = evt
          .getParameter("selectedItems")[0]
          .getProperty("description");
        this.currencyField.setValue(title + " - " + desc);
      },
      handleValueHelpCurrencySearch: function (evt) {
        var sValue = evt.getParameter("value");
        if (sValue.length > 0) {
          var oFilter1 = new sap.ui.model.Filter("Waers", "EQ", sValue);
          this.currency.getBinding("items").filter([oFilter1]);
        } else {
          this.currency.getBinding("items").filter([]);
        }
      },

      handleValueHelpForEntityType: function (evt) {
        this.entityTypeField = evt.getSource();
        this.entityType.getBinding("items").filter([]);
        this.entityType.open();
      },
      handleValueHelpEntityClose: function () {
        this.entityType._dialog.close();
      },
      handleValueHelpEntityConfirm: function (evt) {
        var title = evt.getParameter("selectedItems")[0].getProperty("title");
        var desc = evt
          .getParameter("selectedItems")[0]
          .getProperty("description");
        this.entityTypeField.setValue(title + " - " + desc);
      },


      onBack: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteView1");
      },
      handleLiveChange: function (value) {
        if (value) {
          var sNotifDate = new Date(value.toString().split("GMT")[0] + " UTC")
            .toISOString()
            .split(".")[0];
          return sNotifDate;
        } else return "";
      },

      handleCreditLimitTypeSelect: function (evt) {
        // console.log("hi");
        var that = this;
        this.getView()
          .getModel("appView")
          .setProperty(
            "/selectedType",
            evt.getSource().getSelectedButton().getText()
          );
        this.getView().getModel("appView").updateBindings();

        this.toggleSubsection();
      },
      toggleSubsection: function (evt) {
        console.log(evt);
      },

      handleUpdateTaxgridOrder: function (evt) {
        var model = this.getView().getModel("salesModel").oData;
        if (model.length > 0) {
          for (var i = model.length - 1; i >= 0; i--) {
            this.opOrder = model[i].zsales_area_id;
            var integ = parseInt(this.opOrder);
            integ++;
            var res = integ;
            this.opOrder = res.toString();

            break;
          }
        } else {
          this.opOrder = "1";
        }
      },
      handleValidateFormFields: function () {
        var that = this;
        var State = true;
        var salesRequired = true;
        if (this.evtProcess === "CHANGE") {
          var simpleFormIdArr = [
            "orderData1",
            "orderData5",
            "orderData9",
            "orderData6",
            "orderData8",
            "orderData12",
            "orderData81",
            "orderData193",
            "orderData86",
            "orderData125",
            "erpCustomersydata1",
            "erpCustomersydata3",
            "erpCustomersydata5",
            "erpCustomersydata7",
            "erpCustomersydata9",
            "erpCustomersydata11",
            "erpCustomersydata13",
            "erpCustomersydata15",
            "erpCustomersydata17",
            "erpCustomersydata19",
            "erpCustomersydata21",
            "CreditProfileSection1",
            "Planned",
            "Planned4",
            "Planned6",
            "CreditAnalysisView",
            "orderData13",
            "CustomerBackgroundView",
            "DetailsOfExpectedView",
          ];
        } else {
          var simpleFormIdArr = [
            "salesAreadata17"
            ]
        }

        if (this.evtProcess === "CHANGE" && this.getView().getModel("appView").getProperty("/selectedType") === 0) {
          simpleFormIdArr.push("Planned2");
        }
        if (this.evtProcess === "CHANGE" && this.getView().getModel("appView").getProperty("/selectedType") === 1) {
          simpleFormIdArr.push("Planned3");
        }
        if (this.evtProcess === "CHANGE" && this.getView().getModel("appView").getProperty("/selectedType") === 2) {
          simpleFormIdArr.push("Planned2", "Planned3");
        }



        

        for (var j = 0; j < simpleFormIdArr.length; j++) {
          var content =
            this.getView().byId(simpleFormIdArr[j]).getAggregation("_views") !==
              null
              ? this.getView()
                .byId(simpleFormIdArr[j])
                .getAggregation("_views")[0]
                .getContent()[0]
                .getContent()
              : "";
          for (var b = 0; b < content.length; b++) {
            if (content[b].getMetadata().getName() != "sap.ui.core.Title") {
              if (content[b].getVisible()) {
                if (
                  content[b].getMetadata().getName() == "sap.m.Label" &&
                  content[b].getRequired() === true &&
                  content[b].getVisible() === true
                ) {
                  if (content[b + 1].getMetadata().getName() == "sap.m.Input") {
                    if (content[b + 1].getValue() == "") {
                      content[b + 1]
                        .setValueState("Error")
                        .setValueStateText("");
                      State = false;
                      that.registerValidationError(content[b]);
                    } else
                      content[b + 1]
                        .setValueState("None")
                        .setValueStateText("");
                    that.removeValidationError(content[b]);
                  } else if (
                    content[b + 1].getMetadata().getName() == "sap.m.MultiInput"
                  ) {
                    if (content[b + 1].getValue() == "") {
                      content[b + 1]
                        .setValueState("Error")
                        .setValueStateText("");
                      State = false;
                      that.registerValidationError(content[b]);
                    } else
                      content[b + 1]
                        .setValueState("None")
                        .setValueStateText("");
                    that.removeValidationError(content[b]);
                  } else if (
                    content[b + 1].getMetadata().getName() == "sap.m.Select"
                  ) {
                    if (content[b + 1].getSelectedKey() == "None") {
                      content[b + 1]
                        .setValueState("Error")
                        .setValueStateText("");
                      State = false;
                      that.registerValidationError(content[b]);
                    } else
                      content[b + 1]
                        .setValueState("None")
                        .setValueStateText("");
                    that.removeValidationError(content[b]);
                  } else if (
                    content[b + 1].getMetadata().getName() == "sap.m.DatePicker"
                  ) {
                    if (content[b + 1].getValue() == "") {
                      content[b + 1]
                        .setValueState("Error")
                        .setValueStateText("");
                      State = false;
                      that.registerValidationError(content[b]);
                    } else
                      content[b + 1]
                        .setValueState("None")
                        .setValueStateText("");
                    that.removeValidationError(content[b]);
                  }
                }
              }
            }
          }
        }
        // if (this.getView().getModel("salesModel").getData().length > 0) {
        //   salesRequired = false;
        //   that.removeCustomValidationError({ "target": "SalesArea" });
        // } else {
        //   that.registerCustomValidationError({ "table": "Sales Area", "target": "SalesArea", "model": that.getView().getModel("salesModel") });

        // }

        // var formId = this.getView().byId("salesAreadata17").getAggregation("_views")[0].getContent()[0].getContent()[2].getItems();

        //     for(var i=0; i<formId.length; i++){
        //        var salesFormContent =  this.getView().byId("salesAreadata17").getAggregation("_views")[0].getContent()[0].getContent()[2].getItems()[i].getItems()[0].getContent()[0].getItems()[0].getContent();
        //        var isSalesAreaVisible = this.getView().byId("salesAreadata17").getParent().getParent().getVisible();
        //        if (isSalesAreaVisible) {
        //         for (var b = 0; b < salesFormContent.length; b++) {
        //             if (salesFormContent[b].getMetadata().getName() != "sap.ui.core.Title") {
        //                 if (salesFormContent[b].getVisible()) {
        //                     if (salesFormContent[b].getMetadata().getName() == "sap.m.Label" && salesFormContent[b].getRequired() === true && salesFormContent[b].getVisible() ===
        //                         true) {
        //                         if (salesFormContent[b + 1].getMetadata().getName() == "sap.m.Input") {
        //                             if (salesFormContent[b + 1].getValue() == "") {
        //                                 salesFormContent[b + 1].setValueState("Error").setValueStateText("");
        //                                 State = false;
        //                                 that.registerValidationError(salesFormContent[b]);
        //                             } else {
        //                                 salesFormContent[b + 1].setValueState("None").setValueStateText("");
        //                                 that.removeValidationError(salesFormContent[b]);
        //                             }
        //                         } else if (salesFormContent[b + 1].getMetadata().getName() == "sap.m.MultiInput") {
        //                             if (salesFormContent[b + 1].getValue() == "") {
        //                                 salesFormContent[b + 1].setValueState("Error").setValueStateText("");
        //                                 State = false;
        //                                 that.registerValidationError(salesFormContent[b]);
        //                             } else {
        //                                 salesFormContent[b + 1].setValueState("None").setValueStateText("");
        //                                 that.removeValidationError(salesFormContent[b]);
        //                             }
        //                         } else if (salesFormContent[b + 1].getMetadata().getName() == "sap.m.Select") {
        //                             if (salesFormContent[b + 1].getSelectedKey() == "None") {
        //                                 salesFormContent[b + 1].setValueState("Error").setValueStateText("");
        //                                 State = false;
        //                                 that.registerValidationError(salesFormContent[b]);
        //                             } else {
        //                                 salesFormContent[b + 1].setValueState("None").setValueStateText("");
        //                                 that.removeValidationError(salesFormContent[b]);
        //                             }
        //                         } else if (salesFormContent[b + 1].getMetadata().getName() == "sap.m.DatePicker") {
        //                             if (salesFormContent[b + 1].getValue() == "") {
        //                                 salesFormContent[b + 1].setValueState("Error").setValueStateText("");
        //                                 State = false;
        //                                 that.registerValidationError(salesFormContent[b]);
        //                             } else {
        //                                 salesFormContent[b + 1].setValueState("None").setValueStateText("");
        //                                 that.removeValidationError(salesFormContent[b]);
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        // }
        //     }

        if (this.evtProcess === 'CHANGE') {
          if (State === false) {
            this.ValidationMesg = "Please fill the required fields";
          }
        } 

        return State;
      },
      handleLiveChangeForCusReqRadioButtonYes: function (evt) {
        this.getView()
          .getModel("appView")
          .setProperty("/custType", evt.getSource().getText());
        this.getView().getModel("appView").updateBindings(true);
      },
      handleLiveChangeForCusReqRadioButtonNo: function (evt) {
        this.getView()
          .getModel("appView")
          .setProperty("/custType", evt.getSource().getText());
        this.getView().getModel("appView").updateBindings(true);
      },
      onConfirm: function () {
        var dmsPath = this.getOwnerComponent().getModel("DMS").sMetadataUrl;
        $.ajax({
          type: "GET",
          // url: "/sap/opu/odata/sap/API_CV_ATTACHMENT_SRV/$metadata",
          url: dmsPath,
          processData: false,
          contentType: false,
          headers: {

            "X-CSRF-Token": "Fetch"

          },
          success: function (data, response, header) {
            // handle success
            this.token = header.getResponseHeader("x-csrf-token")
            console.log(data);
            this.dms();
          }.bind(this),
          error: function (jqXHR, textStatus, errorThrown) {
            // handle error
          }
        });


      },
      dms: function (evt) {
        var dmsData = this.getOwnerComponent().getModel("dmsModel").getData();
        var dmsPath = this.getOwnerComponent().getModel("DMS").sServiceUrl;
        dmsPath = this.getOwnerComponent().getModel("DMS").sServiceUrl + '/AttachmentContentSet';

        for (var i = 0; i < dmsData.length; i++) {
          $.ajax({
            type: "POST",
            // url: "/sap/opu/odata/sap/API_CV_ATTACHMENT_SRV/AttachmentContentSet",
            url: dmsPath,
            processData: false,
            contentType: false,
            data: this.getOwnerComponent().getModel("dmsModel").getData()[i].file,
            // data: this.getView().getModel("appView").getProperty("/dmsFile"),
            headers: {
              "Content-Type": "application/pdf",
              "slug": this.getOwnerComponent().getModel("dmsModel").getData()[i].fileName,
              "BusinessObjectTypeName": "KNA1",
              "LinkedSAPObjectKey": this.custNum,
              "X-CSRF-Token": this.token,
            },
            success: function (data, response) {

              console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
              // handle error
            }
          });
        }
      },
      onMessagePopoverPress: function (oEvent) {
        var oSourceControl = oEvent.getSource();
        this._getMessagePopover().then(function (oMessagePopover) {
          oMessagePopover.openBy(oSourceControl);
        });
      },

      registerCustomValidationError: function (content) {
        var sTarget = "/" + content.target;
        var aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
        var sMessage = aMessages.filter(function (mItem) {
          return mItem.target === sTarget;
        });
        if (!sMessage || sMessage.length === 0) {
          var oMessage = new Message({
            message: "Missing Required table: " + content.table,
            type: MessageType.Error,
            target: "/" + content.target,
            processor: content.model
          });
          sap.ui.getCore().getMessageManager().addMessages(oMessage);
        }
      },
      registerValidationError: function (content) {
        var sTarget = "/" + content.getProperty("text").replaceAll(' ', '');
        var aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
        var sMessage = aMessages.filter(function (mItem) {
          return mItem.target === sTarget;
        });
        if (!sMessage || sMessage.length === 0) {
          var oMessage = new Message({
            message: "Missing Required Field: " + content.getProperty("text"),
            type: MessageType.Error,
            target: sTarget,
            processor: content.getModel()
          });
          sap.ui.getCore().getMessageManager().addMessages(oMessage);
        }
      },
      removeCustomValidationError: function (content) {
        var sTarget = content && content.target;
        sTarget = "/" + sTarget;
        var aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
        var sMessage = aMessages.filter(function (mItem) {
          return mItem.target === sTarget;
        });
        if (sMessage) {
          sap.ui.getCore().getMessageManager().removeMessages(sMessage);
        }
      },
      removeValidationError: function (content) {
        var sTarget = content && content.getProperty("text") && content.getProperty("text").replaceAll(' ', '');
        sTarget = "/" + sTarget;
        var aMessages = sap.ui.getCore().getMessageManager().getMessageModel().getData();
        var sMessage = aMessages.filter(function (mItem) {
          return mItem.target === sTarget;
        });
        if (sMessage) {
          sap.ui.getCore().getMessageManager().removeMessages(sMessage);
        }
      },

      onClearMessagePopover: function () {
        sap.ui.getCore().getMessageManager().removeAllMessages();
      },
      //################ Private APIs ###################

      _getMessagePopover: function () {
        var oView = this.getView();

        // create popover lazily (singleton)
        if (!this._pMessagePopover) {
          this._pMessagePopover = Fragment.load({
            id: oView.getId(),
            name: "iffco.managecustomer.fragments.MessagePopover"
          }).then(function (oMessagePopover) {
            oView.addDependent(oMessagePopover);
            return oMessagePopover;
          });
        }
        return this._pMessagePopover;
      }
    });
  });
