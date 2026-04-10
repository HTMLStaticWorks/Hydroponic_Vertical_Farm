$files = Get-ChildItem -Filter *.html
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $newContent = $content -replace '(?s)(<div class="footer-logo">\s*<img[^>]+>\s*)Hydro<span>Farm</span> Pro', '$1<span class="logo-text">Hydro<span>Farm</span> Pro</span>'
    $newContent = $newContent -replace 'class="social-links" style="margin-top:1.5rem;justify-content:center;"', 'class="social-links" style="margin-top:1.5rem;justify-content:flex-start;"'
    if ($content -ne $newContent) {
        Set-Content -Path $f.FullName -Value $newContent
        Write-Host "Updated $($f.Name)"
    }
}
