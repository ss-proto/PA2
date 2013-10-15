Ext.define("SelfScanning.view.ShoppingCart", {
	extend: "Ext.Container",
	alias: "widget.shoppingcart",
	id: 'shoppingcart',
	flex: 1,
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
		// cartitemlist soll alle cartitem-Objekte anzeigen, die zu dem übergebenen shoppingCart gehören
		// shoppingCartRec[0].CartItems() liefert einen entsprechend gefilterten CartItem-Store
		var currCartItemStore = shoppingCartRec.CartItems();
		currCartItemStore.setAutoLoad(true);
		
		Ext.getCmp('cartitemlist').setStore(currCartItemStore);
		Ext.getCmp('shoppingLocation').setRecord(shoppingCartRec);
		Ext.getCmp('cartInfo').setRecord(shoppingCartRec);
		
		this.shoppingCartRecord = shoppingCartRec;
	},
	
	// TODO:
	// Implement getShoppingCartRec()
	
	initialize: function() {
			
			var locationInfo = {
				xtype: 'container',
				cls: 'locationInfo',
				id: 'shoppingLocation',
				tpl: '{Store.Str} in {Store.PLZ} {Store.Ort}'
			}
			
			var scanBarcodeBtn = {
				xtype: "button",
				ui: 'confirm',
				text: "Barcode erfassen",
				iconCls: 'barcode2',
				iconMask: true,
				padding: 10,
				handler: function() {
					this.fireEvent('createCartItem', this.shoppingCartRecord, 'scan');
				},
				scope: this
			};
			
			var searchArticleBtn = {
				xtype: 'button',
				ui: 'confirm',
				iconCls: 'search2',
				padding: 10,
				handler: function() {
					this.fireEvent('createCartItem', this.shoppingCartRecord, 'lookup');
				},
				scope: this
			};
			
			var addArticleBtn = Ext.create('Ext.SegmentedButton', {
				layout: {
					pack: 'center'
				},
				id: 'addArticleBtn',
				items: [searchArticleBtn, scanBarcodeBtn],
				docked: 'bottom',
				allowToggle: false,
				margin: 10,
			});
			
			var cartInfo = {
				xtype: 'container',
				id: 'cartInfo',
				tpl: [
					'<div class="summe">',
						'<span class="text">Gesamt:</span>',
						'<span class="zahl">{summe:this.formatPrice}</span>',
					'</div>',
					{formatPrice: function(vkp) {
						vkp = vkp.toFixed(2);
						vkp += '';
						x = vkp.split('.');
						x1 = x[0];
						x2 = x.length > 1 ? ',' + x[1] : '';
						var rgx = /(\d+)(\d{3})/;
						while (rgx.test(x1)) {
							x1 = x1.replace(rgx, '$1' + ',' + '$2');
						}
						return x1 + x2 + '€';
					}}
				],
				scrollDock: 'bottom',
				docked: 'bottom'
			};
			
			var cartItemList = {
				xtype: 'cartitemlist',
				flex: 1,
				items: [
					cartInfo
				],
				width: '100%'
			};
			
			
			this.add([locationInfo, cartItemList, addArticleBtn]);
	}
});