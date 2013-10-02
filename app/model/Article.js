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
			//{name: 'id'},
			{name: 'ANr'},
			{name: 'ean'},
			{name: 'bezeichnung'},
			{name: 'timestamp'}
		]/*,
		// ANMERKUNG
		// siehe Kommentar zu PriceMapping
		//
		hasMany: [{
			model: 'SelfScanning.model.CartItem',
			name: 'CartItem',
			primaryKey: 'ANr',		// identifiziert das Article-Objekt
			foreignKey: 'ANr',		// identifiziert das Article-Objekt im cartItemStore
			foreignStore: 'cartItemStore'
		}] */
	}
});