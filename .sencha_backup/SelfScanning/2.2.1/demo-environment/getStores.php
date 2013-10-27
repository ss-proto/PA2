<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	mysql_query("SET NAMES 'utf8'");

	$GNr 		= isset($_REQUEST['GNr']) ? $_REQUEST['GNr'] : 'GNr';
	$callback	= $_REQUEST['callback'];

	$sql = 'SELECT * FROM filialen
			WHERE GNr = '.$GNr.'
			ORDER BY FNr';
			
	$results = mysql_query($sql);
	echo mysql_error();
	
	$data = array();
	
	while ($row = mysql_fetch_assoc($results)) {
		if (!($callback)) {
			// HTML-Formatierte Ausgabe zur Darstellung im Backend
			echo '<option value="'.$row['FNr'].'">'.sprintf('%1$03d',$row['FNr']).' - '.$row['Ort'].'</option>';
		} else {
			// JSON für Smartphone DB
			array_push($data, $row);
		}
	}
	
	if ($callback) {
		header('Content-Type: text/javascript');
		echo $callback.'('.json_encode($data).');';
	}
?>