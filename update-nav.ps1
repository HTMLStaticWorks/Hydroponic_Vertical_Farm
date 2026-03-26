$target = '<a href="signup.html" class="nav-link nav-signup-btn">Sign Up</a>'
$replace = '<a href="contact.html" class="nav-quote-btn">Get a Quote</a>' + "`r`n      " + '<a href="signup.html" class="nav-link nav-signup-btn">Sign Up</a>'

$count = 0
Get-ChildItem -Filter *.html | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    if ($content.Contains($target)) {
        if (-not $content.Contains('<a href="contact.html" class="nav-quote-btn">')) {
            $content = $content.Replace($target, $replace)
            [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Output "Updated $($_.Name)"
            $count++
        }
    }
}
Write-Output "Total files updated: $count"
