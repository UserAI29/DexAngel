<#
  Generates assets/og-image.png (1200x630) — DEXANGEL placeholder social card.
  Pure GDI+, no dependencies. Re-run after editing, or replace the PNG with
  real key art of the same dimensions.

  Usage:  powershell -NoProfile -ExecutionPolicy Bypass -File .\make-og-image.ps1
#>
param(
  [string]$Out = ""
)

Add-Type -AssemblyName System.Drawing

if (-not $Out) { $Out = Join-Path $PSScriptRoot "..\assets\og-image.png" }

$w = 1200
$h = 630
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([System.Drawing.Color]::FromArgb(255, 10, 7, 8))

# --- vertical background gradient -------------------------------------------
$p1 = New-Object System.Drawing.Point(0, 0)
$p2 = New-Object System.Drawing.Point(0, $h)
$c1 = [System.Drawing.Color]::FromArgb(255, 27, 19, 21)
$c2 = [System.Drawing.Color]::FromArgb(255, 6, 4, 5)
$grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($p1, $p2, $c1, $c2)
$g.FillRectangle($grad, 0, 0, $w, $h)

# --- sickly amber lamp glow --------------------------------------------------
$glow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(44, 255, 183, 3))
$g.FillEllipse($glow, 290, -280, 620, 520)

# --- claw slashes, top right -------------------------------------------------
$redPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(235, 193, 18, 31), 14)
$redPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$redPen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($redPen, 952, 58, 892, 328)
$g.DrawLine($redPen, 1012, 52, 948, 340)
$g.DrawLine($redPen, 1070, 68, 1008, 330)

$redBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(235, 193, 18, 31))
$g.FillEllipse($redBrush, 881, 328, 22, 30)
$g.FillEllipse($redBrush, 937, 340, 18, 26)
$g.FillEllipse($redBrush, 997, 330, 20, 28)

# --- eyebrow -----------------------------------------------------------------
$dim = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 163, 157, 148))
$eyebrowFont = New-Object System.Drawing.Font('Segoe UI', 21, [System.Drawing.FontStyle]::Regular)
$g.DrawString('REVERSE HORROR  /  FIRST PERSON  /  PC', $eyebrowFont, $dim, 72, 76)

# --- title (falls back to a default font if Impact is missing) ---------------
$bone = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 232, 226, 217))
$titleFont = New-Object System.Drawing.Font('Impact', 168, [System.Drawing.FontStyle]::Regular)
$g.DrawString('DEXANGEL', $titleFont, $bone, 66, 128)

# --- arterial underline + drips ---------------------------------------------
$g.FillRectangle($redBrush, 72, 372, 636, 12)
$g.FillEllipse($redBrush, 224, 382, 18, 34)
$g.FillEllipse($redBrush, 432, 382, 14, 46)
$g.FillEllipse($redBrush, 612, 382, 16, 30)

# --- tagline -----------------------------------------------------------------
$tagFont = New-Object System.Drawing.Font('Segoe UI', 29, [System.Drawing.FontStyle]::Bold)
$g.DrawString('They came to find the truth.', $tagFont, $bone, 72, 424)
$redText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 230, 75, 85))
$g.DrawString('You make sure no one leaves with it.', $tagFont, $redText, 72, 468)

# --- placeholder note --------------------------------------------------------
$smallFont = New-Object System.Drawing.Font('Segoe UI', 15, [System.Drawing.FontStyle]::Regular)
$smallDim = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 130, 124, 116))
$g.DrawString('PLACEHOLDER KEY ART - REPLACE WITH REAL 1200x630 ART', $smallFont, $smallDim, 72, 570)

$g.Dispose()

$dir = Split-Path -Parent $Out
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "Wrote $Out ($w x $h)"
