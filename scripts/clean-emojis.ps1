# PowerShell script to remove all emojis from markdown files except checkmark, cross, warning, target

$docsPath = "d:\PROJECT\ai-interviewer\docs"
$files = Get-ChildItem -Path $docsPath -Filter *.md -Recurse

# Emoji patterns to remove (keep only: checkmark cross warning target)
$emojiPatterns = @(
    '[🎉🚀💎🏆⚡📊👑💰🎤🎮📈🔧✨🎨🔥💡⚙️📝🧠💀🌟🎬🎊💥🎆🎁🥽⛓️🤖📱🌐🏅🎯]',
    '[😮😊🙏👍🤝💪🎓👨‍💻🧑‍🎓]',
    '[📦📢📣📡📲💭💬🗨️]',
    '[🔑🔐🔓🔒🛡️]',
    '[➡️⬅️⬆️⬇️↗️↘️⤴️⤵️]',
    '[▶️⏸️⏹️⏺️⏭️⏮️]'
)

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalLength = $content.Length
    
    foreach ($pattern in $emojiPatterns) {
        $content = $content -replace $pattern, ''
    }
    
    # Also replace common emoji combinations
    $content = $content -replace '🎯', '[TARGET]'  # Temporarily mark target
    $content = $content -replace '[ROCKET]', ''
    $content = $content -replace '[TROPHY]', ''
    $ content = $content -replace '[TARGET]', '🎯'  # Restore target
    
    if ($content.Length -ne $originalLength) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $totalReplacements++
        Write-Host "Cleaned: $($file.Name)"
    }
    
    $totalFiles++
}

Write-Host "`nTotal files processed: $totalFiles"
Write-Host "Files modified: $totalReplacements"
Write-Host "Emoji cleanup complete!"
