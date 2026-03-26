$filePath = "d:\projects\Hydroponic Vertical Farm\dashboard.html"
$content = Get-Content $filePath -Raw

$oldContent = @"
    <div class="dash-sidebar-header">
      <div class="dash-farm-name">
        <img src="images/logo_leaf.png" alt="" style="width:34px;height:34px;object-fit:cover;border-radius:8px;"/>
        Dubai Farm Alpha
      </div>
"@

$newContent = @"
    <div class="dash-sidebar-header">
      <a href="index.html" class="dash-brand">
        <div class="logo-icon"><img src="images/logo_leaf.png" alt="" style="width:24px;height:24px;object-fit:cover;"/></div>
        <span class="logo-text">Hydro<span>Farm</span> Pro</span>
      </a>
      <div class="dash-farm-name">
        Dubai Farm Alpha
      </div>
"@

if ($content -contains $oldContent.Trim()) {
    $content = $content -replace [regex]::Escape($oldContent.Trim()), $newContent.Trim()
    Set-Content -Path $filePath -Value $content -NoNewline
    Write-Output "Successfully updated dashboard.html"
} else {
    Write-Error "Could not find the target content in dashboard.html"
}
