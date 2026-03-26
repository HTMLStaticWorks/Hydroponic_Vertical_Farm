$files = Get-ChildItem -Filter *.html
$favicon = '<link rel="icon" href="images/logo_leaf.png" type="image/png"/>'

foreach ($file in $files) {
    (Get-Content $file.FullName) -replace '(<title>.*</title>)', "`$1`n  $favicon" | Set-Content $file.FullName
}
