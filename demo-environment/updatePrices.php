<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	// Get posted data
	$ANr = isset($_POST['ANr']) ? $_POST['ANr'] : '0';
	$FNr = isset($_POST['FNr']) ? $_POST['FNr'] : '0';
	$GNr = isset($_POST['GNr']) ? $_POST['GNr'] : '0';
	$col = isset($_POST['col']) ? $_POST['col'] : '';
	$val = isset($_POST['val']) ? $_POST['val'] : '';
	
	switch ($col) {
		case 'ANr':
			// Bei einer Anfrage mit $col = ANr handelt es sich um einen neuen Eintrag in der Tabelle 'listung'
			// ggf. existiere in der Vergangenheit ein Datensatz mit selben Primary Key, dann muss dieser geupdatet werden
			$sql = "INSERT INTO listung ($col, FNr, GNr) VALUES ('$val', '$FNr', '$GNr') ON DUPLICATE KEY UPDATE $col = '$val';\n";
			break;
		case 'ean':
		case 'bezeichnung':
		case 'vkp':
		case 'Datum_von':
		case 'Datum_bis':
			$sql = "INSERT INTO listung (ANr, FNr, GNr, $col) VALUES ('$ANr', '$FNr', '$GNr', '$val') ON DUPLICATE KEY UPDATE $col = '$val'";
			break;
		default:
			$sql = "";
			break;
	}
	
	//echo $sql;
	echo mysql_query($sql);		
	echo mysql_error();
	
?>