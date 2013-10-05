Ext.define("SelfScanning.view.ContinueShopping", {
	extend: "Ext.Container",
	alias: "widget.continueshopping",
	config: {
		id: 'continueshopping',
		layout: {
			type: 'vbox',
			pack: 'start'
		},
		items: [
			{cls: 'message',
			margin: 15,
			html: 'Um einen vorherigen Einkauf fortzusetzen, tippen Sie auf den entprechenden Eintrag in der Liste.'},
			{xtype: 'list',
			flex: 1,
			ui: 'round',
			itemTpl: '{FNr} {GNr}',
			store: 'shoppingCartStore',
			items: [
				
			]
			}
		]
	}
});
