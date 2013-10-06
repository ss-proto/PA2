Ext.define("SelfScanning.store.CartItems", {
	extend: "Ext.data.Store",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		storeId: 'cartItemStore',
		model: "SelfScanning.model.CartItem",
		proxy: {
			type: 'sql'
		},
		listeners: {
			load: function(thisStore, records, eOpts) {
				// Die Assoziationen der cartItems m�ssen (eigentlich nur einmalig beim Start ! )
				// manuell gesetzt werden
				
				for (i in records) {
					// Artikel Assoziation setzen
					var ANr = records[i].get('ANr');
					var articleRec = Ext.getStore('localArticleStore').findRecord('ANr', ANr);
					records[i].setArticle(articleRec);
					
					// PriceMapping Assoziation setzen
					var priceId = records[i].get('pricemapping_id');
					var priceRec = Ext.getStore('localPriceMappingStore').findRecord('id', priceId);
					records[i].setPriceMapping(priceRec);
					
					// ShoppingCart Assoziation setzen
					// ...
					// ist anscheinend nicht n�tig.
					/*
					console.log('setting shoppingCart Assoc');
					var cartId = records[i].get('shoppingcart_id');
					console.log(cartId);
					var cartRec = Ext.getStore('shoppingCartStore').findRecord('id', cartId);
					console.log(cartRec);
					records[i].setShoppingCart(cartRec);
					*/
					
					//console.log(cartRec.getProxy());
					//console.log(cartRec.CartItems().add(records[i]));
					//console.log(cartRec.CartItems().load());
					//console.log(records[i].getProxy());
					
					//console.log(records[i].getData());
					
				}
			}
		},
		autoLoad: true,
		autoSync: true
	}
});