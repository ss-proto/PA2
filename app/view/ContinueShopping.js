Ext.define("SelfScanning.view.ContinueShopping", {
	extend: "Ext.Container",
	alias: "widget.continueshopping",
	config: {
		id: 'continueshopping',
		layout: {
			type: 'vbox',
			pack: 'start',
			align: 'stretch'
		},
		//flex: 1,
		items: [
			{cls: 'message',
			html: 'Oder setzen Sie einen offenen Einkauf fort'},
			{xtype: 'list',
			scrollable: false,
			id: 'continueshoppinglist',
			//itemHeight: 40,
			itemTpl: [
				'<div class="cartDetails">',
					'<span class="time">{creationDate:this.getTimeago}</span>',
					'<span class="content">{menge} Artikel</span>',
					'<span class="sum">{summe:this.formatPrice}</span>',
				'</div>',
				{getTimeago: function(date) {
					if (moment().diff(moment(date), 'days') > 1)
						return moment(date).calendar();
					else
						return moment(date).fromNow();
				},
				formatPrice: function(vkp) {
					vkp = vkp.toFixed(2);
					vkp += '';
					x = vkp.split('.');
					x1 = x[0];
					x2 = x.length > 1 ? ',' + x[1] : '';
					var rgx = /(\d+)(\d{3})/;
					while (rgx.test(x1)) {
						x1 = x1.replace(rgx, '$1' + ',' + '$2');
					}
					return x1 + x2 + '&nbsp;&euro;';
				}}
			],
			store: 'shoppingCartStore',
			grouped: true,
			disableSelection: true,
			listeners: {
				itemtap: function(thisList, index, target, record, e, eOpts){
					thisList.parent.fireEvent('activateShoppingCart', record);
				},
				refresh: function() {
					this.setHeight((this.itemsCount*this.getItemHeight()+20) + Ext.getStore('shoppingCartStore').getGroups().length * 30);
				}
			}
			}
		]
	}
});
