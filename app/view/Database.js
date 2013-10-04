Ext.define("SelfScanning.view.Database", {
	extend: "Ext.Carousel",
	alias: "widget.database",
	config: {
		items: [
			{xtype: 'articlelist'},
			{xtype: 'pricemapping'}
		]
	}
});
