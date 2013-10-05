Ext.define("SelfScanning.model.Store", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		fields: [
			{name: 'FNr'},
			{name: 'GNr'},
			{name: 'PLZ'},
			{name: 'Ort'},
			{name: 'Str'}
		],
		belongsTo: [{
			model: 'SelfScanning.model.Region',
			name: 'Region'
		}]
	}
});