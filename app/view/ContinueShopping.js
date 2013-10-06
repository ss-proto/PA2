Ext.define("SelfScanning.view.ContinueShopping", {
	extend: "Ext.Container",
	alias: "widget.continueshopping",
	config: {
		id: 'continueshopping',
		layout: {
			type: 'vbox',
			pack: 'start'
		},
		items: [
			{cls: 'message',
			margin: 15,
			html: 'Um einen vorherigen Einkauf fortzusetzen, tippen Sie auf den entprechenden Eintrag in der Liste.'},
			{xtype: 'list',
			id: 'continueshoppinglist',
			flex: 1,
			ui: 'round',
			itemTpl: [
				'<div class="cartDetails">',
					'<span class="timeago">{creationDate:this.getTimeago}</span><br />',
					'<span class="location">{Store.Str} in {Store.Ort}</span>',
				'</div>',
				'<div class="cartContent">{Menge}&nbsp;Artikel&nbsp;({Summe:this.formatPrice})</div>',
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
				}
			}
			}
		]
	}
});
