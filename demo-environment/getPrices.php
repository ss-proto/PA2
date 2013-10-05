<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	// Get posted data
	$GNr	= isset($_REQUEST['GNr']) 	? $_REQUEST['GNr'] 	 : 'GNr';
	$FNr	= isset($_REQUEST['FNr']) 	? $_REQUEST['FNr'] 	 : 'FNr';
	$cols	= isset($_REQUEST['cols']) 	? $_REQUEST['cols']  : '*';
	$level 	= isset($_REQUEST['level']) ? $_REQUEST['level'] : '';
	
	$page		= isset($_POST['page']) ? $_POST['page'] : 1;
    $rp			= isset($_POST['rp']) ? $_POST['rp'] : 10;
    $sortname 	= isset($_POST['sortname']) ? $_POST['sortname'] : '';
    $sortorder 	= isset($_POST['sortorder']) ? $_POST['sortorder'] : '';
	
    $query	= isset($_POST['query']) ? $_POST['query'] : false;
    $qtype	= isset($_POST['qtype']) ? $_POST['qtype'] : false;
	
	$callback 	= $_REQUEST['callback'];
	$timestamp 	= $_REQUEST['lastUpdated'];
	$type		= $_REQUEST['type'];
	
	// Setup paging SQL
	$pageStart = ($page-1)*$rp;
	$limitSql = "limit $pageStart, $rp";
	
	// Setup sort and search SQL using posted data
	$sortSql = '';
	if ($sortname!='') $sortSql = "order by $sortname $sortorder";
	
	// Setup filtering by date
	$filterByDate = isset($timestamp) ? "AND listung.timestamp > '$timestamp'" : "";
	
	// Setup additional level-column for Backend- or QR-Filter
	$fAsLevel = '';
	$gAsLevel = '';
	$lAsLevel = '';
	if (!isset($callback) && $type!='plain') {
		$fAsLevel = ", 'F' as level";
		$gAsLevel = ", 'G' as level";
		$lAsLevel = ", 'L' as level";
	}
	
	
	// Die Artikel einer Filiale werden in 3 Gruppen geteilt		
	// 1) $fArtikel enthält alle filialweit gültigen Einträge aus der DB (z.B. LPVs).
	//		-> GNr und FNr sind gesetzt.
	$getFArtikel = "SELECT $cols $fAsLevel FROM listung
					INNER JOIN artikel ON listung.ANr = artikel.ANr
					WHERE GNr=$GNr AND FNr=$FNr
					AND GNr!=0 AND FNr!=0
					$filterByDate";
					
	// 2) $gArtikel enthält alle gesellschaftsweit gültigen Einträge aus der DB (z.B. Regionalartikel, ZPVs, ...).
	//		-> (GNr gesetzt, FNr = 0) UND darf nicht in fArtikel enthalten sein!
	$getGArtikel = "SELECT $cols $gAsLevel FROM listung
					INNER JOIN artikel ON listung.ANr = artikel.ANr
					WHERE GNr=$GNr AND FNr=0
					AND GNr!=0
					$filterByDate";
	
	// 3) $lArtikel enthält alle landesweit gültigen Einträge aus der DB (z.B. Sortiments-, Aktionsartikel, ...)
	//		-> GNr = 0, FNr = 0		
	$getLArtikel = "SELECT $cols $lAsLevel FROM listung
					INNER JOIN artikel ON listung.ANr = artikel.ANr
					WHERE GNr=0 AND FNr=0
					$filterByDate";
					
	$spacer		= ($type=='plain') ? " UNION ALL SELECT '0000' AS ANr,'' AS vkp" : '';
	

	switch ($level) {
		case 'F': 	$sql = $getFArtikel; break;
		case 'FG': 	$sql = $getFArtikel.$spacer.' UNION ALL '.$getGArtikel; break;
		case 'FGL': $sql = $getFArtikel.$spacer.' UNION ALL '.$getGArtikel.$spacer.' UNION ALL '.$getLArtikel; break;
		case 'G':	$sql = $getGArtikel; break;
		case 'GL': 	$sql = $getGArtikel.$spacer.' UNION ALL '.$getLArtikel; break;
		case 'L': 	$sql = $getLArtikel; break;
		default:	$sql = ''; break;
	}
	
	//var_dump($sql);
	$results = mysql_query($sql);
	echo mysql_error();
	
	// Return JSON data
	$data = array();
	
	while ($results && $row = mysql_fetch_array($results, MYSQL_ASSOC)) {
		// FNr und GNr müssen 3-stellig sein
		$row['FNr'] = str_pad($row['FNr'], 3, 0, STR_PAD_LEFT);
		$row['GNr'] = str_pad($row['GNr'], 3, 0, STR_PAD_LEFT);
		
		$echoRow = $row;
		
		switch ($type) {
			case 'array': $echoRow = array_values($row); break;
			case 'plain': 
				if ($row['vkp'] == null) {
					if ($row['ANr'] == '0000')
						// Wenn die Artikelnummer 0000 ist, handelt es sich um ein Trennzeichen => kein VKP ausgeben!
						$row['vkp'] = '';
					else
						// Ansonsten handelt es sich um einen obsoleten Datensatz
						$row['vkp'] = '00000';
				} else {
					// Die VKPs der gültigen Datensätze müssen mit 0en gefüllt werden
					$row['vkp'] = str_pad(($row['vkp']*100), 5, '0', STR_PAD_LEFT);
				}
				$echoRow = array_values($row);
				break;
		}
		if ($row['vkp'] != null) {
			// Datensatz ist ein gültiger Datensatz
			array_push($data, $echoRow);
		} else {
			// Datensatz ist ein NULL-Datensatz, d.h. er wurde weich gelöscht
			if ((isset($callback) && isset($timestamp)) || $type=='plain') {
				// Anfrage stammt (vom Smartphone und ist eine Update-Anfrage) oder ist eine QR-Berechnung
				array_push($data, $echoRow);
			} else {
				// Anfrage kommt vom Backend..oder ist eine initiale Anfrage vom Smartphone
				// -> nichts tun
			}
		}
	}
	
	if (isset($callback)) {
		header('Content-Type: text/javascript');
		echo $callback.'('.json_encode($data).');';
	} else 
		echo json_encode($data);
?>