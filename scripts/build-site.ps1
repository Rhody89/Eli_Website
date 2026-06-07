$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Ensure-Dir {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
  }
}

function Load-Locale {
  param([string]$Path)
  $obj = Get-Content -Raw -Encoding utf8 $Path | ConvertFrom-Json
  $map = @{}
  foreach ($prop in $obj.PSObject.Properties) {
    $map[$prop.Name] = [string]$prop.Value
  }
  return $map
}

function Render-Template {
  param(
    [string]$TemplatePath,
    [hashtable]$Tokens
  )

  $result = Get-Content -Raw -Encoding utf8 $TemplatePath
  foreach ($key in $Tokens.Keys) {
    $placeholder = "{{" + $key + "}}"
    $result = $result.Replace($placeholder, [string]$Tokens[$key])
  }
  return $result
}

function Render-Subpage {
  param(
    [string]$TemplatePath,
    [hashtable]$Locale,
    [string]$PageTitle,
    [string]$BodyPath,
    [string]$OutputPath
  )

  $tokens = @{}
  foreach ($k in $Locale.Keys) {
    $tokens[$k] = $Locale[$k]
  }
  $tokens['pageTitle'] = $PageTitle
  $tokens['bodyHtml'] = (Get-Content -Raw -Encoding utf8 $BodyPath)

  $html = Render-Template -TemplatePath $TemplatePath -Tokens $tokens
  Ensure-Dir (Split-Path -Parent $OutputPath)
  Set-Content -Encoding utf8 $OutputPath $html
}

function Copy-HtmlDir {
  param(
    [string]$SourceDir,
    [string]$TargetDir
  )

  Ensure-Dir $TargetDir

  Get-ChildItem -Path $SourceDir -Recurse -File -Filter *.html | ForEach-Object {
    $relative = $_.FullName.Substring((Resolve-Path $SourceDir).Path.Length).TrimStart('\\')
    $dest = Join-Path $TargetDir $relative
    Ensure-Dir (Split-Path -Parent $dest)
    Copy-Item -Force $_.FullName $dest
  }
}

function Clean-HtmlInDir {
  param([string]$Dir)

  Ensure-Dir $Dir
  Get-ChildItem -Path $Dir -Recurse -File -Filter *.html | Remove-Item -Force
}

$clean = $args -contains '--clean'

if ($clean) {
  Clean-HtmlInDir (Join-Path $root 'deutsch')
  Clean-HtmlInDir (Join-Path $root 'english')
}

# Shared nav (template source)
$navTemplate = Join-Path $root 'src/templates/nav.template.html'

# Render home pages from single template + locale JSON
$indexTemplate = Join-Path $root 'src/templates/index.template.html'
$deLocalePath = Join-Path $root 'src/i18n/de.json'
$enLocalePath = Join-Path $root 'src/i18n/en.json'

if (Test-Path $navTemplate) {
  $navBase = Get-Content -Raw -Encoding utf8 $navTemplate

  # Backward-compatible shared nav with auto detection.
  Set-Content -Encoding utf8 (Join-Path $root 'nav.html') ($navBase.Replace('{{forceLanguage}}', ''))

  # Static language variants generated from the same template.
  Set-Content -Encoding utf8 (Join-Path $root 'nav.de.html') ($navBase.Replace('{{forceLanguage}}', 'de'))
  Set-Content -Encoding utf8 (Join-Path $root 'nav.en.html') ($navBase.Replace('{{forceLanguage}}', 'en'))
} else {
  Copy-Item -Force (Join-Path $root 'src/shared/nav.html') (Join-Path $root 'nav.html')
}

if ((Test-Path $indexTemplate) -and (Test-Path $deLocalePath) -and (Test-Path $enLocalePath)) {
  $deLocale = Load-Locale $deLocalePath
  $enLocale = Load-Locale $enLocalePath

  $deIndex = Render-Template -TemplatePath $indexTemplate -Tokens $deLocale
  Ensure-Dir (Join-Path $root 'deutsch')
  Set-Content -Encoding utf8 (Join-Path $root 'deutsch/index.html') $deIndex

  $router = @"
<!doctype html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eleonora Rachor Academy</title>
  <meta http-equiv="refresh" content="0;url=deutsch/index.html">
  <script>
    (function () {
      var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      var target = lang.startsWith('en') ? 'english/index_en.html' : 'deutsch/index.html';
      window.location.replace(target);
    })();
  </script>
</head>
<body>
  <noscript>
    <p><a href="deutsch/index.html">Deutsch</a> | <a href="english/index_en.html">English</a></p>
  </noscript>
</body>
</html>
"@
  Set-Content -Encoding utf8 (Join-Path $root 'index.html') $router

  Ensure-Dir (Join-Path $root 'english')
  $enIndex = Render-Template -TemplatePath $indexTemplate -Tokens $enLocale
  Set-Content -Encoding utf8 (Join-Path $root 'english/index_en.html') $enIndex
} else {
  # Fallback to old copy behavior if template/i18n files are missing
  Copy-Item -Force (Join-Path $root 'src/de/index.html') (Join-Path $root 'index.html')
}

# German
Copy-HtmlDir -SourceDir (Join-Path $root 'src/de/pages') -TargetDir (Join-Path $root 'deutsch')

# English
Copy-HtmlDir -SourceDir (Join-Path $root 'src/en/pages') -TargetDir (Join-Path $root 'english')

# Shared-template subpages (Phase 2)
$subTemplate = Join-Path $root 'src/templates/subpage.template.html'
if ((Test-Path $subTemplate) -and (Test-Path $deLocalePath) -and (Test-Path $enLocalePath)) {
  $deSubMap = @(
    @{ slug = 'services'; title = $deLocale['titleServices']; out = 'deutsch/angebote.html' },
    @{ slug = 'events'; title = $deLocale['titleEvents']; out = 'deutsch/event.html' },
    @{ slug = 'company'; title = $deLocale['titleCompany']; out = 'deutsch/firmen.html' },
    @{ slug = 'about'; title = $deLocale['titleAbout']; out = 'deutsch/ueber_mich.html' },
    @{ slug = 'legal'; title = $deLocale['titleLegal']; out = 'deutsch/impressum_datenschutz.html' }
  )

  foreach ($p in $deSubMap) {
    $body = Join-Path $root ("src/content/de/" + $p.slug + ".html")
    if (Test-Path $body) {
      Render-Subpage -TemplatePath $subTemplate -Locale $deLocale -PageTitle $p.title -BodyPath $body -OutputPath (Join-Path $root $p.out)
    }
  }

  $enSubMap = @(
    @{ slug = 'services'; title = $enLocale['titleServices']; out = 'english/angebote_en.html' },
    @{ slug = 'events'; title = $enLocale['titleEvents']; out = 'english/event_en.html' },
    @{ slug = 'company'; title = $enLocale['titleCompany']; out = 'english/firmen_en.html' },
    @{ slug = 'about'; title = $enLocale['titleAbout']; out = 'english/ueber_mich_en.html' },
    @{ slug = 'legal'; title = $enLocale['titleLegal']; out = 'english/impressum_datenschutz_en.html' }
  )

  foreach ($p in $enSubMap) {
    $body = Join-Path $root ("src/content/en/" + $p.slug + ".html")
    if (Test-Path $body) {
      Render-Subpage -TemplatePath $subTemplate -Locale $enLocale -PageTitle $p.title -BodyPath $body -OutputPath (Join-Path $root $p.out)
    }
  }
}

Write-Output 'Build complete: src content published to runtime folders.'
