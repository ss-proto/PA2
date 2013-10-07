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
			margin: 15,
			html: 'Um einen vorherigen Einkauf fortzusetzen, tippen Sie auf den entprechenden Eintrag in der Liste.'},
			{xtype: 'list',
			scrollable: false,
			id: 'continueshoppinglist',
			ui: 'round',
			itemHeight: 70,
			itemTpl: [
				'<div class="cartDetails">',
					'<span class="timeago">{creationDate:this.getTimeago}</span><br />',
					'<span class="location">{Store.Str} in {Store.Ort}</span>',
				'</div>',
				'<div class="cartContent">{menge}&nbsp;Artikel&nbsp;({summe:this.formatPrice})</div>',
				{getTimeago: function(date) {
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
			disableSelection: true,
			listeners: {
				itemtap: function(thisList, index, target, record, e, eOpts){
					thisList.parent.fireEvent('activateShoppingCart', record);
				},
				refresh: function() {
					console.log(this.getItemHeight());
					this.setHeight(this.itemsCount*this.getItemHeight()+20);
				}
			}
			}
		]
	}
});
