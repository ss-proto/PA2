Ext.define("SelfScanning.model.PriceMapping", {
	extend: "Ext.data.Model",
	config: {
		fields: [
			{name: 'ANr', mapping: 0},
			{name: 'FNr', mapping: 1},
			{name: 'GNr', mapping: 2},
			{name: 'vkp', mapping: 3, type: 'float'}
		]
	}
});