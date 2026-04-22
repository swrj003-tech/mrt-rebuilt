
$mapFile = "MRT_Project_Code_Map.txt"
$startPattern = "## File: src\main.js"
$nextPattern = "## File: "

$lines = Get-Content $mapFile
$startLine = -1
$endLine = -1

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "## File: src\\main.js") {
        $startLine = $i
        continue
    }
    if ($startLine -gt -1 -and $lines[$i] -match "## File: ") {
        $endLine = $i - 1
        break
    }
}

if ($startLine -gt -1) {
    if ($endLine -eq -1) { $endLine = $lines.Count - 1 }
    
    # The content is between the header/meta and the closing code fence
    # Header is at startLine, Path is at startLine+1, Size is at startLine+2, Code fence is at startLine+3
    $contentStart = $startLine + 4
    $contentEnd = $endLine - 1 # Remove the closing ```
    
    $extracted = $lines[$contentStart..$contentEnd]
    $extracted | Out-File -FilePath "src/main.js" -Encoding utf8
    Write-Host "Restored src/main.js from line $contentStart to $contentEnd"
} else {
    Write-Error "Could not find src/main.js in map"
}
