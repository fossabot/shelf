<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="theme-color" content="#ffffff">
  <meta name="msapplication-navbutton-color" content="#ffffff">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Shelf, a comic database and collection management tool">
  <title>Shelf</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" />
  <link rel="stylesheet" href="css/style.css" />
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
	$sql = "SELECT DISTINCT * FROM (
						SELECT	issue.number number,
										series.name series
						FROM gcd_series AS series
						LEFT JOIN (
							SELECT series_id, number
							FROM gcd_issue
							WHERE publication_date = DATE_FORMAT(CURRENT_DATE, '%M %Y')
						) issue ON issue.series_id = series.id
						WHERE country_id = 225
						AND is_current = 1
					) issues
					WHERE number != 'NULL'
					LIMIT 15";
	$currentComics = $conn->query($sql);
	$sql = "SELECT DISTINCT * FROM (
						SELECT	issue.number number,
										series.name series
						FROM gcd_series AS series
						LEFT JOIN (
							SELECT series_id, number
							FROM gcd_issue
							WHERE publication_date = DATE_FORMAT(DATE_ADD(CURRENT_DATE, INTERVAL 1 MONTH), '%M %Y')
						) issue ON issue.series_id = series.id
						WHERE country_id = 225
						AND is_current = 1
					) issues
					WHERE number != 'NULL'
					LIMIT 15";
		$nextComics = $conn->query($sql);
?>

<body>
  <header>
    <h1>Shelf</h1>
		<div class="header-tabs-container">
			<p class="spacer"></p>
			<div class="header-tabs">
				<p>Browse</p>
				<p>&#128269;</p>
			</div>
		</div>
  </header>
	<main>
		<section>
			<div class="section-header">
				<h2>Releases this month:</h2>
			</div>
			<div class="issue-bar">
				<?php
					if ($currentComics->num_rows > 0) {
						while ($row = $currentComics->fetch_assoc()) {
							echo '<div class="issue-box">';
							echo '<div class="issue-cover"></div>';
							echo '<p><span class="issue-title">' . $row['series'] . '</span>';
							echo '<span class="issue-number"> #' . $row['number'] . '</span></p>';
							echo '<p class="issue-date">' . $row['date'] . '</p>';
							echo '</div>';
						}
					} else {
						echo "<p>No new issues</p>";
					}
				?>
			</div>
		</section>
		<section>
			<div class="section-header">
				<h2>Releases next month:</h2>
			</div>
			<div class="issue-bar">
				<?php
					if ($nextComics->num_rows > 0) {
						while ($row = $nextComics->fetch_assoc()) {
							echo '<div class="issue-box">';
							echo '<div class="issue-cover"></div>';
							echo '<p><span class="issue-title">' . $row['series'] . '</span>';
							echo '<span class="issue-number"> #' . $row['number'] . '</span></p>';
							echo '<p class="issue-date">' . $row['date'] . '</p>';
							echo '</div>';
						}
					} else {
						echo "<p>No new issues</p>";
					}
				?>
			</div>
		</section>
	</main>
	<footer>
		<p id="login" class="button">Log In</p>
		<p id="signup" class="button">Sign Up</p>
	</footer>
</body>
<?php $conn->close(); ?>
</html>
