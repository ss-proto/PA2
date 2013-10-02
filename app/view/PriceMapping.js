Ext.define("SelfScanning.view.PriceMapping", {
	extend: "Ext.Container",
	alias: "widget.pricemapping",
	requires: ['Ext.plugin.PullRefresh'],
	config: {
		layout: {
			type: "fit"
		},
		items: [{
			xtype: 'toolbar',
			title: 'Alle Verkaufspreise',
			docked: 'top',
			items: [
				{xtype: 'button',
				ui: 'back',
				text: 'Zurück',
				handler: function() {
					Ext.Viewport.setActiveItem('main');
				}
				}
			]
		},{
			xtype: 'list',
			store: 'localPriceMappingStore',
			plugins: [
				{
					xclass: 'Ext.plugin.PullRefresh',
					releaseRefreshText: 'Zum Aktualisieren loslassen',
					pullRefreshText: 'Zum Aktualisieren herunterziehen.',
					loadingText: 'Wird geladen...',
					listeners: {
						latestfetched: function() {
							console.log('latest fetched!');
							Ext.getStore('remotePriceMappingStore').load();
						}
					}
				}
			],
			cls: 'article-list',
			itemTpl: '<div class="bezeichnung"><span>{ANr}&nbsp;&nbsp;</span>{vkp}</div>',
			scrollable: 'vertical',
			loadingText: "Preise werden geladen..."
		}]
	}
});