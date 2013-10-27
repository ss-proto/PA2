Ext.define('SelfScanning.store.RemoteStores', {
    extend: 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId: 'remoteStoreStore',
        model: "SelfScanning.model.Store",
        proxy: {
            type: 'jsonp',
            url: 'http://www.ss-proto.bplaced.net/getStores.php',
			extraParams: {
				type: 'json'
			},
            reader: {
                type: 'json'
            }
        },
		listeners: {
			load: function(thisStore, records, successful) {
				console.log('RemoteStoreStore loading...');
				console.log(records.length + ' records loaded');
				
				var localStoreStore = Ext.getStore('localStoreStore');
				var localRegionStore = Ext.getStore('localRegionStore');
				localStoreStore.removeAll();
				
				var region;

				records.forEach(function(currRec) {
					region = localRegionStore.findRecord('GNr', currRec.get('GNr'));
					currRec.setRegion(region);
					localStoreStore.add(currRec);
				});
				
				localStoreStore.sync();
				
			}
		}
    }
});