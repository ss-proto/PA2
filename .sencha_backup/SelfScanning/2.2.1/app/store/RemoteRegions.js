Ext.define('SelfScanning.store.RemoteRegions', {
    extend: 'Ext.data.Store',
	requires: [
        'Ext.data.proxy.JsonP'
    ],
    config: {
        storeId: 'remoteRegionStore',
        model: "SelfScanning.model.Region",
        proxy: {
            type: 'jsonp',
            url: 'http://www.ss-proto.bplaced.net/getRegions.php',
			extraParams: {
				type: 'json'
			},
            reader: {
                type: 'json'
            }
        },
		listeners: {
			load: function(thisStore, records, successful) {
				console.log('RemoteRegionStore loading...');
				console.log(records.length + ' records loaded');
				
				var localRegionStore = Ext.getStore('localRegionStore');
				localRegionStore.removeAll();

				records.forEach(function(currRec) {
					localRegionStore.add(currRec);
				});
				
				localRegionStore.sync();
				
				Ext.getStore('remoteStoreStore').load();
			}
		}
    }
});