$filePath = "d:\projects\Hydroponic Vertical Farm\dashboard.html"
$content = Get-Content $filePath -Raw

# Remove ALL occurrences of the hamburger button inside panels (we'll keep just one in main)
$content = $content -replace '(?s)\s*<button class="dash-hamburger" id="dash-hamburger">.*?</button>', ''

# Add a single hamburger button inside the wrapper BEFORE the sidebar, at the top of dash-main
# We'll inject it into the first .dash-header as a flex item
# Instead, simpler: inject a floating hamburger at top of page
$floatingHamburger = @'
  <!-- HAMBURGER TOGGLE (mobile) -->
  <button class="dash-hamburger" id="dash-hamburger"><span class="dash-hamburger-line"></span><span class="dash-hamburger-line"></span><span class="dash-hamburger-line"></span></button>
'@

# Inject it right after <div class="dashboard-wrapper">
$content = $content -replace '(<div class="dashboard-wrapper">)', "`$1`n$floatingHamburger"

# Remove any old toggle scripts 
$content = $content -replace '(?s)<script>\s*const dashHamburger.*?</script>', ''

# Add the corrected toggle script before </body>
$newScript = @'
<script>
  (function() {
    var hamburger = document.getElementById('dash-hamburger');
    var sidebar = document.getElementById('dash-sidebar');
    if (!hamburger || !sidebar) return;

    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== hamburger) {
        sidebar.classList.remove('open');
      }
    });

    // Close sidebar when a nav link is clicked (switching menu items)
    var navLinks = sidebar.querySelectorAll('.dash-nav-link');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth < 900) {
          sidebar.classList.remove('open');
        }
      });
    });
  })();
</script>
'@

$content = $content -replace '(?s)(</body>)', "$newScript`n`$1"
$content | Set-Content $filePath -Encoding UTF8 -NoNewline
Write-Output "Done: fixed hamburger toggle for dashboard."
