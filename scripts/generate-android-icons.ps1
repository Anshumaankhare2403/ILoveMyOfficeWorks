Add-Type -AssemblyName System.Drawing

$srcPath = "D:\ILoveMyOfficeWorks\desktop\assets\icon.png"
if (!(Test-Path $srcPath)) {
    Write-Error "Source icon not found at $srcPath"
    exit 1
}

$src = [System.Drawing.Image]::FromFile($srcPath)

$sizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($entry in $sizes.GetEnumerator()) {
    $dirName = $entry.Key
    $dim = $entry.Value
    $destDir = "D:\ILoveMyOfficeWorks\mobile\android\app\src\main\res\$dirName"
    if (!(Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    $destFile = Join-Path $destDir "ic_launcher.png"

    $bmp = New-Object System.Drawing.Bitmap $dim, $dim
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $dim, $dim)
    $g.Dispose()

    # Save strictly in true PNG format with 89 50 4E 47 magic bytes
    if (Test-Path $destFile) { Remove-Item -Force $destFile }
    $bmp.Save($destFile, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated true PNG icon for $dirName (${dim}x${dim}): $destFile"
}

$src.Dispose()
Write-Host "All Android mipmap icons generated successfully in true PNG format!"
