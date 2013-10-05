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
			{name: 'Menge', convert: function(value, record) {
				return record.CartItems().getAllCount() || 0;
			}},
			{name: 'Summe', convert: function(value, record) {
				var total = 0;
				var cartItems = record.CartItems();
				cartItems.each(function(currRec) {
					total += currRec.getPriceMapping().get('vkp');
				});
				return total;
			}},
			{name: 'creationDate', type: 'date'},
			{name: 'isComplete', type: 'boolean'}
		],
		belongsTo: {
			model: 'SelfScanning.model.Store',
			name: 'Store',
			foreignStore: 'localStoreStore'
		},
		hasMany: [{
			model: 'SelfScanning.model.CartItem',
			name: 'CartItems',
			//primaryKey: 'shoppingcart_id',
			//foreignKey: 'shoppingcart_id',
			foreignStore: 'cartItemStore'}]
	}
});