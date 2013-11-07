Ext.define("SelfScanning.view.EditCartItem", {
	extend: "Ext.Panel",
	alias: "widget.editcartitem",
	id: 'editCartItem',
	config: {
		modal: true,
		centered: true,
		ui: 'plain',
		width: '90%',
		items: [
			{xtype: 'container',
			id: 'editDetails',
			tpl: '<div class="title">{APMapping.Article.bezeichnung}</div>'},
			
			{xtype: 'container',
			cls: 'editMenge',
			id: 'editMenge',
			renderTo: 'editCartItem',
			items: [
				{html: 'Menge bearbeiten'},
				{xtype: 'spinnerfield',
				id: 'mengeSpinner',
				minValue: 1,
				maxValue: 100,
				stepValue: 1}
			]},
			
			{xtype: 'container',
			cls: 'editMenge',
			id: 'infoPERW',
			html: 'Die Menge eines Gewichtsartikels kann nicht ge&auml;ndert werden.'
			},
			
			{xtype: 'toolbar',
			docked: 'bottom',
			ui: 'light',
			layout: {
				type: 'hbox',
				align: 'center',
				pack: 'center'
			},
			items: [
				{xtype: 'button',
				ui: 'decline',
				iconCls: 'delete',
				padding: 10,
				margin: 10,
				handler: function() {
					Ext.getCmp('editCartItem').hide();
				}},
				
				{xtype: 'button',
				ui: 'confirm',
				iconCls: 'add',
				padding: 10,
				margin: 10,
				text: '&Uuml;bernehmen',
				handler: function() {
					if (Ext.getCmp('editCartItem').getRecord().getAPMapping().getArticle().get('weightType') == 'DEF') {
						var neueMenge = Ext.getCmp('mengeSpinner').getValue();
						Ext.getCmp('editCartItem').getRecord().set('menge', neueMenge);
						Ext.getCmp('editCartItem').getRecord().save();
					}
					
					Ext.getCmp('editCartItem').hide();
				}}
			]}
		],
		listeners: {
			show: function(thisPanel, eOpts) {
				var cartItem = thisPanel.getRecord();
				var editMenge = Ext.getCmp('editMenge');
				var infoPERW = Ext.getCmp('infoPERW');
					
				switch (cartItem.getAPMapping().getArticle().get('weightType')) {
					case 'PERW':
					case 'WERW':
						editMenge.hide();
						infoPERW.show();
						break;
					
					default:
						infoPERW.hide();
						editMenge.show();
						Ext.getCmp('mengeSpinner').setValue(cartItem.get('menge'));
						break;
				}
				
				Ext.getCmp('editDetails').setRecord(cartItem);
			}
		}
	}
});