sap.ui.define([], function () {
	"use strict";

	return {
		getFieldVisibility: function (visibleFlag) {
			if(visibleFlag == true || visibleFlag == "Y")
            return true;
            else
            return false;
		},
        getFieldMandatory:function(mandatFlag){
            if(visibleFlag == true || visibleFlag == "Y")
            return true;
            else
            return false;
        },
        formatDate: function (value) {
                if (value) {
                    var sNotifDate = new Date(value.toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0];
                    return sNotifDate;
                } else return null;
            },
            getFormatDate : function (sDate) {
                if (sDate) {
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November",
					"December"
				];
				var date = sDate.getDate();
				var month = months[sDate.getMonth()];
				var year = sDate.getFullYear();
				return month + " " + date + ", " + year;
            }
        },
        getTotalAmount: function (amt1, amt2, amt3, amt4, amt5, amt6, amt7) {
            // var that= this;
            // console.log(evt);
            // console.log(totalAmt);
            
            if(this.getView().getModel("appView").getProperty("/selectedType") === 0 || this.getView().getModel("appView").getProperty("/selectedType") === 2){
                var totalCredit = 0;
            if (amt1 && parseInt(amt1) && parseInt(amt1) > 0)
                totalCredit += parseInt(amt1);
            if (amt2 && parseInt(amt2) && parseInt(amt2) > 0)
                totalCredit += parseInt(amt2);
            if (amt3 && parseInt(amt3) && parseInt(amt3) > 0)
                totalCredit += parseInt(amt3);
            if (amt4 && parseInt(amt4) && parseInt(amt4) > 0)
                totalCredit += parseInt(amt4);
            if (amt5 && parseInt(amt5) && parseInt(amt5) > 0)
                totalCredit += parseInt(amt5);
            if (amt6 && parseInt(amt6) && parseInt(amt6) > 0)
                totalCredit += parseInt(amt6);
                if (amt6 && parseInt(amt7) && parseInt(amt7) > 0)
                totalCredit += parseInt(amt7);
            this.getView().getModel("Customers").oData.ztot_cl_proposed_tot_securedcl = totalCredit.toString();
            // return totalCredit.toString();
            // var totalCreditAmt = totalCredit.toString();
            return totalCredit;
            }

             
            

            // var totalAmt =parseInt(amt1) + parseInt(amt2) + parseInt(amt3) + parseInt(amt4) + parseInt(amt5) + parseInt(amt6);

        },
        getTotalCreditAmount:function (securedTotal, unSecuredTotal) {
          var securedTotal = securedTotal ? parseInt(securedTotal) : 0 ;
         var unSecuredTotal = unSecuredTotal ? parseInt(unSecuredTotal) : 0;
          var sumOfSecUnsecAmt = securedTotal + unSecuredTotal;
          this.getView().getModel("Customers").oData.ztot_cl_proposed_credit_amount = sumOfSecUnsecAmt.toString();
        //   this.getView().getModel("Customers").oData.ztot_cl_proposed_credit_amount = sumOfSecUnsecAmt.toString();
          return sumOfSecUnsecAmt.toString();
        },
        getVarienceAmt:function(amt, proposedAmt){
            var amt = amt ? parseInt(amt) : 0 ;
         var proposedAmt = proposedAmt ? parseInt(proposedAmt) : 0;
          var sumOfSecUnsecAmt = amt - proposedAmt;
          return Math.abs(sumOfSecUnsecAmt).toString();
        },
        getTotalUnsecuredAmount:function (amt1, amt2, amt3, amt4, amt5, amt6) {
            if(this.getView().getModel("appView").getProperty("/selectedType") === 1 || this.getView().getModel("appView").getProperty("/selectedType") === 2){
                var totalUnsecuredCredit = 0;
                if (amt1 && parseInt(amt1) && parseInt(amt1) > 0)
                totalUnsecuredCredit += parseInt(amt1);
            if (amt2 && parseInt(amt2) && parseInt(amt2) > 0)
                totalUnsecuredCredit += parseInt(amt2);
            if (amt3 && parseInt(amt3) && parseInt(amt3) > 0)
                totalUnsecuredCredit += parseInt(amt3);
            if (amt4 && parseInt(amt4) && parseInt(amt4) > 0)
                totalUnsecuredCredit += parseInt(amt4);
            if (amt5 && parseInt(amt5) && parseInt(amt5) > 0)
                totalUnsecuredCredit += parseInt(amt5);
            if (amt6 && parseInt(amt6) && parseInt(amt6) > 0)
                totalUnsecuredCredit += parseInt(amt6);
                
            var totalUnsecuredCreditAmt = totalUnsecuredCredit.toString();
            this.getView().getModel("Customers").oData.ztot_cl_proposed_tot_unsec_cl = totalUnsecuredCreditAmt;
            return totalUnsecuredCreditAmt;
            }

        },
        getFieldSpace: function (a) {
            for (let i = 0; i < a.length; i++) {
                a = a.replace(a[0], a[0].toUpperCase());
                if (i == 0) {
                    a = a.replace(a[0], a[0].toUpperCase());

                }
                if (a.charCodeAt(i) < 97 && i != 0) {
                    return a.replace(a[i], " " + a[i]);
                }
            }
        },
	};
});