Ext.define("SelfScanning.store.CartItems", {
	extend: "Ext.data.Store",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		storeId: 'cartItemStore',
		model: "SelfScanning.model.CartItem",
		proxy: {
			type: 'sql'
		},
		autoLoad: true
	}
});