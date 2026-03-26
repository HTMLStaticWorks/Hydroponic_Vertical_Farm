$filePath = "d:\projects\Hydroponic Vertical Farm\dashboard.html"
$content = Get-Content $filePath

$newContent = @()
$hamburgerHtml = '        <button class="dash-hamburger" id="dash-hamburger"><span class="dash-hamburger-line"></span><span class="dash-hamburger-line"></span><span class="dash-hamburger-line"></span></button>'

$toggleScript = @"
<script>
  const dashHamburger = document.getElementById('dash-hamburger');
  const dashSidebar = document.getElementById('dash-sidebar');
  if (dashHamburger && dashSidebar) {
    dashHamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      dashSidebar.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (dashSidebar.classList.contains('open') && !dashSidebar.contains(e.target)) {
        dashSidebar.classList.remove('open');
      }
    });
  }
</script>
"@

foreach ($line in $content) {
    # Inject hamburger into every dash-header
    if ($line -match '<div class="dash-header">') {
        $newContent += $line
        $newContent += $hamburgerHtml
        continue
    }

    # Inject script before closing body
    if ($line -match '</body>') {
        $newContent += $toggleScript
        $newContent += $line
        continue
    }

    $newContent += $line
}

$newContent | Set-Content $filePath -Encoding UTF8
Write-Output "Successfully added hamburger and toggle script to dashboard.html"
