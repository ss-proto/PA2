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
		fullscreen: false
	},
	
	initialize: function() {
		this.callParent(arguments);
		
		var menuPanel = Ext.create('Ext.Panel', {
			padding: 0,
			left: 0,
			hidden: true,
			modal: true,
			hideOnMaskTap: true,
			items: [
				{xtype: 'list',
				scrollable: false,
				disableSelection: true,
				itemTpl: '{text}',
				width: '10em',
				data: [
					{text:'Einkaufen'},
					{text:'Datenbank'}
				],
				listeners: {
					painted: function() {
						this.setHeight(this.itemsCount*this.getItemHeight());
					},
					itemtap: function(list, index, target, record, e, eOpts) {
						switch (record.get('text')) {
							case 'Datenbank': Ext.getCmp('mainContainer').setActiveItem('database'); break;
							case 'Einkaufen': Ext.getCmp('mainContainer').setActiveItem('shoppingmain'); break;
							default: break;
						}
						menuPanel.hide();
					}
				}
				}
			]
		});
		
		var content = Ext.create('Ext.Container', {
			id: 'mainContainer',
			flex: 1,
			layout: 'card',
			items: {xtype:'shoppingmain'}
		});
		
		var moreBtn = Ext.create('Ext.Button', {
			docked: 'right',
			iconCls: 'more',
			handler: function() {
				if (menuPanel.isHidden()) menuPanel.showBy(moreBtn);
				else menuPanel.hide();
			}
		});
		
		var titlebar = Ext.create('Ext.Container', {
			cls: 'titlebar',
			docked: 'top',
			layout: {
				type: 'vbox',
				pack: 'center',
				align: 'center'
			},
			items: [
				{html: 'Mobile SelfScanning'},
				moreBtn
			]
		});
		
		var shoppingBtn = Ext.create('Ext.Button', {
			text: 'Einkauf beginnen',
			margin: 10,
			padding: 10,
			ui: 'confirm',
			handler: function() {
				this.fireEvent("newShoppingCartCommand", this);
			},
			scope: this
		});
		
		this.add([titlebar, content]);
	}
});


