<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	// Get posted data
	$GNr	= isset($_REQUEST['GNr']) 	? $_REQUEST['GNr'] 	 : 'GNr';
	$FNr	= isset($_REQUEST['FNr']) 	? $_REQUEST['FNr'] 	 : 'FNr';
	$ANr	= isset($_REQUEST['ANr']) 	? $_REQUEST['ANr']  : '*';
	
	$ANrList = implode($ANr, ', ');
	
	// Die Artikel einer Filiale werden in 3 Gruppen geteilt		
	// 1) $fArtikel enthält alle filialweit gültigen Einträge aus der DB (z.B. LPVs).
	//		-> GNr und FNr sind gesetzt.
	$getFArtikel = "SELECT artikel.ANr AS ANr, bezeichnung, vkp FROM listung
					INNER JOIN artikel ON listung.ANr = artikel.ANr
					WHERE artikel.ANr in($ANrList) AND GNr=$GNr AND FNr=$FNr
					AND GNr!=0 AND FNr!=0";
					
	// 2) $gArtikel enthält alle gesellschaftsweit gültigen Einträge aus der DB (z.B. Regionalartikel, ZPVs, ...).
	//		-> (GNr gesetzt, FNr = 0) UND darf nicht in fArtikel enthalten sein!
	$getGArtikel = "SELECT artikel.ANr AS ANr, bezeichnung, vkp FROM listung
					INNER JOIN artikel ON listung.ANr = artikel.ANr
					WHERE artikel.ANr in($ANrList) AND GNr=$GNr AND FNr=0
					AND GNr!=0";
	
	// 3) $lArtikel enthält alle landesweit gültigen Einträge aus der DB (z.B. Sortiments-, Aktionsartikel, ...)
	//		-> GNr = 0, FNr = 0		
	$getLArtikel = "SELECT artikel.ANr AS ANr, bezeichnung, vkp FROM listung
					INNER JOIN artikel ON listung.ANr = artikel.ANr
					WHERE artikel.ANr in($ANrList) AND GNr=0 AND FNr=0";
	
	$sql = $getFArtikel.' UNION ALL '.$getGArtikel.' UNION ALL '.$getLArtikel;
	
	//var_dump($sql);
	$results = mysql_query($sql);
	echo mysql_error();
	
	// Return JSON data
	$data = array();
	
	while ($results && $row = mysql_fetch_array($results, MYSQL_ASSOC)) {
		$tmpANr = str_pad($row['ANr'], 5, '0', STR_PAD_LEFT);

		if ($row['vkp'] != null && array_search($tmpANr, $ANr) > -1) {
			// Datensatz in das Ergebnis schreiben
			$data[$row['ANr']] = $row;
			// und aus der ANrListe nehmen
			$ANr = array_diff($ANr, [$tmpANr]);
		}
	}
	
	echo json_encode($data);
?>