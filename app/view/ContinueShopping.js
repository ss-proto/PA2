Ext.define("SelfScanning.view.ContinueShopping", {
	extend: "Ext.Container",
	alias: "widget.continueshopping",
	config: {
		layout: {
			type: 'vbox',
			pack: 'start'
		},
		items: [
			{html: '<div class="subtitle">vorherigen Einkauf fortführen</div>'},
			{html: 'Tippen Sie auf einen Einkauf in der Liste, um diesen fortzuführen.'}
		]
	}
});
