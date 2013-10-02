Ext.define("SelfScanning.model.ShoppingCart", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		identifier: {
			type: 'sequential',
			seed: 0
		},
		//idProperty: 'shoppingcart_id',
		fields: [
			//{name: 'shoppingcart_id'},
			{name: 'FNr'},
			{name: 'GNr'},
			{name: 'creationDate', type: 'date'},
			{name: 'isComplete', type: 'boolean'}
		],
		hasMany: [{
			model: 'SelfScanning.model.CartItem',
			name: 'CartItems',
			//primaryKey: 'shoppingcart_id',
			//foreignKey: 'shoppingcart_id',
			foreignStore: 'cartItemStore'}]
	}
});