<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	mysql_query("SET NAMES 'utf8'");
	
	$callback = $_REQUEST['callback'];
	
	$sql = 'SELECT * FROM gesellschaften
			ORDER BY GNr';
			
	$data = array();
			
	$results = mysql_query($sql);
	while ($row = mysql_fetch_assoc($results)) {
		if (!$callback) {
			// HTML-Formatierte Liste für die Ausgabe im Backend
			echo '<option value="'.$row['GNr'].'">'.sprintf('%1$03d',$row['GNr']).' - '.$row['Ort'].'</option>'."\n\t\t";
		} else {
			// JSON-Objekt für die App
			array_push($data, $row);
		}
	}
	
	if ($callback) {
		header('Content-Type: text/javascript');
		echo $callback.'('.json_encode($data).');';
	}
?>