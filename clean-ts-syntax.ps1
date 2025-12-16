# Remove TypeScript-specific syntax from JSX/JS files

$rootPath = 'c:\Users\Admin\Desktop\zootopia-focus\src'
Set-Location $rootPath

# Process all JSX files
Get-ChildItem -Recurse -Include *.jsx,*.js -Exclude 'node_modules' | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $modified = $false
    
    # Remove type imports from '@/types/game'
    if ($content -match "import \{ CharacterType \} from '@/types/game';") {
        $content = $content -replace "import \{ CharacterType \} from '@/types/game';", ""
        $modified = $true
    }
    
    # Remove interface definitions
    $content = $content -creplace "(?ms)^interface \w+[^{]*\{[^}]*\}\s*", ""
    
    # Remove type annotations like: Record<X, Y>
    $content = $content -replace ": Record<\w+, \w+>", ""
    
    # Remove export interface
    $content = $content -creplace "(?ms)^export interface \w+[^{]*\{[^}]*\}\s*", ""
    
    # Remove type/interface imports
    $content = $content -replace "import type \{[^\}]+\} from [^;]+;\r?\n?", ""
    
    # Remove React.FC type annotations
    $content = $content -replace ": React\.FC<[^>]+>", ""
    
    # Remove ButtonProps extends from button
    $content = $content -replace "extends React\.ButtonHTMLAttributes<HTMLButtonElement>,\s*VariantProps<typeof buttonVariants>", "extends React.ButtonHTMLAttributes<HTMLButtonElement>"
    
    # Remove non-null assertions that remain
    $content = $content -replace "!\.render", ".render"
    $content = $content -replace "!;", ";"
    $content = $content -replace "!\)", ")"
    
    # Fix backtick issues from earlier
    $content = $content -replace '"`\./', "./"
    $content = $content -replace '"`@/', "@/"
    
    if ($modified -or $content -ne (Get-Content $_.FullName -Raw)) {
        Set-Content $_.FullName $content -NoNewline
        Write-Host "Cleaned: $($_.FullName.Replace($rootPath, ''))"
    }
}

Write-Host "`nTypeScript syntax removal complete!"
