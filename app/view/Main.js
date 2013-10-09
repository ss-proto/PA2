Ext.define("SelfScanning.view.Main", {
	extend: "Ext.Container",
	alias: "widget.main",
	requires: ['Ext.SegmentedButton'],
	config: {
		layout: {
			type: 'vbox',
			pack: 'start',
			align: 'stretch'
		},
		//scollable: 'vertical',
		fullscreen: false
	},
	
	initialize: function() {
		this.callParent(arguments);
		
		/*
		var carousel = {
			xtype: 'carousel',
			id: 'mainCarousel',
			items: [
				{xtype: 'startshopping'},
				{xtype: 'continueshopping'}
			],
			showAnimation: 'fadeIn',
			listeners: {
				activeitemchange: function(carousel, item) {
					var title;
					switch (item.getId()) {
						case 'startshopping': title = 'Einkauf <b>beginnen</b>'; break;
						case 'continueshopping': title = 'Einkauf <b>fortf&uuml\;hren</b>'; break;
						case 'closedshoppingcarts': title = '<b>vergangene</b> Einkäufe'; break;
						default: title = 'mobile <b>SelfScanning</b>'; break;
					}
					
					Ext.getCmp('title').setHtml(title);
				}
			}
		};
		*/
	}
});


