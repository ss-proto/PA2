Ext.define("SelfScanning.controller.SelfScanning", {
	extend: "Ext.app.Controller",
	config: {
		refs: {
			main: 'main',
			startShopping: 'startshopping',
			continueShopping: 'continueshopping',
			shoppingCart: 'shoppingcart',
			database: 'database',
			articleDB: 'articleDB',
		},
		control: {
			startShopping: {
				newShoppingCartCommand: 'onNewShoppingCartCommand'
			},
			continueShopping: {
				activateShoppingCart: 'activateShoppingCart'
			},
			shoppingCart: {
				createCartItem: 'createCartItem'
			},
			database: {
				showArticleDB: 'showArticleDB'
			},
			articleDB: {	
				createCartItem: 'createCartItem'
			}
		}
	},
	
	currentShoppingCart: null,
	
	onNewShoppingCartCommand: function() {
		console.log("onNewShoppingCartCommand");
		
		//cordova.plugins.barcodeScanner.scan(function(result) {
			//var qrCode = result.text;
			var qrCode = '01205312350006600001235000550000123500044';
			
			var GNr = qrCode.substr(0,3);
			console.log(GNr);
			var FNr = qrCode.substr(3,3);
			console.log(FNr);
			
			var i = 6;
			var ANr;
			var vkp;
			var records = new Array();
			var level = 'F';
			
			while (qrCode.substr(i,4) != '0000' && qrCode.substr(i,4) != '') {
				while (qrCode.substr(i,4) != '0000' && qrCode.substr(i,4) != '') {
					console.log('now handling new substring: ' + qrCode.substr(i,4));
					
					ANr = qrCode.substr(i,4);
					i += 4;
					console.log(ANr);
					vkp = qrCode.substr(i,5);
					i += 5;
					console.log(vkp);
					vkp = (vkp=='00000') ? null : vkp/100;
					
					
					var tmpRec = Ext.create('SelfScanning.model.APMapping', {
						ANr:ANr,
						FNr: level == 'F' ? FNr : '000',
						GNr: level == 'L' ? '000' : GNr,
						vkp:vkp
					});
					
					records.push(tmpRec);
				}
				// An dieser Stelle wird '0000' erreicht
				// diese 4 Zeichen müssen übersprungen werden
				i += 4;
				
				// außerdem muss beim ersten durchlauf das Level von F auf G gesetzt werden
				if (level == 'F') level = 'G';
				// und beim zweiten Mal von G auf L
				else if (level == 'G') level = 'L';
			}
			
			Ext.getStore('localAPMappingStore').add(records);
			Ext.getStore('localAPMappingStore').sync();

			// Der localAPMappingStore ist jetzt auf dem neusten Stand
			// Jetzt muss ein neue shoppingCart erstellt und angezeigt werden
			
			var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
			var newCart = SelfScanning.model.ShoppingCart.create();
			
			var newCartId = parseInt(newCart.get('id'));
			console.log('newCartId: ' + newCartId);
			
			newCart.set({
				FNr:FNr,
				GNr:GNr,
				menge:0,
				summe:0,
				creationDate: timestamp,
				isComplete: false
			});
						
			/*newCart.setData({
				//id: 200
				FNr:FNr,
				GNr:GNr,
				menge:0,
				summe:0,
				creationDate: timestamp,
				isComplete: false
			});*/
			
			/*Ext.getStore('shoppingCartStore').addData({
				FNr:FNr,
				GNr:GNr,
				menge:0,
				summe:0,
				creationDate: timestamp,
				isComplete: false
			});*/
			
			//Ext.getStore('shoppingCartStore').sync();
			
			var storeIndex = Ext.getStore('localStoreStore').findBy(function(currRec) {
				// FNr und GNr könnten evtl. 3stellig sein ('052'), deswegen parseInt()
				return (parseInt(FNr) == currRec.get('FNr') && parseInt(GNr) == currRec.get('GNr'));
			});
			var storeRec = Ext.getStore('localStoreStore').getAt(storeIndex);
			
			// Die Filial-Assoziation setzen
			newCart.setStore(storeRec);
			
			// Filter des shoppingCart-Reocrds setzen
			// sollte eig mittels CartItems() automatisch gesetzt werden,
			// allerdings ist das bei neu-erstellten shoppingCart-Records nicht der Fall
			newCart.CartItems().setFilters({
				property: 'shoppingcart_id',
				value: newCartId
			});
			
			newCart.save();
			
			//Ext.getStore('shoppingCartStore').add(newCart);
			//Ext.getStore('shoppingCartStore').sync();
			Ext.getStore('shoppingCartStore').load();
			
			//newCart.CartItems().load();
			
			//console.log('new shopping cart created. ID: ' + newCart.get('id'));
			//console.log('last shoppingcart in store: ID: ' + Ext.getStore('shoppingCartStore').first().get('id'));
			//console.log(newCart.CartItems().getFilters()[0].getValue());
			
			this.activateShoppingCart(newCart);
			
			//}, function(error) {
		//	alert(error);
		//});
	},
	
	activateShoppingCart: function(shoppingCart) {
			// shoppingcart-View aktivieren
			Ext.getCmp('mainContent').push({xtype: 'shoppingcart'});
			
			//shoppingCart = Ext.getStore('shoppingCartStore').last();
			console.log(shoppingCart.CartItems());
			
			this.currentShoppingCart = shoppingCart;
			this.getShoppingCart().setCartItemStore(shoppingCart);
	},
	
	createCartItem: function(source, article) {
		var shoppingCart = this.currentShoppingCart;
		
		console.log('createCartItem('+shoppingCart+', '+source+', '+article+')');
		console.log('currentShoppingCart ID: ' + shoppingCart.getId());
		
		if (!article.isModel && source == 'lookup') {
			var FNr = shoppingCart.get('FNr');
			var GNr = shoppingCart.get('GNr');
			this.showArticleDB(FNr, GNr, 'createCartItem');
			return;
		} else if (!article.isModel && source == 'scan') {
			/*cordova.plugins.barcodeScanner.scan(
				function(result) {
					article = Ext.getStore('localArticleStore').findRecord('ean', result);
					this.createCartItem(shoppingCart, source, article);
				}, function(error) {
					alert(error);
				}
			);*/
			article = Ext.getStore('localArticleStore').findRecord('ean', '42141105');
			setTimeout(this.createCartItem(source, article), 500);
			return;
		}
			
		// Prüfen ob der Artikel bereits im Einkaufswagen liegt
		var cartItem = shoppingCart.CartItems().findRecord('ANr', article.get('ANr'));
		
		if (!cartItem) {
			// Falls der Artikel im Wagen noch nicht vorhanden ist,
			// muss ein neuer cartItem Record erstellt werden
			
			var price = Ext.getStore('localAPMappingStore').findPriceMapping(article.get('ANr'), shoppingCart.get('FNr'), shoppingCart.get('GNr'));
			
			var newCartItem = Ext.create('SelfScanning.model.CartItem', '');
			
			newCartItem.set('menge', 1);
			newCartItem.setAPMapping(price);
			newCartItem.setArticle(article);
			newCartItem.setShoppingCart(shoppingCart);
			
			var menge = 1;
			
			newCartItem.setData({
				ANr: article.get('ANr'),
				menge: menge,
				shoppingcart_id: shoppingCart.getId(),
				apmapping_id: price.getId()
			});
			
			
			// Komischerweise wird die shoppingcart_id des neuen cartItem Records zwar in die DB geschrieben
			// allerdings anschließend wieder vom Record entfernt
			// -> Auswirkungen?
			// 		1) frisch erstellte shoppingCarts aktualisieren ihre Menge nicht und die Menge ihrer cartItems aktualisiert sich auch nicht.
			
			Ext.getStore("cartItemStore").add(newCartItem);
			
			/*
			 * Komischerweise wird der neue shoppingCart Record in den CartItems-Store doppelt eingefügt.
			 * ein CartItems().load() behebt das Problem, da die Daten dann neu aus dem cartItemStore geladen werden
			 * allerdings muss zunächst (warum auch immer) der Filter des CartItem-Stores wieder gesetzt werden
			 
			var tmpFilter = shoppingCart.CartItems().getFilters()[0].setValue(shoppingCart.getId());
			shoppingCart.CartItems().setFilters(tmpFilter);
			shoppingCart.CartItems().load();
			*/
			
		} else {
			var alteMenge = parseInt(cartItem.get('menge'));
			// TODO:
			// evtl. setData() verwenden, da es allem Anschein nach Probleme mit der shoppingcart_id gibt.
			cartItem.set('menge', ++alteMenge);
			Ext.getStore('cartItemStore').sync();
		}
		
		// set('Menge') und set('Summe') muss angestoßen werden, damit sich der Wert aktualisiert
		shoppingCart.set('menge', '');
		shoppingCart.set('summe', '');
		
		Ext.getStore('shoppingCartStore').sync();
		
		Ext.getCmp('cartitemlist').getStore().load();
		Ext.getCmp('continueshoppinglist').refresh();
	},
	
	showArticleDB: function(FNr, GNr, onitemtapEvent) {
		console.log('showArticleDB(' + FNr + ', ' + GNr + ')');
		
		var storeIndex = Ext.getStore('localStoreStore').findBy(function(currRec) {
			return currRec.get('FNr') == FNr && currRec.get('GNr') == GNr;
		});
		var storeRecord = Ext.getStore('localStoreStore').getAt(storeIndex);
		
		console.log(storeRecord);
		
		var articleStore = storeRecord.APMappings();
		articleStore.setAutoLoad(true);
		
		var ANrList = [];
		
		articleStore.setFilters({
			ANrList: [],
			filterFn: function(item) {
				var currFNr = parseInt(item.get('FNr'));
				var currGNr = parseInt(item.get('GNr'));
				var currANr = parseInt(item.get('ANr'));
				
				if (currFNr == FNr && currGNr == GNr) {
					// Filialpreise in die Liste schreiben und ohne weitere Prüfung ausgeben
					ANrList.push(currANr);
					return true;
				} else if (currFNr == 0 && currGNr == GNr) {
					// Gesellschaftspreise nur dann ausgeben, wenn sie nicht schon ausgegeben wurden
					if (ANrList.indexOf(currANr) < 0) {
						ANrList.push(currANr);
						return true;
					}
				} else if (currFNr == 0 && currGNr == 0) {
					// Landespreise nur dann ausgeben, wenn sie nicht schon ausgegeben wurden
					if (ANrList.indexOf(currANr) < 0) {
						ANrList.push(currANr);
						return true;
					}
				}
				
				return false;
			}
		});
		
		articleStore.load();
		
		Ext.getCmp('mainContent').push({xtype: 'articleDB'});
		
		Ext.getCmp('articleDB').setStore(articleStore);
		
		if (onitemtapEvent) {
			// Falls ein callback-Event übergeben wurde (onitemtapEvent), wird ein itemtap-Listeners gesetzt
			// der das übergebene Event bei einem itemtap feuert.
			Ext.getCmp('articleDB').on('itemtap', function(thisView, index, target, record, e, eOpts) {
				//console.log('articleDB onitemtap()');
				var articleRec = Ext.getStore('localArticleStore').findRecord('ANr', record.get('ANr'));
				thisView.fireEvent(onitemtapEvent, 'lookup', articleRec);
				
				Ext.getCmp('mainContent').pop();
			});
		}
		
		Ext.getCmp('title').setHtml('Artikel suchen');
		
	}, // showArticleDB(FNr, GNr, onitemtapEvent)
	
	onSaveNoteCommand: function() {
		console.log("onSaveNoteCommand");
		
		var noteEditor = this.getNoteEditor();
		
		var currentNote = noteEditor.getRecord();
		var newValues = noteEditor.getValues();
		
		currentNote.set("title", newValues.title);
		currentNote.set("narrative", newValues.narrative);
		
		var errors = currentNote.validate();
		
		if (!errors.isValid()) {
			Ext.Msg.alert('Wait!', errors.getByField("title")[0].getMessage(), Ext.emptyFn);
			currentNote.reject();
			return;
		}
		
		var notesStore = Ext.getStore("Notes");
		
		if (null == notesStore.findRecord('id', currentNote.data.id)) {
			notesStore.add(currentNote);
		}
		
		notesStore.sync();
		
		notesStore.sort([{property: 'dateCreated', direction: 'DESC'}]);
		
		this.activateNotesList();
	},
	
	launch: function() {
		moment.lang('de');
		
		Ext.getStore('localRegionStore').load();
		Ext.getStore('localStoreStore').load();
		Ext.getStore('localArticleStore').load();
		Ext.getStore('localAPMappingStore').load();
		Ext.getStore('cartItemStore').load();
		Ext.getStore('shoppingCartStore').load();
		
		console.log("launch");
	},
	
	init: function() {
		console.log("init");
	}
});