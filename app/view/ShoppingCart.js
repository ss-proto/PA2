Ext.define("SelfScanning.view.ShoppingCart", {
	extend: "Ext.Container",
	alias: "widget.shoppingcart",
	config: {
		layout: {
			type: "fit"
		},
		record: {
			// this will get set after activating the view
		}
	},
	
	shoppingCartId: null,
	
	setCartItemStore: function(shoppingCartRec) {
		console.log('onShowShoppingCart');
		// cartitemlist soll alle cartitem-Objekte anzeigen, die zu dem übergebenen shoppingCart gehören
		// shoppingCartRec[0].CartItems() liefert einen entsprechend gefilterten CartItem-Store
		Ext.getCmp('cartitemlist').setStore(shoppingCartRec.CartItems().setAutoLoad(true));
		this.shoppingCartId = shoppingCartRec.getId();
		
		console.log(shoppingCartRec.getId());
		
	},
	
	// TODO:
	// Implement getShoppingCartRec()
	
	initialize: function() {
			
			this.callParent(arguments);
			
			console.log('shoppingcart initialized');
			
			var newButton = {
				xtype: "button",
				scrollDock: 'bottom',
				text: "Artikel hinzufügen",
				iconCls: "add",
				ui: "confirm",
				margin: 20,
				handler: function() {
					console.log("newCartItemCommand");
					this.fireEvent("newCartItemCommand", this.shoppingCartId);
				},
				scope: this
			};
			
			var cartItemList = {
				xtype: 'cartitemlist',
				//store: this.getRecord().CartItems
				items: [newButton]
			};
			
			var backButton = {
				xtype: 'button',
				ui: 'back',
				text: 'Zurück',
				handler: function() {
					Ext.Viewport.setActiveItem('main');
				}
			}
			
			var topToolbar = {
				xtype: "toolbar",
				title: "Einkaufswagen",
				docked: "top",
				items: [backButton]
			};
			
			this.add([topToolbar, cartItemList]);
	}
});