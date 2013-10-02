Ext.define('SelfScanning.store.LocalPriceMappings', {
    extend: "Ext.data.Store",
	requires: ['Ext.data.proxy.Sql'],
    config: {
        storeId: 'localPriceMappingStore',
        model: "SelfScanning.model.PriceMapping",
        listeners: {
			addrecords: function(thisStore, records, eOpts) {
				console.log('localPriceMapping addrecords');
				console.log('records: ' + records.length)
				console.log(records);
				
				records.forEach(function(currRec) {
					thisStore.setLastUpdate(new Date());
					
					console.log('now handling: ');
					console.log(currRec.getData());

					// Zunächst prüfen ob ein alter Eintrag mit gleicher ANr, FNr und GNr vorhanden ist
					var oldRecIndex = thisStore.findBy(function(filterRec) {
						if (currRec.get('id') != filterRec.get('id') && currRec.get('ANr') == filterRec.get('ANr') && currRec.get('FNr') == filterRec.get('FNr') && currRec.get('GNr') == filterRec.get('GNr')) {
							return true;
						} else {
							return false;
						}
					});
					
					console.log(oldRecIndex);
					
					var oldRec = (oldRecIndex >= 0) ? thisStore.getAt(oldRecIndex) : null;
					
					if (oldRec == null) {
						// Kein alter Eintrag vorhanden
						console.log('Kein Eintrag vorhanden');
						//console.log(currRec.getData());
						if (currRec.get('vkp') == null) {
							// Sollte es sich um einen ungültigen Eintrag handeln, muss das Einfügen rückgängig gemacht werden
							thisStore.remove(currRec);
						}
					} else {
						// Es ist ein alter Eintrag in localArticleStore vorhanden
						console.log('Found oldRec:');
						console.log(oldRec.getData());
						if (currRec.get('vkp') == null) {
							// Wenn es sich um ein zu löschender Datensatz handelt, muss das Einfügen rückgängig gemacht werden
							thisStore.remove(oldRec);
							console.log('oldRec removed');
							thisStore.remove(currRec);
							console.log('currRec removed');
						} else {
							thisStore.remove(currRec);
							//console.log('removed ' + currRec.get('ANr') + ': ' + currRec.get('vkp'));
							if (currRec.get('vkp') != oldRec.get('vkp')) {
								
								oldRec.set('vkp', currRec.get('vkp'));
								oldRec.setDirty();
								console.log('updated oldRec:');
								console.log(oldRec.getData());
							}
						} 
					}
				});
			}
		},
		proxy: {
            type: "sql"
        },
		autoLoad: true,
		lastUpdate: null
    }
});