Ext.define("SelfScanning.model.PriceMapping", {
	extend: "Ext.data.Model",
	config: {
		fields: [
			{name: 'ANr', mapping: 0},
			{name: 'FNr', mapping: 1},
			{name: 'GNr', mapping: 2},
			{name: 'vkp', mapping: 3, type: 'float'},
		]/*,
		// ANMERKUNG
		// Ein PriceMapping-Objekt sollte seine zugehörigen CartItems eigentlich nicht kennen
		// Es genügt, wenn diese Beziehung unidirektional ist, d.h. wenn das CartItem sein PriceMapping kennt.
		// 
		hasMany: [{
			model: 'SelfScanning.model.CartItem',
			name: 'CartItem',
			primaryKey: 'id',				// identifiziert das PriceMapping-Objekt
			foreignKey: 'priceMappingId',	// identifiziert das PriceMapping-Objekt im cartItemStore
			foreignStore: 'cartItemStore'
		}]*/
	}
});