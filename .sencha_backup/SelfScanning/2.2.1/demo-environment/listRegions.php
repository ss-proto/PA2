<?php
	$sql = 'SELECT * FROM gesellschaften
			ORDER BY GNr';
			
	$results = mysql_query($sql);
	while ($row = mysql_fetch_assoc($results)) {
		echo '<option value="'.$row['GNr'].'">'.sprintf('%1$03d',$row['GNr']).' - '.$row['Standortname'].'</option>'."\n\t\t";
	}
?>