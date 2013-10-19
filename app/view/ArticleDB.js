Ext.define("SelfScanning.view.ArticleDB", {
	extend: "Ext.dataview.List",
	alias: 'widget.articledb',
	requires: 'Ext.field.Search',
	config: {
		title: 'Alle Artikel',
		id: 'articledb',
		store: null,// wird zur Laufzeit gesetzt
		disableSelection: true,
		scrollable: null,
		itemTpl: '{ANr} {Article.bezeichnung} {vkp}',
		items: {
			xtype: 'toolbar',
			docked: 'top',
			ui: 'none',
			items: [
				{xtype: 'spacer'},
				{xtype: 'searchfield',
				listeners: {
					keyup: function(field, e, eOpts) {
						//get the store and the value of the field  
						var value = field.getValue();
						console.log(value);
						//if (value) {
							value = value.replace(/ /g, '.*');
							console.log(value);
							var store = Ext.getStore('localAPMappingStore');
							
							var reg = new RegExp(value, 'i');							
							var results = store.queryBy(function(currRec){
								var bezeichnung = currRec.getArticle().get('bezeichnung');
								var	ANr			= currRec.get('ANr');
								if(reg.test(bezeichnung)) {
									return true;
								} else return false;
							});
							
							Ext.getCmp('articledb').setStore({
								model: 'SelfScanning.model.APMapping',
								data: Ext.Array.pluck(results.getRange(),'data')
							});
						//}
					},
					clearicontap: function(field, e, eOpts) {
						Ext.getCmp('articledb').setStore(Ext.getStore('localAPMappingStore'));
					}
				}
				},
				{xtype: 'spacer'}
			]
		}
	}
});