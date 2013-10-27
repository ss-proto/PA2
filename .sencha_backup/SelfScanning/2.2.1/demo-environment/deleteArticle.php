<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	// Get posted data
	$ANr = isset($_POST['ANr']) ? $_POST['ANr'] : '';
	$FNr = isset($_POST['FNr']) ? $_POST['FNr'] : '';
	$GNr = isset($_POST['GNr']) ? $_POST['GNr'] : '';
	
	// zunächst muss das ean und bezeichnungs-Attribut genullt werden
	$sql = "UPDATE artikel SET ean=null, bezeichnung=null WHERE ANr='$ANr'";
	mysql_query($sql);
	
	// zusätzlich müssen die abhängigen Datensätze in der VKP-Tabelle genullt werden
	$sql = "UPDATE listung SET vkp=null WHERE ANr='$ANr'";
	mysql_query($sql);
			
	echo mysql_error();
	
?>