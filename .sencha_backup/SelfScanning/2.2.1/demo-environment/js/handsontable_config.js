var GNr = '';
var FNr = '';
var qrcode;
var qrData;

function vkpRenderer(instance, td, row, col, prop, value, cellProperties) {
	$(td).attr('align', 'right');
	value = !(typeof value == 'undefined' || value == null) ? 
				value.replace('.',',') : 
				value;
	Handsontable.TextCell.renderer.apply(this, arguments);
	if (td.innerText.length > 0) td.innerHTML += ' €';
	return td;
}

$(document).ready(function() {
	
	GNr = $('select[name=gesellschaft] option:selected').attr('value');
	FNr = $('select[name=filiale] option:selected').attr('value');
	
	$('#articleTable').handsontable({
		data: listArticles(),
		startRows: 1,
		minSpareRows: 1,
		multiSelect: false,
		fillHandle: false,
		colHeaders: ["Artikel-Nr.", "EAN", "Bezeichnung"],
		columns: [
			{data: 'ANr'},
			{data: 'ean'},
			{data: 'bezeichnung'}
		],
		beforeChange: function(change, source) {
			if (source === 'loadData') return; // beim (initialen) Laden soll nichts gespeichert werden.
			
			var row = change[0][0];
			var col = change[0][1];
			var val = change[0][3];
			if (val === '') return; // falls nichts geändert wurde, gibts auch nichts zu speichern.
			
			var ANr = this.getDataAtRowProp(row, "ANr");
			
			$.ajax({
				url: "updateArticles.php",
				dataType: "json",
				type: "POST",
				data: {ANr:ANr, col:col, val:val},
				success: function(res) {
					
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert('Error: ' + jqXHR.responseText);
					change[0] = null;
				}
			});
		},
		afterSelectionEnd: function() {
			f2_event = $.Event( 'keydown', { keyCode: 113 } );
			this.$table.trigger(f2_event);
		}
	});
	
	$('.pricetable').each(function(index, elem) {
		$(elem).handsontable({
			startRows: 1,
			minSpareRows: 1,
			multiSelect: false,
			fillHandle: false,
			colHeaders: ["Artikel-Nr.", "EAN", "Bezeichnung", "VKP", "gültig von", "gültig bis"],
			columns: [
				{// Artikel-Nr.
					data: "ANr",
					readOnly: false,
					options: {items: 5}},
				{// EAN
					data: "ean",
					readOnly: true},
				{// Bezeichnung
					data: "bezeichnung",
					readOnly: true,
					width: 250},
				{// VKP
					data: "vkp",
					type: {renderer: vkpRenderer},
					width: 70},
				{// gültig von
					data: "Datum_von",
					readOnly: true,
					type: 'date',
					dateFormat: 'yy-mm-dd',
					width: 100},
				{// gültig bis
					data: "Datum_bis",
					readOnly: true,
					type: 'date',
					dateFormat: 'yy-mm-dd',
					width: 100}],
			autoComplete: [
				{	match: function (row, col, data) {
						if (col == 0)
							return true;
						return false;
					},
					source: function() {
						return $('#articleTable').handsontable('getDataAtProp', 'ANr');
					}
				}],
			cells: function(row, col, prop) {
				var cellProperties = {};
				var isNewLine = false;
				if ($(elem).handsontable('countRows') == row+1)
					isNewLine = true;
				
				if (isNewLine) {
					switch (prop) {
						case 'ANr': case 'ean': case 'bezeichnung':
							cellProperties.readOnly = false; break;
						case 'vkp': case 'Datum_von': case 'Datum_bis':
							cellProperties.readOnly = true; break;
						default: break;
					}
				} else {
					switch (prop) {
						case 'ANr': case 'ean': case 'bezeichnung':
							cellProperties.readOnly = true; break;
						case 'vkp': case 'Datum_von': case 'Datum_bis':
							cellProperties.readOnly = false; break;
						default: break;
					}
				}
				
				return cellProperties;
			},
			beforeChange: function(change, source) {
				if (source === 'loadData') return; // beim (initialen) Laden soll nichts gespeichert werden.
				if (source === 'autocomplete') return;  // sollte die Zelle durch ein Autocomplete der Artikelnummer
														// gesetzt werden, soll auch keine DB-Abfrage stattfinden.
				var success = false, errorMsg = '';
				
				var col = change[0][1];
				var row = change[0][0];
				var val = change[0][3];	
				
				change[0][2] = (change[0][2] == null) ? '' : change[0][2];
				
				// falls nichts geändert wurde, gibts auch nichts zu speichern.
				if (val === '') {
					change[0] = null;
					return; 
				}
				
				// Alternativer Validator für VKP-Spalte (handsontableValidator is fucked up)
				if (col == 'vkp') {
					// Prüfen, ob der alte VKP in [0][2] mit dem neuen VKP [0][3] übereinstimmt
					if ($.number(change[0][2].replace(',','.'),2) == $.number(change[0][3].replace(',','.'),2)) {
						change[0] = null;
						return; 
					}
					// val enthält den Wert für die Datenbank, mit '.' als Dezimaltrenner
					val = $.isNumeric(change[0][3].replace(',','.'))
							? $.number(change[0][3].replace(',','.'),2)
							: null;
							
					// change[0][3] enthält den Wert für die Anzeige, mit ',' als Dezimaltrenner
					change[0][3] = $.number(change[0][3].replace(',','.'), 2, ',', '.');
				}
				
				var tableInstance = this;
				var articleTable = $('#articleTable').handsontable('getInstance');
				var ANr = tableInstance.getDataAtRowProp(row, "ANr"), ean, bezeichnung;
				
				// Tabellen-ID ermitteln, um FNr und GNr (zur Übergabe an deleteRow()) zu ermitteln
				var tmpFNr, tmpGNr;
				switch (elem.id) {
					case 'storeTable': tmpFNr = FNr; tmpGNr = GNr; break;
					case 'regionTable': tmpFNr = 0; tmpGNr = GNr; break;
					case 'nationalTable': tmpFNr = 0; tmpGNr = 0; break;
				}
				
				var jqXHR = $.ajax({
					url: "updatePrices.php",
					dataType: "json",
					type: "POST",
					async: false,
					data: {ANr:ANr, FNr:tmpFNr, GN(), function(i, currRow) {
						var checkVal = '';
						
						switch (col) {
							case 'ANr': checkVal = currRow.ANr; break;
							case 'ean': checkVal = currRow.ean; break;
							case 'bezeichnung': checkVal = currRow.bezeichnung; break;
						}
						
						if (checkVal == val) {
							ANr = currRow.ANr;
							ean = currRow.ean;
							bezeichnung = currRow.bezeichnung;
						}
					});
					
					tableInstance.setDataAtRowProp(row, 'ANr', ANr, 'autocomplete');
					tableInstance.setDataAtRowProp(row, 'ean', ean, 'autocomplete');
					tableInstance.setDataAtRowProp(row, 'bezeichnung', bezeichnung, 'autocomplete');
					tableInstance.setDataAtRowProp(row, 'vkp', '0,00', 'autocomplete');
					this.selectCell(row, 3);
					
					// Die anschließende Anfrage an updatePrices.php soll mit col=ANr und ANr als val
					col = 'ANr';
					val = ANr;
				}
				
				// Alternativer Validator für VKP-Spalte (handsontableValidator is fucked up)
				if (col == 'vkp') {
					// Prüfen, ob der alte VKP in [0][2] mit dem neuen VKP [0][3] übereinstimmt
					if ($.number(change[0][2].replace(',','.'),2) == $.number(change[0][3].replace(',','.'),2)) {
						change[0] = null;
						return; 
					}
					// val enthält den Wert für die Datenbank, mit '.' als Dezimaltrenner
					val = $.isNumeric(change[0][3].replace(',','.'))
							? $.number(change[0][3].replace(',','.'),2)
							: null;
							
					// change[0][3] enthält den Wert für die Anzeige, mit ',' als Dezimaltrenner
					change[0][3] = $.number(change[0][3].replace(',','.'), 2, ',', '.');
				}
				
				// Tabellen-ID ermitteln, um FNr und GNr (zur Übergabe an deleteRow()) zu ermitteln
				var tmpFNr, tmpGNr;
				switch (elem.id) {
					case 'storeTable': tmpFNr = FNr; tmpGNr = GNr; break;
					case 'regionTable': tmpFNr = 0; tmpGNr = GNr; break;
					case 'nationalTable': tmpFNr = 0; tmpGNr = 0; break;
				}
				
				var jqXHR = $.ajax({
					url: "updatePrices.php",
					dataType: "json",
					type: "POST",
					async: false,
					data: {ANr:ANr, FNr:tmpFNr, GNr:tmpGNr, col:col, val:val},
					})
					.done(function(data, textStatus, jqXHR) {
						success = true;
					})
					.fail(function(jqXHR, textStatus, errorThrown) {
						errorMsg = 'Error: ' + jqXHR.responseText;
					});
				
				if (errorMsg != '') {
					change[0] = null;
					alertify.alert(errorMsg);
					return;
				}
				
				if (success && col == 'vkp') alertify.success("<b>Neuer Verkaufspreis:</b><br />" +
								"<i>" + bezeichnung + ":</i> " + change[0][3] + " €");
				
				if (success) renderQRCode();
			},
			afterSelectionEnd: function() {
				f2_event = $.Event( 'keydown', { keyCode: 113 } );
				this.$table.trigger(f2_event);
			}
		});
		
		updateRegions(0);
	});
	
	
	$('div.handsontable table').mouseover(function(eventObject) {
		var tableInstance = $(this).parents('div.handsontable');
		var delButton = tableInstance.find('button.remove');
		
		// Falls es die erste oder letzte Zeile (Header bzw. SpareRow) der Tabelle ist,
		// soll das Event gestoppt werden
		var hoveredRow = $(eventObject.target).parents('tr');
		var firstLastRow = tableInstance.find('tr:nth-last-child(1)');
		if (firstLastRow.is(hoveredRow)) {
			eventObject.stopImmediatePropagation();
			return false;
		}
		
		var offsetTop = hoveredRow.prop('offsetTop');
		delButton.css('opacity', 1);
		delButton.css('top', offsetTop);
		
		// Index der Zeile ermitteln, um diese später entfernen zu können
		var hoveredRowIndex = -1;
		tableInstance.find('tr').each(function(index) {
			if (this == hoveredRow.get(0)) hoveredRowIndex = index;
		});
		
		// ANr ermitteln, um den ANr-Parameter der onclick-Funktion zu setzen
		var ANr = (tableInstance.prop('id') == 'articleTable') ?
			hoveredRow.prop('firstChild').innerText :
			hoveredRow.find('td:first-child > div').prop('firstChild').data;
		
		// Tabellen-ID ermitteln, um FNr und GNr (zur Übergabe an deleteRow()) zu ermitteln
		var tmpFNr, tmpGNr;
		switch (tableInstance.prop('id')) {
			case 'storeTable': tmpFNr = FNr; tmpGNr = GNr; break;
			case 'regionTable': tmpFNr = 0; tmpGNr = GNr; break;
			case 'nationalTable': tmpFNr = 0; tmpGNr = 0; break;
		}
		
		// Attribute des delete-buttons manipulieren, ANr und hoveredRowIndex der click-Funktion übergeben
		delButton.unbind('click');
		delButton.click({
				table:tableInstance,
				i:hoveredRowIndex,
				ANr:ANr},
			function(eventObject) {
				deleteRow(eventObject, tmpFNr, tmpGNr);
		});
	});
	
	$('div.handsontable').mouseleave(function(eventObject) {
		var delButton = $(this).find('button.remove');
		delButton.css('opacity', 0);
	});
	
	$('button.reload').click(function(eventObject) {
		var tableInstance = $(this).parents('div.handsontable').handsontable('getInstance');
		var newData = tableInstance.getData();
		tableInstance.loadData(newData);
	});
});

function deleteRow(eventObject, FNr, GNr) {
	var tableInstance = eventObject.data.table.handsontable('getInstance');
	var ANr = eventObject.data.ANr;
	var rowIndex = eventObject.data.i;
	var url;
	
	// Entsprechende Zeile aus der Tabelle entfernen
	// (rowIndex - 1) weil removeRow() ab 0 zählt
	tableInstance.alter('remove_row', rowIndex - 1);
	//var y = tableInstance.getData();
	
	if (eventObject.data.table.prop('id') == 'articleTable') url = 'deleteArticle.php';
	else url = 'deletePrices.php';
	
	$.ajax({
		type: 'POST',
		url: url,
		data: {ANr:ANr, FNr:FNr, GNr:GNr},
		success: function() {
			// Notification anzeigen
		}
	});
}

function listPrices(cols) {
	var level = '';
	var url = 'getPrices.php';
	
	$.ajax({
		type: 'POST',
		url: url,
		dataType: 'json',
		data: {GNr:GNr, FNr:FNr, cols:cols, level:'FGL'},
		success: function (res) {
			var prices = {
				f: $(res).filter(function(index) {
					return this.level == 'F';
				}),
				g: $(res).filter(function(index) {
					return this.level == 'G';
				}),
				l: $(res).filter(function(index) {
					return this.level == 'L';
				})
			}
			$('#storeTable').data('handsontable').loadData(prices.f);
			$('#regionTable').data('handsontable').loadData(prices.g);
			$('#nationalTable').data('handsontable').loadData(prices.l);
		}
	});
}

function listArticles() {
	$.ajax({
		type: 'POST',
		url: 'getArticles.php',
		dataType: 'json',
		data: {},
		success: function (res) {
			$('#articleTable').data('handsontable').loadData(res);
		}
	});
}