Ext.define('SelfScanning.store.LocalStores', {
    extend: "Ext.data.Store",
	requires: ['Ext.data.proxy.Sql'],
    config: {
        storeId: 'localStoreStore',
        model: "SelfScanning.model.Store",
		proxy: {
            type: "sql"
        },
		autoLoad: true
    }
});