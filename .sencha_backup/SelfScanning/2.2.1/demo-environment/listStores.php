<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');

	$GNr = isset($_POST['GNr']) ? $_POST['GNr'] : 0;

	$sql = 'SELECT * FROM filialen
			WHERE GNr = '.$GNr.'
			ORDER BY FNr';
			
	$results = mysql_query($sql);
	echo mysql_error();
	while ($row = mysql_fetch_assoc($results)) {
		echo '<option value="'.$row['FNr'].'">'.sprintf('%1$03d',$row['FNr']).' - '.$row['Standortname'].'</option>';
	}
?>