Ext.define("SelfScanning.view.CartItemList", {
	extend: "Ext.dataview.List",
	alias: "widget.cartitemlist",
	id: 'cartitemlist',
	config: {
		scrollable: 'vertical',
		loadingText: "Artikel werden geladen...",
		emptyText: '</pre><div class="emptyText">Es befinden sich noch keine Artikel im Einkaufswagen.<br />Um einen neuen Artikel in den Einkaufswagen zu legen, drücken Sie auf "Artikel hinzufügen".</div><pre>',
		// Need to load the associations !
		// see http://docs.sencha.com/touch/2.2.1/#!/api/Ext.data.Model-method-getData for first entry point.
		itemTpl:  '<span class="bezeichnung">{Article.bezeichnung}</span>'
				+ '<span class="gesamtpreis">{PriceMapping.vkp}</span>'
				+ ''
				
		// NOTIZ:
		// Bei verknüpften Artikeln (Pfand) soll ein "Kettenglied"-Icon (Chain) links von der Liste angezeigt werden!
	}
});