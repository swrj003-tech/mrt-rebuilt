
$target = "MRT_Project_Code_Map.txt"
$root = "D:\mtr-010-main"

# Header
$header = @"
# MRT International - Complete Project Code Map
## Project Overview
This document contains the complete file-by-file structure and source code for the MRT International Holding LLC e-commerce platform.

## Folder Structure
```
$(cmd /c tree /f /a)
```

---
"@

$header | Out-File $target -Encoding utf8

# Get all files except excluded ones
$files = Get-ChildItem -Path $root -Recurse -File | Where-Object { 
    $_.FullName -notmatch "node_modules" -and 
    $_.FullName -notmatch "\\.git" -and 
    $_.FullName -notmatch "\\.gemini" -and 
    $_.FullName -notmatch "dist" -and
    $_.FullName -notmatch "artifacts" -and
    $_.FullName -notmatch "\\.png$" -and
    $_.FullName -notmatch "\\.jpg$" -and
    $_.FullName -notmatch "\\.webp$" -and
    $_.FullName -notmatch "\\.svg$" -and
    $_.FullName -notmatch "\\.db$" -and
    $_.FullName -notmatch "\\.ico$" -and
    $_.Name -ne $target -and
    $_.Name -ne "MRT_Map_v2.txt" -and
    $_.Name -ne "generate_map.ps1"
}

$backticks = "```"

foreach ($file in $files) {
    $relative = $file.FullName.Replace($root + "\", "")
    $ext = [System.IO.Path]::GetExtension($file.Name).Replace(".", "")
    if ($ext -eq "cjs") { $ext = "javascript" }
    
    Add-Content $target "`n## File: $relative"
    Add-Content $target "Path: $relative"
    Add-Content $target "Size: $($file.Length) bytes"
    Add-Content $target "$backticks$ext"
    
    if ($file.Length -eq 0) {
        Add-Content $target "(File is empty)"
    } else {
        Get-Content $file.FullName | Add-Content $target
    }
    
    Add-Content $target "$backticks"
    Add-Content $target "`n---"
    
    Write-Host "Processed: $relative"
}

Write-Host "Code map generated successfully: $target"
