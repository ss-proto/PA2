Ext.define("SelfScanning.view.ArticleDB", {
	extend: "Ext.dataview.List",
	alias: "widget.articleDB",
	id: 'articleDB',
	config: {
		// store: storeRecod.APMappings() -> wird zur Laufzeit gesetzt
		title: 'Alle Artikel',
		itemTpl: '({ANr}) {Article.bezeichnung} {vkp}',
		listeners: {
			itemtap: function(view, index, target, record, e, eOpts) {
				var article = Ext.getStore('localArticleStore').findRecord('ANr', record.get('ANr'));
				view.parent.fireEvent('createCartItem', 'lookup', article);
				
				//Ext.getCmp('database').hide();
				//Ext.getCmp('shoppingcart').show();
			}
		}
	}
});