sap.ui.controller("sap.training.exc14.odata.view.Main", {

	onInit: function() {

		var sUrl = "/sap/opu/odata/sap/ZBC_TRAVEL_SRV/";

		var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl, {
			disableHeadRequestForToken: true
		});

		this.getView().setModel(oModel);
	},

	onFlightChange: function(oEvent) {

		// get the binding context of the selected row
		var selectedRowContext = oEvent.getParameter("rowContext");

		var oBookingTable = this.getView().byId("idBookingTable");

		oBookingTable.bindRows(selectedRowContext + "/Bookings");
	},

	onCancelBooking: function(oEvent) {

		var carrId = oEvent.getSource().data("Carrid");
		var bookId = oEvent.getSource().data("Bookid");

		var oModel = this.getView().getModel();

		oModel.callFunction("/CancelBooking", {
			method: "POST",
			urlParameters: {
				Carrid: carrId,
				Bookid: bookId
			},
			error: function(oError) {
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.error(oError.responseText);
			}
		});
	},

	onCreateBooking: function(oEvent) {

		var carrId = oEvent.getSource().data("Carrid");
		var connId = oEvent.getSource().data("Connid");
		var fldate = oEvent.getSource().data("Fldate");

		var oBookingData = {
			"Carrid": carrId,
			"Connid": connId,
			"Fldate": fldate,
			"Customid": "154",
			"Passname": "Anita Acht",
			"Counter": "1"
		};

		var oBookingTable = this.getView().byId("idBookingTable");
		var oModel = this.getView().getModel();

		oModel.create("/BookingSet", oBookingData, {
			success: function(OData) {
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.success("Buchung angelegt mit Buchungsnummer " + OData.Bookid);

				var oSorter = new sap.ui.model.Sorter("OrderDate", true);
				oBookingTable.getBinding("rows").sort([oSorter]);

			},
			error: function(oError) {
				jQuery.sap.require("sap.m.MessageBox");
				sap.m.MessageBox.error(oError.responseText);
			}
		});
	}
});