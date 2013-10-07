Ext.define("SelfScanning.model.CartItem", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		//idProperty: 'ean',
		identifier: 'sequential',
		fields: [
			{name: 'ANr', type: 'int'},
			{name: 'menge', type: 'int'},
			{name: 'shoppingcart_id', type:'int'},
			{name: 'pricemapping_id', type: 'int'}
		],
		hasOne: [{
			model: 'SelfScanning.model.Article',
			name: 'Article',
			//primaryKey: 'id',
			foreignKey: 'ANr',				// 'ANr' soll benutzt werden, um das Article-Objekt zu identifizieren
			foreignStore: 'localArticleStore'
		},{
			model: 'SelfScanning.model.PriceMapping',
			name: 'PriceMapping',
			//primaryKey: 'id',
			//foreignKey: 'pricemapping_id',	// 'pricemapping_id' soll benutzt werden, um das Article-Objekt zu identifizieren
			foreignStore: 'localPriceMappingStore'
		}],
		belongsTo: [{
			model: 'SelfScanning.model.ShoppingCart',
			name: 'ShoppingCart',
			//primaryKey: 'shoppingcart_id',
			//foreignKey: 'shoppingCartId',
			foreignStore: 'shoppingCartStore'
		}]
	}
});