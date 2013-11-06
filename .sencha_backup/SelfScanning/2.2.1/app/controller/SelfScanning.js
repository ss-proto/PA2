Ext.define("SelfScanning.controller.SelfScanning", {
	extend: "Ext.app.Controller",
	config: {
		refs: {
			main: 'main',
			startShopping: 'startshopping',
			continueShopping: 'continueshopping',
			shoppingCart: 'shoppingcart',
			articleList: 'articlelist',
			payment: 'payment'
		},
		control: {
			startShopping: {
				newShoppingCartCommand: 'onNewShoppingCartCommand'
			},
			continueShopping: {
				activateShoppingCart: 'activateShoppingCart'
			},
			shoppingCart: {
				lookupArticle: 'lookupArticle',
				createCartItem: "createCartItem"
			},
			payment: {
				renderQRCode: 'renderQRCode'
			}
		}
	},
	
	onNewShoppingCartCommand: function() {
		console.log("onNewShoppingCartCommand");
		
		//cordova.plugins.barcodeScanner.scan(function(result) {
			//var qrCode = result.text;
			var qrCode = '0120530123500066000000123500055000001234500550';
			
			var GNr = qrCode.substr(0,3);
			console.log(GNr);
			var FNr = qrCode.substr(3,3);
			console.log(FNr);
			
			var i = 6;
			var ANr;
			var vkp;
			var records = new Array();
			var level = 'F';
			
			while (qrCode.substr(i,5) != '00000' && qrCode.substr(i,5) != '') {
				while (qrCode.substr(i,5) != '00000' && qrCode.substr(i,5) != '') {
					console.log('now handling new substring: ' + qrCode.substr(i,5));
					
					ANr = qrCode.substr(i,5);
					i += 5;
					console.log(ANr);
					vkp = qrCode.substr(i,5);
					i += 5;
					console.log(vkp);
					vkp = (vkp=='00000') ? null : vkp/100;
					
					// führende Nullen entfernen
					ANr = parseInt(ANr);
					
					var tmpRec = Ext.create('SelfScanning.model.APMapping', {
						ANr:ANr,
						FNr: level == 'F' ? FNr : '000',
						GNr: level == 'L' ? '000' : GNr,
						vkp:vkp
					});
					
					records.push(tmpRec);
				}
				// An dieser Stelle wird '00000' erreicht
				// diese 5 Zeichen (Separator) müssen übersprungen werden
				i += 5;
				
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
			var tmpRec = Ext.create('SelfScanning.model.ShoppingCart', '');
			
			console.log(tmpRec);
			
			tmpRec.setData({
				FNr:FNr,
				GNr:GNr,
				menge:0,
				summe:0,
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
			Ext.getStore('shoppingCartStore').load();
			//}, function(error) {
		//	alert(error);
		//});
	},
	
	activateShoppingCart: function(shoppingCart) {
		// shoppingcart-View aktivieren
		Ext.getCmp('mainContent').push({xtype: 'cartcarousel'});
		
		// aktueller shoppingCart-Record setzen
		this.getShoppingCart().setCartItemStore(shoppingCart);
	},
	
	lookupArticle: function(shoppingCart) {
		// TODO:
		// performance improvement: set articleStore just once, after activating shoppingcart
		
		var FNr = shoppingCart.get('FNr');
		var GNr = shoppingCart.get('GNr');
		var articleNmbrs = [];
		
		var articleStore = Ext.getStore('localAPMappingStore');
		
		articleStore.setStoreFilter(FNr, GNr);
		
		articleStore.load()
		
		Ext.getCmp('mainContent').push({xtype: 'articledb'});
		Ext.getCmp('articledb').setStore(articleStore);
		Ext.getCmp('articledb').on('itemtap', function(thisView, index, target, record, e, eOpts) {
			Ext.getStore('localAPMappingStore').clearFilter();
			this.createCartItem(eOpts.cart, record);
			Ext.getCmp('mainContent').pop();
		}, this, {cart:shoppingCart});
	},
	
	scanArticle: function(shoppingCart) {
		/*cordova.plugins.barcodeScanner.scan(
			function(result) {
				article = Ext.getStore('localArticleStore').findRecord('ean', result);
				this.createCartItem(shoppingCart, source, article);
			}, function(error) {
				alert(error);
			}
		);*/
		
	},
	
	createCartItem: function(shoppingCart, price) {
		console.log('createCartItem() arguments:');
		//console.log(arguments);
		//console.log(this.eOpts.cart);
			
		// Prüfen ob der Artikel bereits im Einkaufswagen liegt
		var cartItem = shoppingCart.CartItems().findRecord('ANr', price.get('ANr'), 0, false, false, true);
		
		if (!cartItem) {
			// Falls der Artikel im Wagen noch nicht vorhanden ist,
			// muss ein neuer cartItem Record erstellt werden
			
			//var price = Ext.getStore('localAPMappingStore').findPriceMapping(article.get('ANr'), shoppingCart.get('FNr'), shoppingCart.get('GNr'));
			
			var newCartItem = Ext.create('SelfScanning.model.CartItem', '');
			
			newCartItem.set('menge', 1);
			newCartItem.setAPMapping(price);
			//newCartItem.setArticle(article);
			newCartItem.setShoppingCart(shoppingCart);
			
			var menge = 1;
			
			newCartItem.setData({
				ANr: price.get('ANr'),
				menge: menge,
				shoppingcart_id: shoppingCart.getId(),
				apmapping_id: price.getId()
			});
			
			
			// Komischerweise wird die shoppingcart_id des neuen cartItem Records zwar in die DB geschrieben
			// allerdings anschließend wieder vom Record entfernt
			// -> Auswirkungen?
			// 		1) frisch erstellte shoppingCarts aktualisieren ihre Menge nicht und die Menge ihrer cartItems aktualisiert sich auch nicht.
			
			//Ext.getStore("cartItemStore").add(newCartItem);
			Ext.getCmp('cartitemlist').getStore().sync();
			
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
		
		Ext.getCmp('cartitemlist').refresh();
		Ext.getCmp('continueshoppinglist').refresh();
	},
	
	pickArticleFromDb: function() {
		console.log('pickArticleFromDb()');
		Ext.getCmp('database').setActiveItem(0);
		
		Ext.getCmp('shoppingcart').hide();
		Ext.getCmp('database').show();
		Ext.getCmp('title').setHtml('Artikel suchen');
		
		return Ext.getStore('localArticleStore').findRecord('ean', '42141105');
	},
	
	renderQRCode: function() {
		var qrdata = this.getShoppingCart().getQRData();
		console.log(qrdata);
		document.getElementById('qrimg').setAttribute('src', QRCode.generatePNG(qrdata));
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
		
		Ext.getStore('localRegionStore').load();
		Ext.getStore('localStoreStore').load();
		Ext.getStore('localArticleStore').load();
		Ext.getStore('localAPMappingStore').load();
		Ext.getStore('cartItemStore').load();
		Ext.getStore('shoppingCartStore').load();
		
		Ext.Viewport.setActiveItem(this.getMain());
		Ext.getCmp('mainContent').setActiveItem('startshopping');
		console.log("launch");
	},
	
	init: function() {
		this.callParent(arguments);
		console.log("init");
	}
});