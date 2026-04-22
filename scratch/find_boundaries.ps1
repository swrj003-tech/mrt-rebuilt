
$mapFile = "MRT_Project_Code_Map.txt"
$pattern = "## File: src\\main.js"
$nextPattern = "## File: "

$startLine = -1
$endLine = -1

$lines = Get-Content $mapFile -ReadCount 1000
$lineNumber = 0

foreach ($chunk in $lines) {
    foreach ($line in $chunk) {
        $lineNumber++
        if ($line -eq $pattern) {
            $startLine = $lineNumber
            continue
        }
        if ($startLine -gt -1 -and $line.StartsWith($nextPattern)) {
            $endLine = $lineNumber - 1
            break
        }
    }
    if ($endLine -gt -1) { break }
}

Write-Host "START:$startLine"
Write-Host "END:$endLine"
