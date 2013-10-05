<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	// Get posted data
	$col = isset($_POST['col']) ? $_POST['col'] : '';
	$val = isset($_POST['val']) ? $_POST['val'] : '';
	// Falls ANr == '', handelt es sich um einen neuen Artikel. Dann muss
	$ANr = (isset($_POST['ANr']) && $_POST['ANr']!='') ? $_POST['ANr'] : $val;
	
	switch ($col) {
		case 'ANr':
			// Bei einer Anfrage mit $col = ANr handelt es sich nur dann um einen neuen Eintrag,
			// wenn $ANr == '' ist
			$sql = "INSERT INTO artikel ($col) VALUES ('$ANr') ON DUPLICATE KEY UPDATE ANr='$val';\n";
			break;
		case 'ean':
		case 'bezeichnung':
			$sql = "UPDATE artikel SET $col = '$val' WHERE ANr = '$ANr';";
			break;
		default:
			$sql = "";
			break;
	}
	
	//echo $sql;
	echo mysql_query($sql);		
	echo mysql_error();
	
?>