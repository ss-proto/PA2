Ext.define("SelfScanning.view.ArticleDB", {
	extend: "Ext.dataview.List",
	alias: 'widget.articledb',
	config: {
		title: 'Artikel suchen',
		id: 'articledb',
		store: null,// wird zur Laufzeit gesetzt
		disableSelection: true,
		itemTpl: '{ANr} {Article.bezeichnung} {vkp}'
	}
});