Ext.define("SelfScanning.view.CartCarousel", {
	extend: "Ext.Carousel",
	alias: "widget.cartcarousel",
	id: 'cartcarousel',
	config: {
		title: 'Einkaufswagen', // wird beim activate-Event eines Carousel-Items geändert
		indicator: false,
		items: [
			{xtype: 'shoppingcart'},
			{xtype: 'payment'}
		],
		flex: 1
	}
});