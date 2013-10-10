Ext.define("SelfScanning.view.Database", {
	extend: "Ext.Container",
	alias: "widget.database",
	id: 'database',
	config: {
		flex: 1,
		layout: 'card',
		items: [{
			xtype: 'list',
			id: 'regionDB',
			store: 'localRegionStore',
			itemTpl: '({GNr}) {Ort}',
			listeners: {
				itemtap: function(view, index, target, record, e, eOpts) {
					console.log(record.Stores().getData());
					record.Stores().load();
					Ext.getCmp('storeDB').setStore(record.Stores());
					view.parent.setActiveItem(1);
				}
			}
		}, {
			xtype: 'list',
			id: 'storeDB',
			// store: regionRecord.stores() -> wird zur Laufzeit gesetzt
			itemTpl: '({FNr}) {Str} in {Ort}'}
		]
	}
});
