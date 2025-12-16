# More careful TypeScript to JavaScript conversion script

$rootPath = 'c:\Users\Admin\Desktop\zootopia-focus'
Set-Location $rootPath

function Convert-TypeScriptToJavaScript {
    param (
        [string]$filePath
    )
    
    $content = Get-Content $filePath -Raw
    
    # 1. Update import paths first
    $content = $content -replace "from ['""]([^'""]+)\.tsx['""]", "from '`$1.jsx'"
    $content = $content -replace "from ['""]([^'""]+)\.ts['""]", "from '`$1.js'"
    
    # 2. Remove 'import type' statements
    $content = $content -replace "import type \{[^\}]+\} from [^;]+;?\r?\n?", ""
    
    # 3. Remove 'type' from imports like: import { type Foo, Bar }
    $content = $content -replace ", type (\w+)", ", `$1"
    $content = $content -replace "\{ type (\w+)", "{ `$1"
    
    # 4. Remove type-only imports that reference game types
    $content = $content -creplace "(?m)^import\s*\{\s*(?:(?:CharacterType|BiomeType|GameMode|ZPDStage|RankType|PlayerStats|TimerState|FurnitureItem)[,\s]*)+\s*\}\s*from\s*['""]@/types/game['""]\s*;?\s*$", ""
    
    # 5. Clean imports to only keep RANK_ORDER and RANK_LABELS
    $content = $content -replace "import\s*\{\s*([^}]*?)(CharacterType|BiomeType|GameMode|ZPDStage|RankType|PlayerStats|TimerState|FurnitureItem)[,\s]*", "import { `$1"
    $content = $content -replace ",\s*(CharacterType|BiomeType|GameMode|ZPDStage|RankType|PlayerStats|TimerState|FurnitureItem)\s*([,}])", "`$2"
    $content = $content -replace "import\s*\{\s*\}\s*from\s*['""]@/types/game['""]\s*;?\s*", ""
    
    # 6. Remove interface definitions
    $content = $content -creplace "(?ms)^export interface \w+\s*(?:extends[^{]*)?\{[^}]*\}\s*$", ""
    $content = $content -creplace "(?ms)^interface \w+\s*(?:extends[^{]*)?\{[^}]*\}\s*$", ""
    
    # 7. Remove type definitions
    $content = $content -creplace "(?m)^export type \w+\s*=\s*[^;]+;\s*$", ""
    $content = $content -creplace "(?m)^type \w+\s*=\s*[^;]+;\s*$", ""
    
    # 8. Remove function parameter types (be careful with default values)
    $content = $content -replace "\((\w+):\s*[\w\[\]<>|']+(\s*=\s*[^,)]+)?([,)])", "(`$1`$2`$3"
    
    # 9. Remove return type annotations
    $content = $content -replace "\):\s*[\w\[\]<>|]+\s*(=>|{)", ")`$1"
    
    # 10. Remove generic types from hooks
    $content = $content -replace "(useState|useCallback|useRef|useMemo|useReducer)<[^>]+>", "`$1"
    
    # 11. Remove variable type annotations (const x: Type = ...)
    $content = $content -replace "(const|let|var)\s+(\w+):\s*[\w\[\]<>|']+\s*=", "`$1 `$2 ="
    
    # 12. Remove React.FC, FC type annotations
    $content = $content -replace ":\s*React\.FC<[^>]*>", ""
    $content = $content -replace ":\s*FC<[^>]*>", ""
    
    # 13. Remove Record<K, V> and similar complex types
    $content = $content -replace ":\s*Record<[^>]+>", ""
    
    # 14. Remove 'as const' assertions
    $content = $content -replace " as const", ""
    
    # 15. Remove non-null assertions
    $content = $content -replace "(\w+)!", "`$1"
    
    # 16. Remove VariantProps type
    $content = $content -replace ",\s*VariantProps<[^>]+>", ""
    
    # 17. Clean up multiple blank lines
    $content = $content -replace "(?m)^\s*$\r?\n\s*$", "`n"
    
    return $content
}

# Get all .ts and .tsx files
$files = Get-ChildItem -Recurse -File -Include *.tsx,*.ts | Where-Object { 
    $_.FullName -notmatch '\\node_modules' -and 
    $_.Name -ne 'vite-env.d.ts' -and
    $_.Name -ne 'tailwind.config.ts' -and
    $_.Name -ne 'vite.config.ts' -and
    $_.Name -ne 'tsconfig.json' -and
    $_.Name -ne 'tsconfig.app.json' -and
    $_.Name -ne 'tsconfig.node.json'
}

Write-Host "Found $($files.Count) files to convert"

foreach ($file in $files) {
    try {
        $convertedContent = Convert-TypeScriptToJavaScript -filePath $file.FullName
        
        # Determine new file extension
        $newExtension = if ($file.Extension -eq '.tsx') { '.jsx' } else { '.js' }
        $newFileName = [System.IO.Path]::ChangeExtension($file.Name, $newExtension)
        $newFilePath = Join-Path $file.DirectoryName $newFileName
        
        # Write the converted content
        $convertedContent | Set-Content $newFilePath -NoNewline
        
        Write-Host "✓ Converted: $($file.Name) -> $newFileName"
    }
    catch {
        Write-Host "✗ Failed: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nConversion complete! Total files converted: $($files.Count)"
