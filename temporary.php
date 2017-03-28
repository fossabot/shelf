<!doctype html>
<html lang="en">

<head>
  <title>Shelf</title>
</head>

<?php
	include 'dbCredentials.php';
	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
		echo "<!-- Connection failed -->";
	} else {
		echo "<!-- Connection success -->";
	}
	$sql = "SELECT id FROM gcd_issue WHERE series_id = 92892";
	$idList = $conn->query($sql);
?>

<body>
  <?php
					if ($idList->num_rows > 0) {
						while ($row = $idList->fetch_assoc()) {
							echo $row[id] . '<br />';
						}
					} else {
						echo "<p>No new issues</p>";
					}
				?>
</body>
<?php $conn->close(); ?>
</html>
