Ext.define("SelfScanning.model.ShoppingCart", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		/*
		proxy: {
			type: 'sql'
		},*/
		fields: [
			{name: 'FNr'},
			{name: 'GNr'},
			{name: 'menge', type: 'int', convert: function(value, record) {
				return record.CartItems().sum('menge') || 0;
			}},
			{name: 'summe', type: 'float', convert: function(value, record) {
				var total = 0;
				var cartItems = record.CartItems();
				cartItems.each(function(currRec) {
					total += currRec.get('menge') * currRec.getPriceMapping().get('vkp');
				});
				return total;
			}},
			{name: 'creationDate'},
			{name: 'isComplete', type: 'boolean'}
		],
		belongsTo: [{
			model: 'SelfScanning.model.Store',
			name: 'Store',
			foreignStore: 'localStoreStore'
		}],
		hasMany: [{
			model: 'SelfScanning.model.CartItem',
			name: 'CartItems',
			foreignStore: 'cartItemStore'}]
	}
});