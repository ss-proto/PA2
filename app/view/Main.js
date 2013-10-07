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
		
		var content = {
			xtype: 'container',
			id: 'mainContent',
			flex: 1,
			scrollable: 'vertical',
			layout: 'card',
			items: [
				{xtype: 'startshopping'}
			]};
		
		var titlebar = Ext.create('Ext.Container', {
			cls: 'titlebar',
			docked: 'top',
			layout: {
				type: 'hbox',
				pack: 'start',
				align: 'stretch'
			},
			items: [
				{html: '&nbsp;',
				cls: 'logo',
				listeners: [{
					element: 'element',
					event: 'tap',
					fn: function() {
						Ext.getCmp('mainContent').setActiveItem(Ext.getCmp('mainCarousel'));
					}
				}]},
				{html: 'Einkauf <b>beginnen</b>',
				flex: 1,
				cls: 'text',
				id: 'title'}
			]
		});
		
		this.add([titlebar, content]);
	}
});


