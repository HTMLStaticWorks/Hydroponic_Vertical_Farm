$filePath = "d:\projects\Hydroponic Vertical Farm\dashboard.html"
$content = Get-Content $filePath

$newContent = @()
$brandHtml = '      <a href="index.html" class="dash-brand">
        <div class="logo-icon"><img src="images/logo_leaf.png" alt="" style="width:24px;height:24px;object-fit:cover;"/></div>
        <span class="logo-text">Hydro<span>Farm</span> Pro</span>
      </a>'

$skipNext = 0

foreach ($line in $content) {
    if ($skipNext -gt 0) {
        $skipNext--
        continue
    }

    if ($line -match '<div class="dash-sidebar-header">') {
        $newContent += $line
        $newContent += $brandHtml
        continue
    }

    if ($line -match '<div class="dash-farm-name">') {
        $newContent += '      <div class="dash-farm-name">'
        $newContent += '        Dubai Farm Alpha'
        $newContent += '      </div>'
        $skipNext = 3 # Skip the old img and text lines
        continue
    }

    $newContent += $line
}

$newContent | Set-Content $filePath -Encoding UTF8
Write-Output "Successfully updated dashboard.html with branding"
