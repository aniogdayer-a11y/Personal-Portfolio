param([Parameter(Mandatory = $true)][string]$SourceRoot)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$originalRoot = Join-Path $projectRoot 'public\assets\projects\originals'
$previewRoot = Join-Path $projectRoot 'public\assets\projects\previews'
New-Item -ItemType Directory -Path $originalRoot, $previewRoot -Force | Out-Null
$items = @(
    @{ Name = 'aws-sbg-jru'; File = 'UI & UX\AWS SBG JRU.png' },
    @{ Name = 'edufocus'; File = 'UI & UX\EduFocus.png' },
    @{ Name = 'cloud-grand-prix-announcement'; File = 'Pubmats\Even Pubmat\Event Pubmat Proper (4).png' },
    @{ Name = 'cloud-grand-prix-registration'; File = 'Pubmats\Even Pubmat\Event Pubmat Proper (Registration Reminder) (1).png' },
    @{ Name = 'cloud-grand-prix-reloaded-01'; File = 'Pubmats\Even Pubmat\Event Pubmat Proper (Reloaded) (1).png' },
    @{ Name = 'cloud-grand-prix-reloaded-02'; File = 'Pubmats\Even Pubmat\Event Pubmat Proper (Reloaded) (2).png' },
    @{ Name = 'zodiac-cancer-s3'; File = 'Pubmats\Zodiac Says\733756905_122203674248579104_3015836937056937364_n.jpg' },
    @{ Name = 'zodiac-sagittarius-amplify'; File = 'Pubmats\Zodiac Says\733771275_122203674464579104_2883458471717878914_n.jpg' },
    @{ Name = 'zodiac-gemini-eventbridge'; File = 'Pubmats\Zodiac Says\735687491_122203674206579104_3330347011414265523_n.jpg' },
    @{ Name = 'bsit-student-frames'; File = 'Pubmats\FRAMES FOR BSIT-BA & BSIT (pa-cutout ako).png' },
    @{ Name = 'aws-sbg-flag'; File = 'Pubmats\RSO FLAG (2).png' },
    @{ Name = 'tech-countdown'; File = 'Pubmats\Countdown Pubmat2 - Day 6.png' }
)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$manifest = foreach ($item in $items) {
    $source = Join-Path $SourceRoot $item.File
    $extension = [System.IO.Path]::GetExtension($source).ToLowerInvariant()
    $original = Join-Path $originalRoot ($item.Name + $extension)
    $preview = Join-Path $previewRoot ($item.Name + '.jpg')
    Copy-Item -LiteralPath $source -Destination $original
    $sourceHash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
    if ($sourceHash -ne (Get-FileHash -LiteralPath $original -Algorithm SHA256).Hash) { throw "Original copy differs: $($item.Name)" }
    $image = [System.Drawing.Image]::FromFile($source)
    try {
        $ratio = [Math]::Min(1.0, 1600.0 / [Math]::Max($image.Width, $image.Height))
        $width = [int][Math]::Round($image.Width * $ratio)
        $height = [int][Math]::Round($image.Height * $ratio)
        $bitmap = [System.Drawing.Bitmap]::new($width, $height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
        try {
            $graphics.Clear([System.Drawing.Color]::FromArgb(17, 17, 17))
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.DrawImage($image, 0, 0, $width, $height)
            $parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]92)
            $bitmap.Save($preview, $jpegCodec, $parameters)
        } finally { $parameters.Dispose(); $graphics.Dispose(); $bitmap.Dispose() }
        [pscustomobject]@{
            source = $item.File; original = '/assets/projects/originals/' + $item.Name + $extension
            preview = '/assets/projects/previews/' + $item.Name + '.jpg'
            width = $image.Width; height = $image.Height; sha256 = $sourceHash
            originalBytes = (Get-Item -LiteralPath $original).Length
            previewBytes = (Get-Item -LiteralPath $preview).Length
        }
    } finally { $image.Dispose() }
}
[System.IO.File]::WriteAllText((Join-Path $projectRoot 'docs\project-assets.json'), ($manifest | ConvertTo-Json -Depth 3))
$originalBytes = ($manifest | Measure-Object originalBytes -Sum).Sum
$previewBytes = ($manifest | Measure-Object previewBytes -Sum).Sum
Write-Output "Imported $($manifest.Count) verified originals. Preview total: $previewBytes bytes; originals: $originalBytes bytes."
