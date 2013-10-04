Ext.define("SelfScanning.view.ShoppingMain", {
	extend: "Ext.Carousel",
	alias: "widget.shoppingmain",
	config: {
		items: [
			{xtype: 'startshopping'},
			{xtype: 'continueshopping'},
			{xtype: 'closedshoppingcarts'}
		]
	}
});
