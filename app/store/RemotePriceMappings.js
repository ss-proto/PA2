Ext.define('SelfScanning.store.RemotePriceMappings', {
    extend: 'Ext.data.Store',
	requires: ['Ext.data.proxy.JsonP', 'Ext.data.reader.Array'],
    config: {
        storeId: 'remotePriceMappingStore',
        model: "SelfScanning.model.PriceMapping",
        proxy: {
            type: 'jsonp',
            url: 'http://www.ss-proto.bplaced.net/getPrices.php',
			extraParams: {
				// set dynamically in beforeload-handler
			},
            reader: {
                type: 'array'
            }
        },
		listeners: {
			beforeload: function() {
				// TODO:
				// Beim ersten Ladevorgang wurde der localPriceMappingStore nocht nicht(!) geladen,
				// d.h. max('timestamp') liefert nichts zurück.
				var localPriceMappingStore = Ext.getStore('localPriceMappingStore');
				var lastDate = localPriceMappingStore.getLastUpdate() || localPriceMappingStore.max('timestamp');

				this.getProxy().setExtraParams({
					cols: 'listung.ANr,FNr,GNr,vkp',
					level: 'FGL',
					type: 'array',
					lastUpdated: lastDate
				});
			},
			load: function(thisStore, records, successful) {
				console.log('onRemotePriceMappingStoreLoad');
				console.log(records.length + ' records loaded');
				
				if (records.length == 0) return;

				var localPriceMappingStore = Ext.getStore('localPriceMappingStore');
				
				// TODO:
				// FUCKING localPriceMappingStore.add(currRec) does not wanna run ! ! !
				// Proposal:
				// change the reader form 'array' to 'json'.
				// just fuck off traffic.
				
				records.forEach(function(currRec) {
					currRec.setDirty();
					currRec.phantom = true;
					//localPriceMappingStore.add(currRec);
				});
				
				localPriceMappingStore.add(records);
				
				console.log(localPriceMappingStore.sync());
			}
		}
    }
});