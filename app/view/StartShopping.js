Ext.define("SelfScanning.view.StartShopping", {
	extend: "Ext.Container",
	alias: "widget.startshopping",
	config: {
		layout: {
			type: 'vbox',
			pack: 'start',
			align: 'stretch'
		},
		items: [
			{html: '<div class="subtitle">Einkauf beginnen</div>'},
			{margin: 15,
			html: '<div class="startbox">'
				  +'	<div class="info">'
				  +'		<div class="top"><span>Einchecken</span></div>'
				  +'		<div class="message">Scannen Sie bitte den QR-Code im Eingangsbereich der Filiale, um einen neuen Einkauf zu beginnen.</div>'
				  +'	</div>'
				  +'</div>'},
			{xtype: 'spacer'},
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
			}
		]
	}
});
