Ext.define("SelfScanning.view.ClosedShoppingCarts", {
	extend: "Ext.Container",
	alias: "widget.closedshoppingcarts",
	config: {
		layout: {
			type: 'vbox',
			pack: 'start'
		},
		items: [
			{html: '<div class="subtitle">abgeschlossene Einkäufe</div>'},
			{html: 'Liste aller abgeschlossenen Einkäufe'}
		]
	}
});
