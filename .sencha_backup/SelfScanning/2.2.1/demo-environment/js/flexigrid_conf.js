var GNr = '';
var FNr = '';

$(function() {
	GNr = $('select[name=gesellschaft] option:selected').attr('value');
	FNr = $('select[name=filiale] option:selected').attr('value');
		
	$("#articleTable").flexigrid( {
		url: 'listArticles.php',
		dataType: 'json',
		method: 'post',
		query: "WHERE listung.GNr = '"+GNr+"' AND listung.FNr = '"+FNr+"'",
		params: [{name:'GNr',value:GNr}, {name:'FNr', value:FNr}],
		colModel : [
			{display: '<input type="checkbox" name="rowChk" id="all" onclick="selectAll(this)">', name : 'selected', width: 20, sortable: false, align: 'center'},
			{display: 'Artikel-Nr.', name:'ANr', width:50, sortable : true, align: 'left', process: editArticle},
			{display: 'EAN', name:'ean', width:70, sortable : true, align: 'left', process: editArticle},
			{display: 'Bezeichnung', name:'bezeichnung', width:250, sortable : true, align: 'left', process: editArticle},
			{display: 'VKP', name:'vkp', width:50, sortable : true, align: 'left', process: editArticle},
			{display: 'Level', name:'level', width:40, sortable: false, align: 'center'}
		],
		onRowSelected: false,
		usepager: true,
		useRp: true,
		rp: 10,
		showToggleBtn: false,
		resizable: false,
		width: 554,
		height: 'auto',
		singleSelect: false,
		preProcess: function(data) {
			// Restlichen Zeilen bis zum Seitenende mit leeren Werten füllen
			var rp = $('select[name=rp] option:selected', $('#articleTable').closest('.flexigrid')).val();
			for (i=data.rows.length; i<rp; i++)
				data.rows.push({'id':'0', 'cell':['','','','','', '']});
			return data;
		}
	});
});

function selectAll(headBox) {
	var selectBoxes = $('#articleTable input[type=checkbox]').prop('checked', headBox.checked);
}

function deleteSelected() {
	var selectedBoxes = $('#articleTable input[type=checkbox]').filter(function(index) {
		return this.checked;
	});
	
	var artikel = new Array();
	
	$.each(selectedBoxes, function(key, val) {
		var ANr = val.id;
		var selectedRow = $('tr[id=row'+ANr+']');
		var level = $.trim($(selectedRow).children().last()[0].innerText);
		
		artikel[key] = new Object();
		artikel[key]['ANr'] = val.id;
		artikel[key]['FNr'] = FNr;
		artikel[key]['GNr'] = GNr;
		
		if (level=='G' || level=='L') 	artikel[key]['FNr'] = 0;
		if (level=='L') 				artikel[key]['GNr'] = 0;
	});
	
	$.post('deleteArticles.php', {
		'artikel' : artikel});
		
	$('#articleTable').flexReload();
}

function editArticle(celDiv, id) {
	// Klick auf Tabellenzeile -> Checkbox togglen und Zeile markieren
	$(celDiv).click(function(event) {
		// Checkbox-Element ermitteln und anschließend Eigenschaft togglen
		var checkbox = $('input[id="'+id+'"]')[0];
		$(checkbox).prop('checked', !$(checkbox).prop('checked'));
	});

	// Falls ArtikelNr nicht gesetzt ist, handelt es sich um eine leere Zeile
	// => ArtikelNr muss als erstes eingegeben werden
	$(celDiv).dblclick(function(event) {
		var artikelNrDiv = $('tr[id$="'+id+'"] td[abbr="ANr"] div')[0];
		
		// Prüfen ob artikelNr nicht geklickt und artikelNr leer ist
		if ($(celDiv).parent().attr('abbr') != 'ANr' && $.trim(artikelNrDiv.innerText) == '') {
			event.stopImmediatePropagation();
			$(artikelNrDiv).dblclick();
		}
		
		
	});
	
	// Edit-In-Place Editor konfigurieren
	$(celDiv).editInPlace({
		bg_over: '#e1f1fa',
		callback: function(editorID, updVal, orgVal, successParams) {
			var updCol = $(celDiv).parent().attr('abbr');
			
			$.post('updateArticles.php', {
				'ANr' : id,
				'FNr' : FNr,
				'GNr' : GNr,
				'updCol' : updCol,
				'updVal' : updVal});
			
			return updVal;
		},
		postclose: function(celDiv) {
			var updCol = $(celDiv).parent().attr('abbr')
			
			// Wenn die ANr geändert wurde, muss die Tabelle  neu geladen werden um die IDs der Zeilen korrekt zu setzen
			if (updCol == 'ANr' || updCol == 'vkp') $('#articleTable').flexReload();
		}
	});
	
	// Geänderte Eingaben überprüfen
	//$(celDiv).change(function() {
		//validateArticle(id);
	//});
}