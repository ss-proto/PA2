<?php
	// Connect to MySQL database
	mysql_connect('localhost', 'ss-proto', 'pr0t0typing');
	mysql_select_db('ss-proto');
	
	// Get posted data	
	$page		= isset($_POST['page']) ? $_POST['page'] : 1;
    $rp			= isset($_POST['rp']) ? $_POST['rp'] : 10;
    $sortname 	= isset($_POST['sortname']) ? $_POST['sortname'] : '';
    $sortorder 	= isset($_POST['sortorder']) ? $_POST['sortorder'] : '';
    $query	= isset($_POST['query']) ? $_POST['query'] : false;
    $qtype	= isset($_POST['qtype']) ? $_POST['qtype'] : false;
	$callback = $_REQUEST['callback'];
	$timestamp = $_REQUEST['lastUpdated'];
	
	// Setup paging SQL
	$pageStart = ($page-1)*$rp;
	$limitSql = "limit $pageStart, $rp";
	
	// Setup sort and search SQL using posted data
	$sortSql = '';
	if ($sortname!='') $sortSql = "order by $sortname $sortorder";
	
	// Setup filtering by date
	$filterByDate = isset($timestamp) ? "WHERE timestamp > '$timestamp'" : "";
	
	
	$getArtikel = "SELECT * FROM artikel
					$filterByDate
					$sortSql
					$limitSql";					
				
	$results = mysql_query($getArtikel);
	
	// Return JSON data
	$data = array();
	
	while ($row = mysql_fetch_array($results, MYSQL_ASSOC)) {
		// weightDependant Spalte muss von Tinyint zu Boolean gewandelt werden
		$row['weightDependant'] = ($row['weightDependant'] == 1) ? true : false;
		// Falls ean und bezeichnung gleich null sind, wurde der Artikel "weich" gelöscht.
		if ($row['ean'] == null && $row['bezeichnung'] == null) {
			// Prüfen, ob die Anfrage vom Smartphone kommt ($callback !== null)
			// und ob es sich um ein Update handelt ($timestamp !== ''),
			// nur dann (!) soll der "weich gelöschte" Datensatz übertragen werden
			if (isset($callback) && $timestamp !== '') {
				array_push($data, $row);
			}
		} else {
			array_push($data, $row);
		}
	}
	
	if (isset($callback)) {
		header('Content-Type: text/javascript');
		echo $callback.'('.json_encode($data).');';
	} else 
		echo json_encode($data);
?>