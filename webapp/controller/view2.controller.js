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
      // _onRouteMatched: async function (oEvent) {
      _onRouteMatched: async function (oEvent) {
        this.busyDialog = new sap.m.BusyDialog();
        this.busyDialog.close();
        this.zcustomer_legal_name = oEvent.getParameters().arguments.zcustomer_legal_name;
        this.businessPartnerId = oEvent.getParameters().arguments.zbusinessPartnerId;
        this.mode = oEvent.getParameters().arguments.mode;
        this.getView().getModel("appView").setProperty("/mode", this.mode);

        this.onClearFiles();

        if (this.mode === "edit") {
          this.zsales_orgnization = oEvent.getParameters().arguments.zsales_orgnization ? oEvent.getParameters().arguments.zsales_orgnization : "";
          this.zcustomer_num = oEvent.getParameters().arguments.zcustomer_num;
          // this.uPath = "/ZDD_CUSTOMER(zcustomer_num=guid'" + this.zcustomer_num + "',zsales_orgnization='" + this.zsales_orgnization + "')";
        } else {
          this.getView().getModel("Customers").oData = [];
          this.getView().getModel("appView").getData().status = '';
        }
        this.bpg = oEvent.getParameters().arguments.bpg ? oEvent.getParameters().arguments.bpg : this.getView().getModel("appView").getProperty("/bpg");
        this.getView().getModel("appView").setProperty("/bpg", this.bpg);

        this.uPath = "/ZDD_CUSTOMER(zcustomer_num=guid'" + this.zcustomer_num + "')";

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

        // if (oEvent.getParameters().arguments.zprocess === 'CHANGE') {
        //   this.evtProcessExt = 'Change Customer';
        // } else if (oEvent.getParameters().arguments.zprocess === 'Change Customer') {
        //   this.evtProcessExt = 'Change Customer';
        // } else if (oEvent.getParameters().arguments.zprocess === 'EXTEND') {
        //   this.evtProcessExt = 'Extend Customer';
        // } else {
        //   this.evtProcessExt = 'Extend Customer';
        // }


        if (oEvent.getParameters().arguments.zprocess === 'Change Customer') {
          this.evtProcess = 'CHANGE';
        } else if (oEvent.getParameters().arguments.zprocess === 'Extend Customer') {
          this.evtProcess = 'EXTEND';
        } else {
          this.evtProcess = oEvent.getParameters().arguments.zprocess;
        }

        // this.extendExistingCustomerSet();
        await this.extendExistingCustomerSet();
        this.busyDialog.close();
        if (this.flagForFirstTime) {
          // this.handleRuleEngine();
          window.setTimeout(
            function () {
              this.handleRuleEngine();
            }.bind(this),
            2000
          );
        }
        else {
          this.handleRuleEngine();
        }
        
        // this.getView()
        //   .getModel("appView")
        //   .setProperty("/reqType", oEvent.getParameters().arguments.zprocess);
        this.getView().getModel("appView").setProperty("/reqType", this.evtProcess);
        this.handleHistory();

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
        // return new Promise((resolve, reject) => {
        var oModel = this.getOwnerComponent().getModel();
        this.sPath = "/ZDD_CUSTOMER";
        this.getView().getModel("Customers").updateBindings(true);
        var filters = []
        if (this.mode === 'edit') {
          filters.push(new sap.ui.model.Filter("zbusiness_partner_id", "EQ", this.businessPartnerId));
          filters.push(new sap.ui.model.Filter("zcustomer_num", "EQ", this.zcustomer_num));
        } else {
          filters.push(new sap.ui.model.Filter("zbusiness_partner_id", "EQ", this.businessPartnerId));
        }
        oModel.read(this.sPath, {
          filters: filters,
          // filters: [
          //   new sap.ui.model.Filter("zbusiness_partner_id", "EQ", this.businessPartnerId),
          // ],
          urlParameters: {
            "$expand": "to_salesarea,to_comments,to_credit"
            // "$expand": "to_salesarea,to_comments"
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

                this.requestNo = oData.results[i].zrequest_no;

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
                      "ztax_classification2": oData.results[i].to_salesarea.results[k].ztax_classification2,

                      "zrule": oData.results[i].to_salesarea.results[k].zrule,
                      "ztax_category2": oData.results[i].to_salesarea.results[k].ztax_category2,
                      "zrisk_class": oData.results[i].to_salesarea.results[k].zrisk_class,
                      "zcheck_rule": oData.results[i].to_salesarea.results[k].zcheck_rule,
                      "zlimit_define": oData.results[i].to_salesarea.results[k].zlimit_define,
                      "zlimit": oData.results[i].to_salesarea.results[k].zlimit,
                      "zvalidity_to": oData.results[i].to_salesarea.results[k].zvalidity_to,
                      "zcredit_segment": oData.results[i].to_salesarea.results[k].zcredit_segment,
                      "zrelationship_to_bp": oData.results[i].to_salesarea.results[k].zrelationship_to_bp,
                      "zcredit_control_area_desc": oData.results[i].to_salesarea.results[k].zcredit_control_area_desc,
                      "zcredit_segment_desc": oData.results[i].to_salesarea.results[k].zcredit_segment_desc,
                      "zblockedincm": oData.results[i].to_salesarea.results[k].zblockedincm,
                      "zspecialattention": oData.results[i].to_salesarea.results[k].zspecialattention,
                      "zutiliation_ptg": oData.results[i].to_salesarea.results[k].zutiliation_ptg,
                      "zresubmission_on": oData.results[i].to_salesarea.results[k].zresubmission_on,
                      "zinfo_category": oData.results[i].to_salesarea.results[k].zinfo_category,
                      "zinfo_type": oData.results[i].to_salesarea.results[k].zinfo_type,
                      "zname_of_type": oData.results[i].to_salesarea.results[k].zname_of_type,
                      "zrelevant": oData.results[i].to_salesarea.results[k].zrelevant,
                      "zindividual_step": oData.results[i].to_salesarea.results[k].zindividual_step,
                      "zcredit_amount": oData.results[i].to_salesarea.results[k].zcredit_amount,
                      "zdate_from": oData.results[i].to_salesarea.results[k].zdate_from,
                      "zdate_to": oData.results[i].to_salesarea.results[k].zdate_to,
                      "zcredit_curr": oData.results[i].to_salesarea.results[k].zcredit_curr,
                      "zentered_on": oData.results[i].to_salesarea.results[k].zentered_on,
                      "zdeleted_on": oData.results[i].to_salesarea.results[k].zdeleted_on,
                      "zresubmission_date": oData.results[i].to_salesarea.results[k].zresubmission_date,
                      "ztext_field": oData.results[i].to_salesarea.results[k].ztext_field,
                      "zcredit_curr": oData.results[i].to_salesarea.results[k].zcredit_curr,
                      "zblock_reason": oData.results[i].to_salesarea.results[k].zblock_reason


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
                //Why both are same data
                // this.getView().getModel("appView").setProperty("/status", "Completed");
                this.getView().getModel("appView").setProperty("/status", oData.results[i].zstatus);
                oCustomerDetailModel.refresh();
                this.getDmsData();
                break;
              }
            }

          }.bind(this),
          error: function (error) {
            console.log("Exting customer data is not coming", error);
          },
        });
        // })
      },
      handleRuleEngine: function (oEvent) {
        console.log("ty");
        if (this.evtProcess === 'CHANGE') {
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
        //App.subscribeEvent("DataReceived",this.handleeventbus,this);
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
        // App.subscribeEvent("DataReceived",this.handleeventbus,this);
        var aFilters = [];
        aFilters.push(new sap.ui.model.Filter("Process", "EQ", process));
        aFilters.push(new sap.ui.model.Filter("CustomerType", "EQ", sCustomerType));
        aFilters.push(new sap.ui.model.Filter("ZbusinessPartnerId", "EQ", sBPGrouping));
        if (process !== "" && sCustomerType !== "" && sBPGrouping !== "") {
          var oModel = this.getView().getModel("RuleEngine");

          oModel.read("/ZDD_GET_RULE_Details", {
            filters: aFilters,
            urlParameters: {
              $top: 10000,
            },
            success: function (oData, oResponse) {

              var flatObj = {};
              oData.results.forEach(function (obj, index) {
                var sField = "";
                var rField = "";

                sField += obj.Fieldname.split(" ").join("");
                rField += obj.Fieldname.split(" ").join("");

                if (obj.Visibility) {
                  sField += "Visible";
                  if (!Object.keys(flatObj).includes(sField)) {
                    if (obj.Visibility === "Y") {
                      flatObj[sField] = true;
                    } else {
                      flatObj[sField] = false;
                    }
                  } else {
                    sField += obj.Customersub1.split(" ").join("");
                    if (obj.Visibility === "Y") {
                      flatObj[sField] = true;
                    } else {
                      flatObj[sField] = false;
                    }
                  }
                }
                if (obj.Mandatory) {
                  rField += "Mandatory";

                  if (!Object.keys(flatObj).includes(rField)) {
                    if (obj.Mandatory === "Y") {
                      flatObj[rField] = true;
                    } else {
                      flatObj[rField] = false;
                    }
                  } else {
                    rField += obj.Customersub1.split(" ").join("");
                    if (obj.Mandatory === "Y") {
                      flatObj[rField] = true;
                    } else {
                      flatObj[rField] = false;
                    }
                  }

                }
              }.bind(this)),
                console.log(flatObj);
              this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel({}), "fieldMappingModels");
              this.getView().getModel("fieldMappingModels").oData = flatObj;
              this.getView().getModel("fieldMappingModels").updateBindings(true);
              console.log(this.getView().getModel("fieldMappingModels").oData);
              this.getOwnerComponent().getModel().refresh(true);
              this.busyDialog.close();
              // resolve()
            }.bind(this),
            error: function (oError) {
              this.handleRuleEngine();
            }.bind(this),
          });
        }
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
            this.reqNumber = oEntry.zrequest_no;
            oEntry.zrequest_type =
              this.getView().getModel("appView").getProperty("/reqType") ==
                "CHANGE"
                ? "Change Customer"
                : "Extend Customer";
            oEntry.zstatus = "Completed";
            oEntry.zcredit_limit_type =
              this.getView()
                .getModel("appView")
                .getProperty("/selectedType") === 0
                ? "Secured Credit"
                : "UnSecured Credit";

            oEntry.zdescription = this.getView()
              .getModel("appView")
              .getProperty("/custType");

            var custData = this.getView().getModel("Customers").getData();
            if (custData.zdate_founded !== undefined && custData.zdate_founded === null && (custData.zdate_founded !== undefined|| custData.zdate_founded.length < 13)) {
              oEntry.zdate_founded = oEntry.zdate_founded ? this.dateFormatter(oEntry.zdate_founded) : null;
            }
            if (custData.zliquidationdate !== undefined && custData.zliquidationdate === null || custData.zliquidationdate.length < 13) {
              oEntry.zliquidationdate = oEntry.zliquidationdate ? this.dateFormatter(oEntry.zliquidationdate) : null;
            }
            if (custData.zdate !== undefined && custData.zdate === null || custData.zdate.length < 13) {
              oEntry.zdate = oEntry.zdate ? this.dateFormatter(oEntry.zdate) : null;
            }
            if (custData.zvalid_from !== undefined && custData.zvalid_from === null || custData.zvalid_from.length < 13) {
              oEntry.zvalid_from = oEntry.zvalid_from ? this.dateFormatter(oEntry.zvalid_from) : null;
            }
            if (custData.zvalid_to !== undefined && custData.zvalid_to === null || custData.zvalid_to.length < 13) {
              oEntry.zvalid_to = oEntry.zvalid_to ? this.dateFormatter(oEntry.zvalid_to) : null;
            }
            if (custData.zentry_date !== undefined && custData.zentry_date === null || custData.zentry_date.length < 13) {
              oEntry.zentry_date = oEntry.zentry_date ? this.dateFormatter(oEntry.zentry_date) : null;
            }
            if (custData.zduedate !== undefined && custData.zduedate === null || custData.zduedate.length < 13) {
              oEntry.zduedate = oEntry.zduedate ? this.dateFormatter(oEntry.zduedate) : null;
            }
            //oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
            if (custData.zupdated_date !== undefined && custData.zupdated_date === null || custData.zupdated_date.length < 13) {
              oEntry.zupdated_date = oEntry.zupdated_date ? this.dateFormatter(oEntry.zupdated_date) : null;
            }
            if (custData.zfinalizedon !== undefined && custData.zfinalizedon === null || custData.zfinalizedon.length < 13) {
              oEntry.zfinalizedon = oEntry.zfinalizedon ? this.dateFormatter(oEntry.zfinalizedon) : null;
            }
            if (custData.zlast_key_date !== undefined && custData.zlast_key_date === null || custData.zlast_key_date.length < 13) {
              oEntry.zlast_key_date = oEntry.zlast_key_date ? this.dateFormatter(oEntry.zlast_key_date) : null;
            }
            if (custData.zcreated_date !== undefined && custData.zcreated_date === null || custData.zcreated_date.length < 13) {
              oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
            }
            if (custData.zcl_validity_proposed_date !== undefined && custData.zcl_validity_proposed_date === null || custData.zcl_validity_proposed_date.length < 13) {
              oEntry.zcl_validity_proposed_date = oEntry.zcl_validity_proposed_date ? this.dateFormatter(oEntry.zcl_validity_proposed_date) : null;
            }
            if (custData.zvalid_passport_date !== undefined && custData.zvalid_passport_date === null || custData.zvalid_passport_date.length < 13) {
              oEntry.zvalid_passport_date = oEntry.zvalid_passport_date ? this.dateFormatter(oEntry.zvalid_passport_date) : null;
            }
            if (custData.zvisa_valid_date !== undefined && custData.zvisa_valid_date === null || custData.zvisa_valid_date.length < 13) {
              oEntry.zvisa_valid_date = oEntry.zvisa_valid_date ? this.dateFormatter(oEntry.zvisa_valid_date) : null;
            }

            oEntry.zbusiness_partner_id = this.businessPartnerId;
            this.uPath = "/ZDD_CUSTOMER(zcustomer_num=guid'" + oEntry.zcustomer_num + "')";
            delete oEntry.to_comments;
            delete oEntry.to_salesarea;
            delete oEntry.to_credit;
            delete oEntry.ztype_of_Entity;
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
                  // sCustomerId = that.businessPartnerId;
                } else {
                  sWFRequest = "create";
                  // sCustomerId = oEntry.zcustomer_num;
                }
                sCustomerId = oEntry.zcustomer_num;
                debugger
                var oWFModel = that.getOwnerComponent().getModel("Workflow");
                 // "zbusiness_partner_Id": this.businessPartnerId,
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
                    "bulkdocumentid": "",
                    "requestid": this.reqNumber,
                    "channel": oEntry.zchannel
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
        oEntry.zstatus = "In Draft";
        oEntry.zcredit_limit_type =
          this.getView()
            .getModel("appView")
            .getProperty("/selectedType") === 0
            ? "Secured Credit"
            : "UnSecured Credit";

        oEntry.zdescription = this.getView()
          .getModel("appView")
          .getProperty("/custType");
        var custData = this.getView().getModel("Customers").getData();
        if ((custData.zdate_founded !== undefined && custData.zliquidationdate !== null ) && custData.zdate_founded.length < 13) {
          oEntry.zdate_founded = oEntry.zdate_founded ? this.dateFormatter(oEntry.zdate_founded) : null;
        }
        if ((custData.zliquidationdate !== undefined && custData.zliquidationdate !== null) && custData.zliquidationdate.length < 13) {
          oEntry.zliquidationdate = oEntry.zliquidationdate ? this.dateFormatter(oEntry.zliquidationdate) : null;
        }
        if ((custData.zdate !== undefined && custData.zdate !== null) && custData.zdate.length < 13) {
          oEntry.zdate = oEntry.zdate ? this.dateFormatter(oEntry.zdate) : null;
        }
        if ((custData.zvalid_from !== undefined && custData.zvalid_from !== null) && custData.zvalid_from.length < 13) {
          oEntry.zvalid_from = oEntry.zvalid_from ? this.dateFormatter(oEntry.zvalid_from) : null;
        }
        if ((custData.zvalid_to !== undefined && custData.zvalid_to !== null ) && custData.zvalid_to.length < 13) {
          oEntry.zvalid_to = oEntry.zvalid_to ? this.dateFormatter(oEntry.zvalid_to) : null;
        }
        if ((custData.zentry_date !== undefined && custData.zentry_date !== null) && custData.zentry_date.length < 13) {
          oEntry.zentry_date = oEntry.zentry_date ? this.dateFormatter(oEntry.zentry_date) : null;
        }
        if ((custData.zduedate !== undefined && custData.zduedate !== null ) && custData.zduedate.length < 13) {
          oEntry.zduedate = oEntry.zduedate ? this.dateFormatter(oEntry.zduedate) : null;
        }
        //oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
        if ((custData.zupdated_date !== undefined && custData.zupdated_date !== null ) && custData.zupdated_date.length < 13) {
          oEntry.zupdated_date = oEntry.zupdated_date ? this.dateFormatter(oEntry.zupdated_date) : null;
        }
        if ((custData.zfinalizedon !== undefined && custData.zfinalizedon !== null) && custData.zfinalizedon.length < 13) {
          oEntry.zfinalizedon = oEntry.zfinalizedon ? this.dateFormatter(oEntry.zfinalizedon) : null;
        }
        if ((custData.zlast_key_date !== undefined && custData.zlast_key_date !== null) && custData.zlast_key_date.length < 13) {
          oEntry.zlast_key_date = oEntry.zlast_key_date ? this.dateFormatter(oEntry.zlast_key_date) : null;
        }
        if ((custData.zcreated_date !== undefined && custData.zcreated_date !== null) && custData.zcreated_date.length < 13) {
          oEntry.zcreated_date = oEntry.zcreated_date ? this.dateFormatter(oEntry.zcreated_date) : null;
        }
        if ((custData.zcl_validity_proposed_date !== undefined && custData.zcl_validity_proposed_date !== null) && custData.zcl_validity_proposed_date.length < 13) {
          oEntry.zcl_validity_proposed_date = oEntry.zcl_validity_proposed_date ? this.dateFormatter(oEntry.zcl_validity_proposed_date) : null;
        }
        if ((custData.zvalid_passport_date !== undefined && custData.zvalid_passport_date !== null) && custData.zvalid_passport_date.length < 13) {
          oEntry.zvalid_passport_date = oEntry.zvalid_passport_date ? this.dateFormatter(oEntry.zvalid_passport_date) : null;
        }
        if ((custData.zvisa_valid_date !== undefined && custData.zvisa_valid_date !== null) && custData.zvisa_valid_date.length < 13) {
          oEntry.zvisa_valid_date = oEntry.zvisa_valid_date ? this.dateFormatter(oEntry.zvisa_valid_date) : null;
        }

        if(this.getView().getModel("appView").getProperty("/bpg").split(" ")[0].includes("Intercompany")){
          oEntry.zbusiness_partner_grouping = "Z070";
         }
         else if(this.getView().getModel("appView").getProperty("/bpg").split(" ")[0].includes("Sold")){
             oEntry.zbusiness_partner_grouping = "BP01"
         }
         else if(this.getView().getModel("appView").getProperty("/bpg").split(" ")[0].includes("Ship")){
             oEntry.zbusiness_partner_grouping = "BP02"
         }
         else if(this.getView().getModel("appView").getProperty("/bpg").split(" ")[0].includes("One")){
             oEntry.zbusiness_partner_grouping = "BP08"
         }

        this.uPath = "/ZDD_CUSTOMER(zcustomer_num=guid'" + oEntry.zcustomer_num + "')";

        delete oEntry.to_comments;
        delete oEntry.to_salesarea;
        delete oEntry.to_credit;
        delete oEntry.ztype_of_Entity;
        oEntry.zbusiness_partner_id = this.businessPartnerId,
          oModel.update(this.uPath, oEntry, {
            success: function (oData, oResponse) {
              jQuery.sap.require("sap.m.MessageBox");
              // sap.m.MessageBox.success("Customer Id " + this.getView().getModel("Customers").getData().zrequest_no + " saved Successfully");
              this.handleSalesData();
            }.bind(this),
            error: function (err) {

            }
          });


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

          if (!obj.Flag) {
            // Mohammad sohail: adding business partner id and request no.
            obj.zbusiness_partner_id = this.businessPartnerId;
            obj.zrequest_no = this.reqNumber;
            obj.zsales_area_id = index.toString();
            obj.zsales_orgnization = obj.zsales_orgnization ? obj.zsales_orgnization.split(" - ")[0] : "";
            obj.zsales_orgnization_text = obj.zsales_orgnization ? obj.zsales_orgnization.split(" - ")[1] : "";

            obj.zdistribution_channel = obj.zdistribution_channel ? obj.zdistribution_channel.split(" - ")[0] : "";
            obj.zdistribution_channel_text = obj.zdistribution_channel ? obj.zdistribution_channel.split(" - ")[1] : "";

            obj.zdivision = obj.zdivision ? obj.zdivision.split(" - ")[0] : "";
            obj.zdivision_text = obj.zdivision ? obj.zdivision.split(" - ")[0] : "";

            obj.zinvoicing_dates = obj.zinvoicing_dates ? obj.zinvoicing_dates.split(" - ")[0] : "";
            obj.zinvoicing_list_dates = obj.zinvoicing_list_dates ? obj.zinvoicing_list_dates.split(" - ")[0] : "";
            obj.zcustomer_group1 = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[0] : "";
            obj.zcustomer_group1_text = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[1] : "";
            obj.zcustomer_group2 = obj.zcustomer_group2 ? obj.zcustomer_group2.split(" - ")[0] : "";
            obj.zcustomer_group2_text = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[1] : "";
            obj.zcustomer_group3 = obj.zcustomer_group3 ? obj.zcustomer_group3.split(" - ")[0] : "";
            obj.zcustomer_group3_text = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[1] : "";
            obj.zcustomer_group4 = obj.zcustomer_group4 ? obj.zcustomer_group4.split(" - ")[0] : "";
            obj.zcustomer_group4_text = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[1] : "";
            obj.zcustomer_group5 = obj.zcustomer_group5 ? obj.zcustomer_group5.split(" - ")[0] : "";
            obj.zcustomer_group5_text = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[1] : "";
            obj.zcustomer_group = obj.zcustomer_group ? obj.zcustomer_group.split(" - ")[0] : "";
            obj.zcustomer_group_text = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[1] : "";
            // obj.zinco_term = obj.zsales_orgnization ? obj.zinco_term.split(" - ")[0] : "";
            obj.zcredit_control_area = obj.zcredit_control_area ? obj.zcredit_control_area.split(" - ")[0] : "";
            obj.zcredit_control_area_desc = obj.zcredit_control_area ? obj.zcredit_control_area.split(" - ")[1] : "";

            obj.zprice_group = obj.zprice_group ? obj.zprice_group.split(" - ")[0] : "";
            obj.zprice_group_text = obj.zprice_group ? obj.zprice_group.split(" - ")[1] : "";
            // obj.zcredit_control_area = obj.zcredit_control_area ? obj.zcredit_control_area.split(" - ")[0] : "";
            obj.zpricelist = obj.zpricelist ? obj.zpricelist.split(" - ")[0] : "";
            obj.zpricelist_text = obj.zpricelist ? obj.zpricelist.split(" - ")[1] : "";

            obj.zprice_procedured_term = obj.zprice_procedured_term ? obj.zprice_procedured_term.split(" - ")[0] : "";
            obj.zprice_procedured_term_text = obj.zprice_procedured_term ? obj.zprice_procedured_term.split(" - ")[1] : "";

            obj.ztaxcategory = obj.ztaxcategory ? obj.ztaxcategory.split(" - ")[0] : "";
            obj.ztax_classification = obj.ztax_classification ? obj.ztax_classification.split(" - ")[0] : "";
            obj.zdelivery_priority = obj.zdelivery_priority ? obj.zdelivery_priority.split(" - ")[0] : "";
            obj.zshipping_conditions = obj.zshipping_conditions ? obj.zshipping_conditions.split(" - ")[0] : "";
            obj.zshipping_conditions_text = obj.zshipping_conditions ? obj.zshipping_conditions.split(" - ")[1] : "";
            // obj.zcredit_control_area = obj.zcredit_control_area ? obj.zcredit_control_area.split(" - ")[0] : "";
            obj.zdelivery_plant = obj.zdelivery_plant ? obj.zdelivery_plant.split(" - ")[0] : "";
            obj.zdelivery_plant_text = obj.zdelivery_plant ? obj.zdelivery_plant.split(" - ")[0] : "";
            obj.zsales_currency = obj.zsales_currency ? obj.zsales_currency.split(" - ")[0] : "";

            obj.zauthorization_group = obj.zauthorization_group ? obj.zauthorization_group.split(" - ")[0] : "";
            obj.zauthorization_group_text = obj.zauthorization_group ? obj.zauthorization_group.split(" - ")[1] : "";

            obj.zsales_district = obj.zsales_district ? obj.zsales_district.split(" - ")[0] : "";
            obj.zsales_district_text = obj.zsales_district ? obj.zsales_district.split(" - ")[1] : "";


            obj.zinfo_category = obj.zinfo_category ? obj.zinfo_category.split(" - ")[0] : "";
            obj.zinfo_type = obj.zinfo_type ? obj.zinfo_type.split(" - ")[0] : "";
            obj.zblock_reason = obj.zblock_reason ? obj.zblock_reason.split(" - ")[0] : "";

            obj.zresubmission_on = obj.zresubmission_on ? this.dateFormatter(obj.zresubmission_on) : null;
            obj.zdate_from = obj.zdate_from ? this.dateFormatter(obj.zdate_from) : null;
            obj.zdate_to = obj.zdate_to ? this.dateFormatter(obj.zdate_to) : null;
            obj.zentered_on = obj.zentered_on ? this.dateFormatter(obj.zentered_on) : null;
            obj.zdeleted_on = obj.zdeleted_on ? this.dateFormatter(obj.zdeleted_on) : null;
            obj.zvalidity_to = obj.zvalidity_to ? this.dateFormatter(obj.zvalidity_to) : null;
            obj.zresubmission_date = obj.zresubmission_date ? this.dateFormatter(obj.zresubmission_date) : null;

            var salesVal = this.getView().byId("salesAreadata17").getAggregation("_views")[0].getContent()[0].getContent()[2].getItems();
            var checkBoxValue = salesVal.length > 0 ? salesVal[index].getItems()[0].getContent()[0].getItems()[0].getContent() : "";
            if (checkBoxValue.length > 0) {
              if (checkBoxValue[123].getId().includes("box")) {
                obj.zblockedincm = checkBoxValue[123].getSelected() ? 'Y' : 'N';
              }
              if (checkBoxValue[125].getId().includes("box")) {
                obj.zspecialattention = checkBoxValue[125].getSelected() ? 'Y' : 'N';
              }
              if (checkBoxValue[153].getId().includes("box")) {
                obj.zrelevant = checkBoxValue[153].getSelected() ? 'Y' : 'N';
              }
            } else {
              obj.zblockedincm = 'N';
              obj.zspecialattention = 'N';
              obj.zrelevant = 'N';
            }
            // delete obj.Flag;
            batchSalesChanges.push(oModel.createBatchOperation("/ZDD_CUST_SALESAREAS", "POST", obj));
          } else if (obj.Flag === 'U') {
            var salesUpdatePath = "/ZDD_CUST_SALESAREAS(zcustomer_num=guid'" + obj.zcustomer_num + "',zsales_orgnization='" + obj.zsales_orgnization + "',zsales_area_id='" + obj.zsales_area_id + "')";
            // var salesUpdatePath = "/ZDD_CUST_SALESAREAS(zcustomer_num=guid'" + obj.zcustomer_num + "',zsales_area_id='" + obj.zsales_area_id + "')";
            // Mohammad sohail: adding business partner id and request no.
            obj.zbusiness_partner_id = this.businessPartnerId;
            obj.zrequest_no = this.reqNumber;
            obj.zsales_orgnization = obj.zsales_orgnization ? obj.zsales_orgnization.split(" - ")[0] : "";
            obj.zdistribution_channel = obj.zdistribution_channel ? obj.zdistribution_channel.split(" - ")[0] : "";
            obj.zdivision = obj.zdivision ? obj.zdivision.split(" - ")[0] : "";
            obj.zinvoicing_dates = obj.zinvoicing_dates ? obj.zinvoicing_dates.split(" - ")[0] : "";
            obj.zinvoicing_list_dates = obj.zinvoicing_list_dates ? obj.zinvoicing_list_dates.split(" - ")[0] : "";
            obj.zcustomer_group1 = obj.zcustomer_group1 ? obj.zcustomer_group1.split(" - ")[0] : "";

            obj.zcustomer_group2 = obj.zcustomer_group2 ? obj.zcustomer_group2.split(" - ")[0] : "";

            obj.zcustomer_group3 = obj.zcustomer_group3 ? obj.zcustomer_group3.split(" - ")[0] : "";

            obj.zcustomer_group4 = obj.zcustomer_group4 ? obj.zcustomer_group4.split(" - ")[0] : "";

            obj.zcustomer_group5 = obj.zcustomer_group5 ? obj.zcustomer_group5.split(" - ")[0] : "";

            obj.zcustomer_group = obj.zcustomer_group ? obj.zcustomer_group.split(" - ")[0] : "";

            obj.zcredit_control_area = obj.zcredit_control_area ? obj.zcredit_control_area.split(" - ")[0] : "";

            obj.zprice_group = obj.zprice_group ? obj.zprice_group.split(" - ")[0] : "";

            obj.zpricelist = obj.zpricelist ? obj.zpricelist.split(" - ")[0] : "";
            obj.zprice_procedured_term = obj.zprice_procedured_term ? obj.zprice_procedured_term.split(" - ")[0] : "";
            obj.ztaxcategory = obj.ztaxcategory ? obj.ztaxcategory.split(" - ")[0] : "";
            obj.ztax_classification = obj.ztax_classification ? obj.ztax_classification.split(" - ")[0] : "";
            obj.zdelivery_priority = obj.zdelivery_priority ? obj.zdelivery_priority.split(" - ")[0] : "";
            obj.zshipping_conditions = obj.zshipping_conditions ? obj.zshipping_conditions.split(" - ")[0] : "";
            obj.zdelivery_plant = obj.zdelivery_plant ? obj.zdelivery_plant.split(" - ")[0] : "";
            obj.zdelivery_plant_text = obj.zdelivery_plant ? obj.zdelivery_plant.split(" - ")[0] : "";
            obj.zsales_currency = obj.zsales_currency ? obj.zsales_currency.split(" - ")[0] : "";
            obj.zauthorization_group = obj.zauthorization_group ? obj.zauthorization_group.split(" - ")[0] : "";
            obj.zsales_district = obj.zsales_district ? obj.zsales_district.split(" - ")[0] : "";
            obj.zinfo_category = obj.zinfo_category ? obj.zinfo_category.split(" - ")[0] : "";
            obj.zinfo_type = obj.zinfo_type ? obj.zinfo_type.split(" - ")[0] : "";
            obj.zblock_reason = obj.zblock_reason ? obj.zblock_reason.split(" - ")[0] : "";
            obj.zresubmission_on = obj.zresubmission_on ? this.dateFormatter(obj.zresubmission_on) : null;
            obj.zdate_from = obj.zdate_from ? this.dateFormatter(obj.zdate_from) : null;
            obj.zdate_to = obj.zdate_to ? this.dateFormatter(obj.zdate_to) : null;
            obj.zentered_on = obj.zentered_on ? this.dateFormatter(obj.zentered_on) : null;
            obj.zdeleted_on = obj.zdeleted_on ? this.dateFormatter(obj.zdeleted_on) : null;
            obj.zvalidity_to = obj.zvalidity_to ? this.dateFormatter(obj.zvalidity_to) : null;
            obj.zresubmission_date = obj.zresubmission_date ? this.dateFormatter(obj.zresubmission_date) : null;
            var salesVal = this.getView().byId("salesAreadata17").getAggregation("_views")[0].getContent()[0].getContent()[2].getItems();
            var checkBoxValue = salesVal.length > 0 ? salesVal[index].getItems()[0].getContent()[0].getItems()[0].getContent() : "";
            if (checkBoxValue.length > 0) {
              if (checkBoxValue[123].getId().includes("box")) {
                obj.zblockedincm = checkBoxValue[123].getSelected() ? 'Y' : 'N';
              }
              if (checkBoxValue[125].getId().includes("box")) {
                obj.zspecialattention = checkBoxValue[125].getSelected() ? 'Y' : 'N';
              }
              if (checkBoxValue[153].getId().includes("box")) {
                obj.zrelevant = checkBoxValue[153].getSelected() ? 'Y' : 'N';
              }
            } else {
              obj.zblockedincm = 'N';
              obj.zspecialattention = 'N';
              obj.zrelevant = 'N';
            }
            delete obj.Flag;
            batchSalesChanges.push(oModel.createBatchOperation(salesUpdatePath, "PUT", obj));
          } else if (obj.Flag === 'D') {
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
        }.bind(this));

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

        if (this.getView().byId("salesAreadata17").getAggregation("_views") !== null) {
          var panel = this.getView().byId("salesAreadata17").getAggregation("_views")[0].getContent()[0].getContent()[2].getItems();
        }
        if (panel.length > 0) {
          for (var i = 0; i < panel.length; i++) {
            panel[i].destroy();
          }
        }
        this.getView().getModel("appView").setProperty("/generateSale", false);

        var oRouter = this.getOwnerComponent().getRouter();
        // this.reqNumber
        this.reqestNo = this.reqNumber ? this.reqNumber : this.getView().getModel("Customers").getData().zrequest_no;
        this.successMesg = this.buttonText === 'save' ? 'saved' : 'submitted';

        MessageBox.confirm(
          "Customer id " + this.reqestNo + " has been " + this.successMesg + " successfully",
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
        var desc = evt.getParameter("selectedItems")[0].getProperty("description");
        this.currencyField.setValue(title + " - " + desc);
        this.currency.getBinding("items").filter([]);
        this.currency.close();
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
        this.getView().getModel("appView").setProperty("/generateSale", false);
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
      onClearFiles : function () {
        var simpleFormIdArr = ["CreditAnalysisView", "Planned2", "orderData193", "orderData13"];

        for (var j = 0; j < simpleFormIdArr.length; j++) {
            var content = this.getView().byId(simpleFormIdArr[j]).getAggregation("_views") !== null ? this.getView().byId(simpleFormIdArr[j]).getAggregation("_views")[0].getContent()[0].getContent() : "";
            var isVisible = this.getView().byId(simpleFormIdArr[j]).getParent().getParent().getVisible();

            if (isVisible) {
                for (var b = 0; b < content.length; b++) {
                    if (content[b].getMetadata().getName() != "sap.ui.core.Title") {
                        if (content[b].getVisible()) {
                            if (content[b].getMetadata().getName() == "sap.m.Label" && content[b].getVisible() ===
                                true) {
                                if (content[b + 1].getMetadata().getName() == "sap.ui.unified.FileUploader") {
                                    if (content[b + 1].getValue() !== "") {
                                        content[b + 1].clear();
                                        
                                    } 
                                } 
                            }
                        }
                    }
                }
            }
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
            "Planned",
            "Planned4",
            "Planned6",
            "CreditAnalysisView",
            "orderData13",
            "CustomerBackgroundView",
            "DetailsOfExpectedView",
          ];
        } else if (this.evtProcess === "CHANGE" && this.getView().getModel("appView").getProperty("/vertical") === 'Cash') {
          var simpleFormIdArr = ["orderData1",
            "orderData5",
            "orderData9",
            "orderData6",
            "orderData8",
            "orderData12",
            "orderData81",
            "orderData193",
            "orderData86",
            "orderData125"]
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
        if (simpleFormIdArr) {
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
        }
        if (this.evtProcess === "EXTEND" || this.getView().getModel("appView").getProperty("/vertical") === 'Cash') {
          var formId = this.getView().byId("salesAreadata17").getAggregation("_views")[0].getContent()[0].getContent()[2].getItems();

          for (var i = 0; i < formId.length; i++) {
            var salesFormContent = this.getView().byId("salesAreadata17").getAggregation("_views")[0].getContent()[0].getContent()[2].getItems()[i].getItems()[0].getContent()[0].getItems()[0].getContent();
            var isSalesAreaVisible = this.getView().byId("salesAreadata17").getParent().getParent().getVisible();
            if (isSalesAreaVisible) {
              for (var b = 0; b < salesFormContent.length; b++) {
                if (salesFormContent[b].getMetadata().getName() != "sap.ui.core.Title") {
                  if (salesFormContent[b].getVisible()) {
                    if (salesFormContent[b].getMetadata().getName() == "sap.m.Label" && salesFormContent[b].getRequired() === true && salesFormContent[b].getVisible() ===
                      true) {
                      if (salesFormContent[b + 1].getMetadata().getName() == "sap.m.Input") {
                        if (salesFormContent[b + 1].getValue() == "") {
                          salesFormContent[b + 1].setValueState("Error").setValueStateText("");
                          State = false;
                          that.registerValidationError(salesFormContent[b]);
                        } else {
                          salesFormContent[b + 1].setValueState("None").setValueStateText("");
                          that.removeValidationError(salesFormContent[b]);
                        }
                      } else if (salesFormContent[b + 1].getMetadata().getName() == "sap.m.MultiInput") {
                        if (salesFormContent[b + 1].getValue() == "") {
                          salesFormContent[b + 1].setValueState("Error").setValueStateText("");
                          State = false;
                          that.registerValidationError(salesFormContent[b]);
                        } else {
                          salesFormContent[b + 1].setValueState("None").setValueStateText("");
                          that.removeValidationError(salesFormContent[b]);
                        }
                      } else if (salesFormContent[b + 1].getMetadata().getName() == "sap.m.Select") {
                        if (salesFormContent[b + 1].getSelectedKey() == "None") {
                          salesFormContent[b + 1].setValueState("Error").setValueStateText("");
                          State = false;
                          that.registerValidationError(salesFormContent[b]);
                        } else {
                          salesFormContent[b + 1].setValueState("None").setValueStateText("");
                          that.removeValidationError(salesFormContent[b]);
                        }
                      } else if (salesFormContent[b + 1].getMetadata().getName() == "sap.m.DatePicker") {
                        if (salesFormContent[b + 1].getValue() == "") {
                          salesFormContent[b + 1].setValueState("Error").setValueStateText("");
                          State = false;
                          that.registerValidationError(salesFormContent[b]);
                        } else {
                          salesFormContent[b + 1].setValueState("None").setValueStateText("");
                          that.removeValidationError(salesFormContent[b]);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }


        if (State === false) {
          this.ValidationMesg = "Please fill the required fields";
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
        try {
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

        } catch (error) {

        }

      },
      dms: function (evt) {
        try {
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
        } catch (error) {

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
