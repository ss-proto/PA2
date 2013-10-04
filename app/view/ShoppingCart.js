Ext.define("SelfScanning.view.ShoppingCart", {
	extend: "Ext.Container",
	alias: "widget.shoppingcart",
	config: {
		layout: {
			type: 'vbox',
			pack: 'start',
			align: 'center'
		},
		record: {
			// this will get set after activating the view
		}
	},
	
	shoppingCartRecord: null,
	
	setCartItemStore: function(shoppingCartRec) {
		console.log('setCartItemStore()');
		// cartitemlist soll alle cartitem-Objekte anzeigen, die zu dem übergebenen shoppingCart gehören
		// shoppingCartRec[0].CartItems() liefert einen entsprechend gefilterten CartItem-Store
		Ext.getCmp('cartitemlist').setStore(shoppingCartRec.CartItems());
		Ext.getCmp('shoppingLocation').setRecord(shoppingCartRec);
		this.shoppingCartRecord = shoppingCartRec;
	},
	
	// TODO:
	// Implement getShoppingCartRec()
	
	initialize: function() {
			this.callParent(arguments);
			
			var locationInfo = {
				xtype: 'container',
				cls: 'locationInfo',
				id: 'shoppingLocation',
				tpl: 'Filiale: {FNr} / Gesellschaft: {GNr}'
			}
			
			var scanBarcodeBtn = {
				xtype: "button",
				ui: 'confirm',
				text: "Barcode erfassen",
				iconCls: 'barcode2',
				iconMask: true,
				padding: 10,
				handler: function() {
					console.log("newCartItemCommand");
					this.fireEvent("newCartItemCommand", this.shoppingCartRecord);
				},
				scope: this
			};
			
			var searchArticleBtn = {
				xtype: 'button',
				ui: 'confirm',
				iconCls: 'search2',
				padding: 10
			};
			
			var addArticleBtn = Ext.create('Ext.SegmentedButton', {
				id: 'addArticleBtn',
				items: [searchArticleBtn, scanBarcodeBtn],
				allowToggle: false,
				margin: 10,
			});
			
			var cartItemList = {
				xtype: 'cartitemlist',
				flex: 1,
				width: '95%',
				//store: this.getRecord().CartItems
			};
			
			/*
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
			*/
			
			this.add([locationInfo, cartItemList, addArticleBtn]);
	}
});