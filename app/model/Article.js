Ext.define("SelfScanning.model.Article", {
	extend: "Ext.data.Model",
	requires: ['Ext.data.proxy.Sql'],
	config: {
		proxy: {
			type: 'sql'
		},
		identifier: 'uuid',
		idProperty: 'ANr',
		fields: [
			{name: 'ANr'},
			{name: 'ean'},
			{name: 'bezeichnung'},
			{name: 'mwst'},
			{name: 'weightDependant'},
			{name: 'linkedANr'},
			{name: 'warengruppe'},
			{name: 'timestamp'}
		]
	}
});