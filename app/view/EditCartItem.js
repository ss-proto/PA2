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
			tpl: '<div class="title">{APMapping.Article.bezeichnung}</div>'
				+'<div class="bezeichnung">Menge bearbeiten</div>'},
			
			{xtype: 'spinnerfield',
			id: 'mengeSpinner',
			minValue: 1,
			maxValue: 100,
			increment: 1},
			
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
					var neueMenge = Ext.getCmp('mengeSpinner').getValue();
					Ext.getCmp('editCartItem').getRecord().set('menge', neueMenge);
					Ext.getCmp('editCartItem').getRecord().save();
					Ext.getCmp('editCartItem').hide();
				}}
			]}
		],
		listeners: {
			show: function(thisPanel, eOpts) {
				var cartItem = thisPanel.getRecord();
				Ext.getCmp('mengeSpinner').setValue(cartItem.get('menge'));
				Ext.getCmp('editDetails').setRecord(cartItem);
			}
		}
	}
});