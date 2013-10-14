Ext.define('SelfScanning.store.ShoppingCarts', {
    extend: "Ext.data.Store",
    config: {
        storeId: 'shoppingCartStore',
        model: "SelfScanning.model.ShoppingCart",
		proxy: {
            type: "sql",
			reader: 'json'
        },
		grouper: {
			groupFn: function(record) {
				var FNr = parseInt(record.get('FNr'));
				var GNr = parseInt(record.get('GNr'));
				var stores = Ext.getStore('localStoreStore');
				
				var storeIndex = stores.findBy(function(currRec) {
					return currRec.get('FNr') == FNr && currRec.get('GNr') == GNr;
				});
				
				var currStore = stores.getAt(storeIndex);
				return currStore.get('Str') + ' in ' + currStore.get('Ort');
			}
		},
		sorters: {
			property: 'creationDate',
			direction: 'DESC'
		},
		listeners: {
			load: function(thisStore, records, eOpts) {
				// Die belongsTo-Assoziation muss manuell gesetzt werden,
				// damit sie nach dem Start der App sofort verf�gbar ist.
				var storeStore = Ext.getStore('localStoreStore');
				var cartItemStore = Ext.getStore('cartItemStore');
				
				for (i in records) {
					// Mithilfe der FNr und GNr wird der Filial-Record geholt
					// und anschlie�end die Assoziation gesetzt
					var FNr = parseInt(records[i].get('FNr'));
					var GNr = parseInt(records[i].get('GNr'));
					
					var storeIndex = storeStore.findBy(function(currRec) {
						return currRec.get('FNr') == FNr && currRec.get('GNr') == GNr;
					});
					var store = storeStore.getAt(storeIndex);
					
					records[i].setStore(store);
					
					// Menge und Summe muss berechnet werden
					records[i].CartItems().load();
					records[i].set('menge', '');
					records[i].set('summe', '');
				}
			}
		},
		autoLoad: true,
		autoSync: true
    }
});