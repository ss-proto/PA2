Ext.define("SelfScanning.model.CartItem", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql',
		},
		identifier: 'sequential',
		fields: [
			{name: 'ANr', type: 'int'},
			{name: 'menge', type: 'int'},
			{name: 'shoppingcart_id', type:'int'},
			{name: 'apmapping_id', type: 'int'}
		],
		belongsTo: {
			model: 'SelfScanning.model.ShoppingCart',
			name: 'ShoppingCart',
			foreignStore: 'shoppingCartStore'
		},
		hasOne: [{
			model: 'SelfScanning.model.Article',
			name: 'Article',
			//primaryKey: 'id',
			foreignKey: 'ANr',				// 'ANr' soll benutzt werden, um das Article-Objekt zu identifizieren
			foreignStore: 'localArticleStore'
		},{
			model: 'SelfScanning.model.APMapping',
			name: 'APMapping',
			//primaryKey: 'id',
			//foreignKey: 'apmapping_id',	// 'apmapping_id' soll benutzt werden, um das Article-Objekt zu identifizieren
			foreignStore: 'localAPMappingStore'
		}]
	}
});