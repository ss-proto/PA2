Ext.define("SelfScanning.controller.SelfScanning", {
	extend: "Ext.app.Controller",
	config: {
		refs: {
			main: 'main',
			startShopping: 'startshopping',
			continueShopping: 'continueshopping',
			shoppingCart: 'shoppingcart',
			articleList: 'articlelist'
		},
		control: {
			startShopping: {
				newShoppingCartCommand: 'onNewShoppingCartCommand'
			},
			continueShopping: {
				activateShoppingCart: 'activateShoppingCart'
			},
			shoppingCart: {
				newCartItemCommand: "onNewCartItemCommand"
			}
		}
	},
	
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
					
					
					var tmpRec = Ext.create('SelfScanning.model.PriceMapping', {
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
			
			Ext.getStore('localPriceMappingStore').add(records);
			Ext.getStore('localPriceMappingStore').sync();

			// Der localPriceMappingStore ist jetzt auf dem neusten Stand
			// Jetzt muss ein neue shoppingCart erstellt und angezeigt werden
			var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
			var tmpRec = Ext.create('SelfScanning.model.ShoppingCart', '');
			
			tmpRec.setData({
				FNr:FNr,
				GNr:GNr,
				Menge:0,
				Summe:0,
				creationDate: timestamp,
				isComplete: false
			});
			
			var storeIndex = Ext.getStore('localStoreStore').findBy(function(currRec) {
				// FNr und GNr könnten evtl. 3stellig sein ('052'), deswegen parseInt()
				return (parseInt(FNr) == currRec.get('FNr') && parseInt(GNr) == currRec.get('GNr'));
			});
			
			var storeRec = Ext.getStore('localStoreStore').getAt(storeIndex);
			
			// Die Filial-Assoziation setzen
			tmpRec.setStore(storeRec);
			
			// Den neuen shoppingCart-Record hinzufügen
			Ext.getStore('shoppingCartStore').add(tmpRec);
			
			this.activateShoppingCart(tmpRec);
			//}, function(error) {
		//	alert(error);
		//});
	},
	
	activateShoppingCart: function(shoppingCart) {
			// shoppingcart-View aktivieren
			Ext.getCmp('mainContent').setActiveItem('shoppingcart');
			Ext.getCmp('title').setHtml('<b>aktueller</b> Einkauf');
			
			// aktueller shoppingCart-Record setzen
			this.getShoppingCart().setCartItemStore(shoppingCart);
	},
	
	onNewCartItemCommand: function(shoppingCart) {
		console.log("onNewCartItemCommand");
		
		//cordova.plugins.barcodeScanner.scan(function(result) {
			//var ean = result.text;
			var ean = '42141105';
			
			var article	= Ext.getStore('localArticleStore').findRecord('ean', ean);
			
			// Prüfen ob der Artikel bereits im Einkaufswagen liegt
			var cartItem = shoppingCart.CartItems().findRecord('ANr', article.get('ANr'));
			console.log(cartItem);
			if (!cartItem) {
				// Falls der Artikel im Wagen noch nicht vorhanden ist,
				// muss ein neuer cartItem Record erstellt werden
				var price 	= Ext.getStore('localPriceMappingStore').findPriceMapping(article.get('ANr'), shoppingCart.get('FNr'), shoppingCart.get('GNr'));
			
				var newCartItem = Ext.create('SelfScanning.model.CartItem', '');
				newCartItem.setData({
					menge: 1
				});
							
				newCartItem.setPriceMapping(price);
				newCartItem.setArticle(article);
				newCartItem.setShoppingCart(shoppingCart);
				// Komischerweise wird die shoppingcart_id des neuen cartItem Records zwar in die DB geschrieben
				// allerdings anschließend wieder vom Record entfernt
				// -> Auswirkungen?
				// 		1) frisch erstellte shoppingCarts aktualisieren ihre Menge nicht und die Menge ihrer cartItems aktualisiert sich auch nicht.
				
				Ext.getStore("cartItemStore").add(newCartItem);
				
				/*
				 * Komischerweise wird der neue shoppingCart Record in den CartItems-Store doppelt eingefügt.
				 * ein CartItems().load() behebt das Problem, da die Daten dann neu aus dem cartItemStore geladen werden
				 * allerdings muss zunächst (warum auch immer) der Filter des CartItem-Stores wieder gesetzt werden
				 */
				 
				var tmpFilter = shoppingCart.CartItems().getFilters()[0].setValue(shoppingCart.getId());
				shoppingCart.CartItems().setFilters(tmpFilter);
				shoppingCart.CartItems().load();
			} else {
				var alteMenge = parseInt(cartItem.get('menge'));
				console.log(alteMenge);
				// TODO:
				// evtl. setData() verwenden, da es allem Anschein nach Probleme mit der shoppingcart_id gibt.
				cartItem.set('menge', ++alteMenge);
			}
			
			// set('Menge') und set('Summe') muss angestoßen werden, damit sich der Wert aktualisiert
			shoppingCart.set('Menge', '');
			shoppingCart.set('Summe', '');
			
		//}, function(error) {
		//	alert(error);
		//});
	},
	
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
		this.callParent(arguments);
		
		moment.lang('de');
		
		Ext.getStore('localArticleStore').load();
		Ext.getStore('localPriceMappingStore').load();
		Ext.getStore('cartItemStore').load();
		Ext.getStore('shoppingCartStore').load();
		
		Ext.Viewport.setActiveItem(this.getMain());
		console.log("launch");
	},
	
	init: function() {
		this.callParent(arguments);
		console.log("init");
	}
});