Ext.define("SelfScanning.view.Main", {
	extend: "Ext.Container",
	alias: "widget.main",
	requires: ['Ext.SegmentedButton'],
	config: {
		layout: {
			type: "fit"
		}
	},
	
	initialize: function() {
		this.callParent(arguments);
		
		var toolbar = Ext.create('Ext.Toolbar', {
			title: 'Mobile SelfScanning',
			docked: 'top',
			ui: 'light'
		});
		
		var segmentedBtn = Ext.create('Ext.SegmentedButton', {
			id: 'asdftest',
			items: [{
				text: 'Artikel',
				handler: function() {
					Ext.Viewport.setActiveItem('articlelist');
				}
			},{
				text: 'Preise',
				handler: function() {
					Ext.Viewport.setActiveItem('pricemapping');
				}
			}],
			allowToggle: false,
			margin: 10,
			padding: 10
		});
		
		var shoppingBtn = Ext.create('Ext.Button', {
			text: 'Einkauf beginnen',
			margin: 10,
			padding: 10,
			//width: '50%',
			ui: 'confirm',
			//iconCls: 'add',
			handler: function() {
				this.fireEvent("newShoppingCartCommand", this);
			},
			scope: this
		});
		
		var carousel = Ext.create('Ext.Container', {
			id: 'mainview',
			layout: {
				type: 'vbox',
				pack: 'start',
				align: 'center'
			},
			items: [segmentedBtn, shoppingBtn]
		});
		
		this.add([toolbar, carousel]);
	}
});


