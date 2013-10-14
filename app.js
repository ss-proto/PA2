/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src'
});
//</debug>

Ext.application({
    name: 'SelfScanning',

    requires: [
        'Ext.MessageBox'
    ],
	
	models: ['ShoppingCart', 'CartItem', 'Article', 'APMapping', 'Store', 'Region'],
	stores: ['RemoteRegions', 'LocalRegions',
			'RemoteStores', 'LocalStores',
			'ShoppingCarts', 'CartItems', 
			'RemoteArticles', 'LocalArticles', 
			'RemoteAPMappings', 'LocalAPMappings'],
	controllers: ['SelfScanning'],
    views: ['Database', 'ArticleDB', 
			'StartShopping', 'ContinueShopping', 
			'CartItemList', 'ShoppingCart', 'ArticleList', 'PriceMapping'],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
		
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
		
		var titlebar = Ext.create('Ext.Panel', {
			cls: 'titlebar',
			docked: 'top',
			layout: {
				type: 'hbox',
				pack: 'start',
				align: 'stretch'
			},
			items: [
				{html: '&nbsp;',
				cls: 'logo',
				listeners: [{
					element: 'element',
					event: 'tap',
					fn: function() {
						//Ext.getCmp('shoppingcart').hide();
						//Ext.getCmp('startshopping').show();
						Ext.getCmp('mainContent').pop();
						//Ext.getCmp('title').setHtml('mobile SelfScanning');
					}
				}]},
				{html: 'Mobile SelfScanning',
				id: 'title',
				flex: 1,
				cls: 'text'}
			]
		});
		
		var content = Ext.create('Ext.NavigationView', {
			id: 'mainContent',
			defaultBackButtonText: '',
			navigationBar: {
				backButton: { 
					iconCls:'arrow_left',
					width: 'inherited'
				}
			},
			items: [
				//{xtype: 'startshopping'},
				//{xtype: 'shoppingcart'},
				//{xtype: 'database'}
			]
		});
		
		content.push({xtype: 'startshopping'});

        // Initialize the main view
        Ext.Viewport.add([content]);
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
