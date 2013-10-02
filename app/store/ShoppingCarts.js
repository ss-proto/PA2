Ext.define('SelfScanning.store.ShoppingCarts', {
    extend: "Ext.data.Store",
    config: {
        storeId: 'shoppingCartStore',
        model: "SelfScanning.model.ShoppingCart",
		proxy: {
            type: "sql"
        },
        listeners: {
			
		},
		autoLoad: true
    }
});