# TypeScript to JavaScript conversion script

$rootPath = 'c:\Users\Admin\Desktop\zootopia-focus'
Set-Location $rootPath

# Get all .ts and .tsx files (exclude vite-env.d.ts and node_modules)
$files = Get-ChildItem -Recurse -File -Include *.tsx,*.ts | Where-Object { 
    $_.FullName -notmatch '\\node_modules' -and 
    $_.Name -ne 'vite-env.d.ts' -and
    $_.Name -ne 'tailwind.config.ts' -and
    $_.Name -ne 'vite.config.ts' -and
    $_.Name -ne 'tsconfig.json' -and
    $_.Name -ne 'tsconfig.app.json' -and
    $_.Name -ne 'tsconfig.node.json' -and
    $_.Name -ne 'game.js' # Already converted
}

Write-Host "Found $($files.Count) files to convert"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove TypeScript type annotations
    # Remove type imports
    $content = $content -replace 'import type \{[^\}]+\} from [^;]+;', ''
    $content = $content -replace ', type (\w+)', ', $1'
    $content = $content -replace 'import \{ type ([^\}]+)\}', 'import { $1 }'
    
    # Remove type annotations from function parameters
    $content = $content -replace '(\w+):\s*\w+(\[\])?\s*\)', '$1)'
    $content = $content -replace '(\w+):\s*[\w\[\]<>|]+\s*,', '$1,'
    $content = $content -replace '(\w+):\s*[\w\[\]<>|]+\s*\)', '$1)'
    
    # Remove return type annotations
    $content = $content -replace '\):\s*[\w\[\]<>|]+\s*=>', ') =>'
    $content = $content -replace '\):\s*[\w\[\]<>|]+\s*\{', ') {'
    
    # Remove const type annotations
    $content = $content -replace 'const (\w+):\s*[\w\[\]<>|]+\s*=', 'const $1 ='
    $content = $content -replace 'let (\w+):\s*[\w\[\]<>|]+\s*=', 'let $1 ='
    
    # Remove useState<Type>
    $content = $content -replace 'useState<[^>]+>', 'useState'
    
    # Remove useCallback types
    $content = $content -replace 'useCallback<[^>]+>', 'useCallback'
    
    # Remove React.FC and similar
    $content = $content -replace ':\s*React\.FC<[^>]+>', ''
    $content = $content -replace ':\s*FC<[^>]+>', ''
    
    # Remove interface/type imports from game types
    $content = $content -replace "import \{\s*(PlayerStats|TimerState|GameMode|BiomeType|ZPDStage|CharacterType|RankType|FurnitureItem)[,\s]*", "import { "
    $content = $content -replace ",\s*(PlayerStats|TimerState|GameMode|BiomeType|ZPDStage|CharacterType|RankType|FurnitureItem)\s*\}", " }"
    $content = $content -replace "\{\s*(PlayerStats|TimerState|GameMode|BiomeType|ZPDStage|CharacterType|RankType|FurnitureItem)\s*\}", ""
    $content = $content -replace "import \{\s*\} from '@/types/game';", ""
    $content = $content -replace "import \{ \} from '@/types/game';", ""
    
    # Update import paths .tsx -> .jsx, .ts -> .js
    $content = $content -replace '\.tsx"', '.jsx"'
    $content = $content -replace "\.tsx'", ".jsx'"
    $content = $content -replace '\.ts"', '.js"'
    $content = $content -replace "\.ts'", ".js'"
    
    # Remove non-null assertions
    $content = $content -replace '!\.', '.'
    $content = $content -replace '!\)', ')'
    $content = $content -replace '!;', ';'
    
    # Remove interface declarations
    $content = $content -replace '(?ms)^interface \w+.*?\{.*?\}\s*$', ''
    $content = $content -replace '(?ms)^export interface \w+.*?\{.*?\}\s*$', ''
    
    # Remove type declarations  
    $content = $content -replace '(?ms)^type \w+.*?;', ''
    $content = $content -replace '(?ms)^export type \w+.*?;', ''
    
    # Remove as const
    $content = $content -replace ' as const', ''
    
    # Remove Record<K, V> types
    $content = $content -replace ':\s*Record<[^>]+>', ''
    
    # Clean up empty imports
    $content = $content -replace "import \{ \} from [^;]+;", ""
    $content = $content -replace "import \{\s*\} from [^;]+;", ""
    
    # Determine new file extension
    $newExtension = if ($file.Extension -eq '.tsx') { '.jsx' } else { '.js' }
    $newFileName = [System.IO.Path]::ChangeExtension($file.Name, $newExtension)
    $newFilePath = Join-Path $file.DirectoryName $newFileName
    
    # Write the converted content
    Set-Content $newFilePath $content -NoNewline
    
    Write-Host "Converted: $($file.Name) -> $newFileName"
}

Write-Host "`nConversion complete!"
