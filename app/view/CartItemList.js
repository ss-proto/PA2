Ext.define("SelfScanning.view.CartItemList", {
	extend: "Ext.dataview.List",
	alias: "widget.cartitemlist",
	id: 'cartitemlist',
	config: {
		layout: {
			type: 'fit',
			pack: 'start',
			align: 'center'
		},
		ui: 'round',
		scrollable: null,
		loadingText: "Artikel werden geladen...",
		//emptyText: '<div class="emptyText">Ihr Einkaufswagen ist leer.<br />Um einen Artikel hinzuzufügen, scannen Sie den Barcode auf der Verpackung oder suchen den Artikel in der Datenbank.</div>',
		itemTpl: new Ext.XTemplate(
			'<div class="itemDetails">',
				'<span class="menge">{menge}</span>',
				'<span class="bezeichnung">{APMapping.Article.bezeichnung}</span><hr />',
				'<span class="gesamtpreis">{[this.getSum(values.APMapping.vkp, values.menge)]}</span>',
			'</div>',
			{getSum: function(vkp, menge) {
				return this.formatPrice(vkp*menge);
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
				return x1 + x2 + '€';
			}}
		)
		// NOTIZ:
		// Bei verknüpften Artikeln (Pfand) soll ein "Kettenglied"-Icon (Chain) links von der Liste angezeigt werden!
	}
});