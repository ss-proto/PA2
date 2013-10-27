<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	// Get posted data
	$ANr = isset($_POST['ANr']) ? $_POST['ANr'] : '';
	$FNr = isset($_POST['FNr']) ? $_POST['FNr'] : '';
	$GNr = isset($_POST['GNr']) ? $_POST['GNr'] : '';
	
	$sql = "UPDATE listung SET vkp=null WHERE ANr='$ANr' AND FNr='$FNr' AND GNr='$GNr'";
	
	mysql_query($sql);		
	echo mysql_error();
	
?>