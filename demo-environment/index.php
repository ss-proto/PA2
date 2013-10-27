<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Self-Scanning Prototyp - Artikelverwaltung</title>
	
	<link rel="stylesheet" type="text/css" href="css/flexigrid.css">
	<link rel="stylesheet" type="text/css" href="css/ss-proto.css">
	<link rel="stylesheet" type="text/css" href="css/gh-buttons.css">
	<link rel="stylesheet" type="text/css" href="css/notification-bars.css">
	<link rel="stylesheet" type="text/css" href="css/jquery.handsontable.full.css">
	<link rel="stylesheet" type="text/css" href="css/jquery.handsontable.removeRow.css">
	<link rel="stylesheet" type="text/css" href="css/alertify.core.css" />
	<link rel="stylesheet" type="text/css" href="css/alertify.default.css" />
	
	<link rel="stylesheet" type="text/css" href="css/jquery-ui.custom.css">
	<link rel="stylesheet" type="text/css" href="css/jqtransform.css">
	
	<!-- <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script> -->
	<script type="text/javascript" src="js/jquery-2.0.3.js"></script>
	<script type="text/javascript" src="js/jquery.number.min.js"></script>
	<script type="text/javascript" src="js/alertify.js"></script>
	<script type="text/javascript" src="js/qrcode.min.js"></script>
    <!-- <script type="text/javascript" src="js/jquery-migrate-1.2.1.js"></script> -->
	
	<script type="text/javascript" src="js/jquery.handsontable.full.js"></script>
	<script type="text/javascript" src="js/jquery.handsontable.removeRow.js"></script>
	<script type="text/javascript" src="js/jquery-ui.custom.min.js"></script>
	<script type="text/javascript" src="js/handsontable_config.js"></script>
	
	<!-- <script type="text/javascript" src="js/flexigrid.pack.js"></script>
	<script type="text/javascript" src="js/flexigrid_conf.js"></script>
	<script type="text/javascript" src="js/jquery.editinplace.js"></script> -->
	
	<script type="text/javascript" src="js/jquery.jqtransform.js"></script>
	<script type="text/javascript" src="js/nav.js"></script>
	
	<script type="text/javascript">
		function updateRegions(GNr) {
			this.GNr = GNr;
			updateStores(0);
			//this.FNr = '0';
			
			$.ajax({
				type: 'POST',
				url: 'getStores.php',
				data: {GNr:GNr, type:'htmlList'},
				success: function(data) {
					var storeSelector = $('select[name=filiale]');
					storeSelector.html(data);
					storeSelector.removeClass('jqTransformHidden')
					
					$('.jqTransformSelectWrapper').has('select[name=filiale]').replaceWith(storeSelector);
					$('div#storeSelector form').removeClass('jqtransformdone');
					$('div#storeSelector form').jqTransform();
				}
			});
		}
		
		function updateStores(FNr) {
			this.FNr = FNr;
			listPrices('artikel.ANr,ean,bezeichnung,vkp,Datum_von,Datum_bis');
			
			var currRegion = $('select[name=gesellschaft] option[value='+GNr+']').text();
			var currStore = $('select[name=filiale] option[value='+FNr+']').text();

			$('#qrinfo span#store').text(currStore);
			$('#qrinfo span#region').text(currRegion);
			
			if (GNr == 0) {
				// Keine Gesellschaft ausgewählt
				$('#regionTable').prevAll(':not(.info)').andSelf().hide();
				$('.preis.info').css('display','block');
				$('.preis.info span').css('display','inline');
				$('input[name=gesellschaftspreise]').prop({disabled:true,checked:false});
				$('input[name=filialpreise]').prop({disabled:true,checked:false});
			} else {
				// Gesellschaft ausgewählt	
				$('#regionTable').prev().andSelf().show();
				$('.preis.info').css('display','block');
				$('.preis.info span').css('display','none');
				$('input[name=gesellschaftspreise]').prop({disabled:false,checked:true});
				if (FNr == 0) {
					$('#storeTable').prev().andSelf().hide();
					$('.preis.info').css('display','block');
					$('.preis.info span').css('display','none');
					$('input[name=filialpreise]').prop({disabled:true,checked:false});
				} else {
					$('#storeTable').prev().andSelf().show();
					$('.preis.info').css('display','none');
					$('.preis.info span').css('display','none');
					$('input[name=filialpreise]').prop({disabled:false,checked:true});
				}
			}
			
			renderQRCode();
			
		}
		
		function renderQRCode() {
			// Datenformat des QR-Codes
			// Konkatenierter String mit folgenden Bestandteilen:
			// Leerzeichen " " sowie der senkrechte Strich "|" dienen lediglich der anschaulichen Darstellung
			// und sind im tatsächlichen QR-Code nicht (!) enthalten
			//
			// ---------------------------------------------------------------------------
			// ggg | fff | filialpreise | 0000 | gesellschaftspreise | 0000 | landespreise 
			// --------------------------------------------------------------------------- 
			//
			// ggg: (3 stellig) Nummer der Gesellschaft
			// fff: (3 stellig) Nummer der Filiale
			// filialpreise: (variable Länge) enthält die Filialpreise als konkat. String, mit folgenden Bestandteilen:
			// 		aaaaa | ppppp
			//		aaaaa: (5 stellig) Nummer des Artikels
			//						   Besonderheit: '00000' ist eine reservierte Zeichenfolge zur Trennung von filial-, gesellschafts- und landespreisen (siehe unten)!
			//		ppppp: (5 stellig) aktueller Verkaufspreis des Artikels, ohne Dezimaltrennzeichen. D.h. die letzten beiden Ziffern sind 10tel bzw. 100tel
			//						   Besonderheit: '00000' bedeutet: der Datensatz ist obsolet. D.h. er muss im Smartphone gelöscht werden!
			//
			// Folgende Daten werden nur angehängt, wenn Gesellschaftspreise Bestandteil des QR-Codes sind.
			// 00000: (5 stellig) fixe Zeichenfolge zur Trennung von Filial- und Gesellschaftspreisen.
			// gesellschaftspreise: (variable Länge) siehe filialpreise
			//
			// Folgende Daten werden nur angehängt, wenn Landespreise Bestandteil des QR-Codes sind.
			// 00000: (5 stellig) fixe Zeichenfolge zur Trennung von Gesellschafts- und Landespreisen
			// landespreise: (variable Länge) siehe filialpreise
			//
			//
			
			if (typeof qrcode == "undefined") 
				qrcode = new QRCode($('div#qrcode').get(0));
			
			var qrGNr = ('000' + GNr).slice(-3);
			var qrFNr = ('000' + FNr).slice(-3);
			
			qrData = '';
			qrData += qrGNr + qrFNr;
			var level = '';
			
			if ($('input[name=filialpreise]').is(':checked')) level = 'F';
			if ($('input[name=gesellschaftspreise]').is(':checked')) level += 'G';
			if ($('input[name=landespreise]').is(':checked')) level += 'L';
			
			$.post(
				'getPrices.php',
				{FNr:FNr,
				GNr:GNr,
				cols:'listung.ANr,vkp',
				level:level,
				type:'plain'},
				function(data) {
					// Wenn data nicht mit [ beginnt, ist es kein Array => Opperation abbrechen
					if (data.charAt(0) != '[') return false;
					var data = JSON.parse(data);
					var tmpData = '';
					
					for (i in data) {
						if (data[i] instanceof Array)
							tmpData += data[i].join('');
					}
					
					qrData += '' + tmpData;
					
					$('#qrinfo #plaindata span').text(qrData);
					qrcode.makeCode(qrData);
				}
			);
		}
		
		function updateBon(data) {
			data = '0120530601235010666601123450401111010555501012340100005680';
			
			var tmpGNr = data.substr(0,3);
			var tmpFNr = data.substr(3,3);
			
			// update Region and Store in the storeSelector
			$('#storeSelector .jqTransformSelectWrapper').first().find('a:contains('+tmpGNr+')').click();
			$('#storeSelector .jqTransformSelectWrapper').eq(1).find('a:contains('+tmpFNr+')').click();
			
			var positions = data.substr(6,2);
			
			// ab Stelle 9 beginnen die Artikeldetails
			var i = 8;
			var ANr, ANrList = [];
			var menge;
			var articles = [];
			
			for (var p=0; p<positions; p++) {
				ANr = data.substr(i,5);
				menge = data.substr(i+5, 2);
				
				ANrList.push(ANr);
				
				articles[p] = {
					ANr: ANr,
					menge: menge
				};
				
				i += 7;
			}
			
			// Pfandbons werden übersprungen
			i += 2;
			
			var bonsumme = data.substr(i,6)/100;
			
			console.dir(articles);
			console.log(bonsumme);
			
			$.post(
				'getBonDetails.php',
				{FNr:FNr,
				GNr:GNr,
				ANr:ANrList},
				function(data) {
					//console.log(data);
				}
			).success(function(data) {
				console.log(data)
			});
		}
		
		$(document).ready(function() {
			$('div#storeSelector form').jqTransform();
			$('#options input').change(function(){renderQRCode();});
		});
		
	</script>
</head>
<body>
	<div id="content">
		<div id="header">
			<div id="storeSelector">
				<form>
					<select name="gesellschaft" onchange="updateRegions(this.value)">
						<?php include 'getRegions.php'; ?>
					</select>
					<select name="filiale" onchange="updateStores(this.value)">
						<option value="0">000 - Alle Filialen</option>
					</select>
				</form>
				
			</div>
			<div id="top_nav">
				<div id="slider"></div>
				<div id="filiale" class="active">Filiale</div>
				<div id="datenbank">Datenbank</div>
				<div id="kasse">Kasse</div>
			</div>
		</div>
		<div id="body">
			<div class="coverflow">
				<div id="kasse_content" class="flowItem">
					<div id="bon_vorschau">
						Kassenbon
					</div>
					<div id="bon_liste">
						<h2>Eingescannte Artikel</h2>
					</div>
				</div>
				<div id="datenbank_content" class="flowItem">
					<div id="buttonbar">
						<div id="bb_preise" class="active"></div>
						<div id="bb_artikel"></div>
					</div>
					<div id="pricelist">
						<div class="preis info">Zur Anzeige von <b><span>Gesellschafts- und </span>Filialpreisen</b> bitte eine entsprechende Auswahl im DropDown-Men&uuml; treffen.</div>
						<h1>Filialpreise</h1>
						<!-- <button class="button icon reload">Aktualisieren</button> -->
						<div id="storeTable" class="pricetable">
							<button class="button icon danger remove">Eintrag l&ouml;schen</button>
						</div>
						<h1>Gesellschaftspreise</h1>
						<div id="regionTable" class="pricetable">
							<button class="button icon danger remove">Eintrag l&ouml;schen</button>
						</div>
						<h1>Landespreise</h1>
						<div id="nationalTable" class="pricetable">
							<button class="button icon danger remove">Eintrag l&ouml;schen</button>
						</div>
						
					</div>
					<div id="articlelist">
						<h1>Artikelstammdaten</h1>
						<div id="articleTable">
							<button class="button icon danger remove">Eintrag l&ouml;schen</button>
						</div>
					</div>
				</div>
				<div id="filiale_content" class="flowItem">
					<div id="qrcode"></div>
					<div id="options">
						<h2>Einstellungen</h2>
						<form name="qrsettings" action="">
							<h3>Aktuelle Preise</h3>
							<input type="checkbox" name="filialpreise"> Filialpreise<br>
							<input type="checkbox" name="gesellschaftspreise"> Gesellschaftspreise<br>
							<input type="checkbox" name="landespreise"> Landespreise<br>
							
							<h3>Aktuelle Artikel</h3>
							<input type="checkbox" name="plu" disabled> PLU-Nummern<br>
						</form>
					</div>
					<div id="qrinfo">
						<h2>QR-Code Informationen</h2>
						<div style="float: left; width: 250px">
							<h3>Aktuelle Filiale</h3>
							<span id="region"></span><br />
							<span id="store"></span>
						</div>
						<div id="plaindata" style="float: right; width: 450px;">
							<h3>QR-Daten in Klartext</h3>
							<span></span>
						</div>
						<br style="clear: both;" />
					</div>
				</div>
			</div>
		</div>
		<div id="footer"></div>
	</div>
</body>
</html>