Ext.define("SelfScanning.model.APMapping", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		fields: [
			{name: 'ANr', mapping: 0},
			{name: 'FNr', mapping: 1},
			{name: 'GNr', mapping: 2},
			{name: 'vkp', mapping: 3, type: 'float'},
			{name: 'store_id', type: 'int'}
		],
		belongsTo: [{
			model: 'SelfScanning.model.Store',
			name: 'Store',
			//primaryKey: 'shoppingcart_id',
			//foreignKey: 'shoppingCartId',
			foreignStore: 'localStoreStore'
		}]
	}
});