<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	// Get posted data
	$page		= isset($_POST['page']) ? $_POST['page'] : 1;
    $rp			= isset($_POST['rp']) ? $_POST['rp'] : 10;
    $sortname 	= isset($_POST['sortname']) ? $_POST['sortname'] : '';
    $sortorder 	= isset($_POST['sortorder']) ? $_POST['sortorder'] : '';
	$GNr	= isset($_POST['GNr']) ? $_POST['GNr'] : 0;
	$FNr	= isset($_POST['FNr']) ? $_POST['FNr'] : 0;
    $query	= isset($_POST['query']) ? $_POST['query'] : false;
    $qtype	= isset($_POST['qtype']) ? $_POST['qtype'] : false;
	
	// Die Artikel einer Filiale werden in 3 Gruppen geteilt
	// 1) $fArtikel enth�lt alle filialweit g�ltigen Eintr�ge aus der DB (z.B. LPVs).
	//		-> GNr und FNr sind gesetzt.
	$getFArtikel = "SELECT * FROM listung fArtikel
					NATURAL LEFT JOIN artikel
					WHERE GNr=$GNr AND FNr=$FNr";
	// 2) $gArtikel enth�lt alle gesellschaftsweit g�ltigen Eintr�ge aus der DB (z.B. Regionalartikel, ZPVs, ...).
	//		-> (GNr gesetzt, FNr = 0) UND darf nicht in fArtikel enthalten sein!
	$getGArtikel = "SELECT * FROM listung gArtikel
					NATURAL LEFT JOIN artikel
					WHERE GNr=$GNr AND FNr=0
					AND NOT EXISTS ($getFArtikel AND gArtikel.ANr = fArtikel.ANr)";
	// 3) $lArtikel enth�lt alle landesweit (!) g�ltigen Eintr�ge aus der DB (z.B. Sortiments-, Aktionsartikel, ...)
	//		-> GNr = 0, FNr = 0				
	$getLArtikel = "SELECT * FROM listung lArtikel
					NATURAL LEFT JOIN artikel
					WHERE GNr=0 AND FNr=0
					AND NOT EXISTS ($getGArtikel AND lArtikel.ANr = gArtikel.ANr)
					AND NOT EXISTS ($getFArtikel AND lArtikel.ANr = fArtikel.ANr)";
					
	// Setup paging SQL
	$pageStart = ($page-1)*$rp;
	$limitSql = "limit $pageStart, $rp";
	
	// Setup sort and search SQL using posted data
	$sortSql = '';
	if ($sortname!='') $sortSql = "order by $sortname $sortorder";
					
	// Zun�chst werden alle filialspezifischen Eintr�ge ausgelesen
	$getArtikel = ''.$getFArtikel.'
					UNION
					'.$getGArtikel.'
					UNION
					'.$getLArtikel.'
					'.$sortSql.'
					'.$limitSql;
	
	$results = mysql_query($getArtikel);
	
	
	// Return JSON data
	$data = array();
	$data['page'] = $page;
	$data['total'] = 0;
	$data['rows'] = array();
	
	
	while ($row = mysql_fetch_assoc($results)) {
		$data['total']++;
		// Pr�fen ob GNr bzw. FNr gesetzt sind und entsprechender Level festlegen
		if ($row['GNr']!=0)
			if ($row['FNr']!=0) $row['level'] = 'F';
			else $row['level'] = 'G';
		else $row['level'] = 'L';
		
		$data['rows'][] = array(
			'id' => $row['ANr'],
			'cell' => array("<input type='checkbox' name='rowChk' id='".$row['ANr']."' >", $row['ANr'], $row['ean'], $row['bezeichnung'], $row['VKP'], $row['level'])
		);
	}
	
	echo json_encode($data);
?>