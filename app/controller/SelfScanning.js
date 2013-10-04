Ext.define("SelfScanning.controller.SelfScanning", {
	extend: "Ext.app.Controller",
	config: {
		refs: {
			main: 'main',
			startShopping: 'startshopping',
			shoppingCart: 'shoppingcart',
			articleList: 'articlelist'
		},
		control: {
			startShopping: {
				newShoppingCartCommand: 'onNewShoppingCartCommand'
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
			console.log(Ext.getStore('localPriceMappingStore').sync());
			
			// TODO:
			// Der localPriceMappingStore ist jetzt auf dem neusten Stand
			// Jetzt muss ein neue shoppingCart erstellt und angezeigt werden
			// DO IT.
			// 
			var newShoppingCart = Ext.create('SelfScanning.model.ShoppingCart', {
				FNr:FNr,
				GNr:GNr,
				creationDate: Date.now(),
				isComplete: false
			});
			
			Ext.getStore('shoppingCartStore').add(newShoppingCart);
			Ext.getStore('shoppingCartStore').sync();
			
			// shoppingcart-View aktivieren
			Ext.getCmp('mainContainer').setActiveItem('shoppingcart');
			
			// TODO: 
			// Zurück-Button einblenden
			
			// und anschließend das aktuelle shoppingCart-Objekt übergeben
			this.getShoppingCart().setCartItemStore(newShoppingCart);
			
		//}, function(error) {
		//	alert(error);
		//});
	},
	
	onNewCartItemCommand: function(shoppingCart) {
		console.log("onNewCartItemCommand");
		
		//cordova.plugins.barcodeScanner.scan(function(result) {
			//var ean = result.text;
			var ean = '42141105';
			
			var article	= Ext.getStore('localArticleStore').findRecord('ean', ean);
			var price 	= Ext.getStore('localPriceMappingStore').findPriceMapping(article.get('ANr'), shoppingCart.get('FNr'), shoppingCart.get('GNr'));
			
			console.log('PriceMapping found');
			console.log(price);
			
			var newCartItem = Ext.create("SelfScanning.model.CartItem", {
				menge: 1,
			});
			
			newCartItem.setPriceMapping(price);
			newCartItem.setArticle(article);
			newCartItem.setShoppingCart(shoppingCart);
			
			
			console.log(newCartItem);
			
			var cartItemStore = Ext.getStore("cartItemStore");			
			
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
		
		Ext.getStore('localArticleStore').load();
		Ext.getStore('localPriceMappingStore').load();
		Ext.getStore('shoppingCartStore').load();
		
		Ext.Viewport.setActiveItem(this.getMain());
		console.log("launch");
	},
	
	init: function() {
		this.callParent(arguments);
		console.log("init");
	}
});