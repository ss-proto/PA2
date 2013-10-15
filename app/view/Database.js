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
					//console.log(record.Stores().getData());
					record.Stores().setAutoLoad(true);
					Ext.getCmp('storeDB').setStore(record.Stores());
					view.parent.setActiveItem(1);
				}
			}
		}, {
			xtype: 'list',
			id: 'storeDB',
			// store: regionRecord.Stores() -> wird zur Laufzeit gesetzt
			itemTpl: '({FNr}) {Str} in {Ort}',
			listeners: {
				itemtap: function(view, index, target, record, e, eOpts) {
					var FNr = record.get('FNr');
					var GNr = record.get('GNr');
					
					view.parent.fireEvent('showArticleDB', FNr, GNr);
					
				}
			}
		}]
	}
});


// Filter der store.APMappings() auf store_id = FNr || store_id = 0 etc. setzen.