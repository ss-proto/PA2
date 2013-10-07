Ext.define("SelfScanning.view.StartShopping", {
	extend: "Ext.Container",
	alias: "widget.startshopping",
	config: {
		id: 'startshopping',
		layout: {
			type: 'vbox',
			pack: 'start',
			align: 'stretch'
		},
		items: [
			{margin: 20,
			html: '<div class="startbox">'
				  +'	<div class="info">'
				  +'		<div class="message">Um einen neuen Einkauf zu beginnen, scannen Sie den QR-Code im Eingangsbereich der Filiale.</div>'
				  +'	</div>'
				  +'</div>'},
			{xtype: 'container',
			cls: 'btnContainer',
			layout: {
				type: 'vbox',
				align: 'center'
			},
			items: 
				{xtype: 'button',
				padding: 10,
				ui: 'confirm',
				iconCls: 'camera2',
				text: 'QR-Code scannen',
				handler: function() {
					this.parent.parent.fireEvent("newShoppingCartCommand");
				}}
			},
			{xtype: 'continueshopping'}
		]
	}
});
