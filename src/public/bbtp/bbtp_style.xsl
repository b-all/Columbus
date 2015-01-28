<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/" >
	<html>
		<head>
			<link rel="stylesheet" type="text/css" href="./bbtp_style.css" />
		</head>
		<body>
			<h2>Columbus - Black Box Test Plan</h2>
			<table class="fancyTable">
				<tr>
					<th style="width:10%">Test ID</th>
					<th style="width:30%">Description</th>
					<th style="width:30%">Expected Results</th>
					<th style="width:5%">Actual Results</th>
					<th style="width:5%">Use Case</th>
					<th style="width:5%">Role</th>
					<th style="width:5%">Date Added</th>
					<th style="width:5%">Date Modified</th>									
				</tr>
				<xsl:for-each select="BlackBoxTestPlan/test">

					<tr valign="top" class="alt">
						<td><xsl:value-of select="@id" /></td>
						<td><xsl:for-each select="description/precondition">
								<xsl:value-of select="." /><br />
							</xsl:for-each>
							<br />
							Steps: <br />
							<ol>
								<xsl:for-each select="description/step">
									<li><xsl:value-of select="." /></li>
								</xsl:for-each>
							</ol>
						</td>
						<td>
							<xsl:for-each select="expectedResults/eResult">
								<xsl:value-of select="." /><br />
							</xsl:for-each>
						</td>
						<td>
							<xsl:for-each select="actualResults/aResult">
								<xsl:value-of select="." /><br />
							</xsl:for-each>
						</td>
						<td><xsl:value-of select="usecase" /></td>
						<td><xsl:value-of select="role" /></td>
						<td><xsl:value-of select="dateAdded" /></td>
						<td><xsl:value-of select="dateModified" /></td>
					</tr>
				</xsl:for-each>	
			</table>
		</body>
	</html>
</xsl:template>

</xsl:stylesheet>