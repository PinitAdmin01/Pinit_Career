# scripts/utils/restore_pristine_avatars.ps1
# Restores 100% uncompressed, full-fidelity original VRoid models from raw_avatars_source

$sourceDir = "C:\Users\Admin\Desktop\projects\Present-Career-os\raw_avatars_source"
$targetDir = "C:\Users\Admin\Desktop\projects\Present-Career-os\public\avatar"
$hdDir = Join-Path $targetDir "hd"

if (!(Test-Path $hdDir)) {
    New-Item -ItemType Directory -Path $hdDir -Force | Out-Null
}

$AvatarMap = [ordered]@{
    "priya"   = "Ms. Priya.vrm"
    "anish"   = "Mr.Anish.vrm"
    "kashyap" = "Kashyap sir.vrm"
    "karthic" = "Karthi sir.vrm"
    "maya"    = "Ms.Maya.vrm"
    "divya"   = "Ms.Divya.vrm"
    "aisha"   = "Ms.Aisha.vrm"
    "sneha"   = "Ms.Sneha.vrm"
    "rohan"   = "Mr.Rohan.vrm"
    "vikram"  = "Mr. Vikram.vrm"
    "shalini" = "Ms. Shalini.vrm"
    "aditya"  = "Mr.Aditya.vrm"
    "neha"    = "Ms.Neha.vrm"
    "rajesh"  = "Mr.Rajesh.vrm"
    "abhijit" = "Mr. Abhijit.vrm"
}

Write-Host "Deploying 100% pristine uncompressed models to public/avatar and public/avatar/hd..." -ForegroundColor Cyan

foreach ($key in $AvatarMap.Keys) {
    $vrmName = $AvatarMap[$key]
    $sourcePath = Join-Path $sourceDir $vrmName
    if (Test-Path $sourcePath) {
        $destLite = Join-Path $targetDir "$key.glb"
        $destHD = Join-Path $hdDir "$key.glb"
        
        Copy-Item -Path $sourcePath -Destination $destLite -Force
        Copy-Item -Path $sourcePath -Destination $destHD -Force
        
        $mb = ((Get-Item $destLite).Length / 1MB).ToString("0.00")
        Write-Host " [RESTORED] $key.glb ($mb MB - Full Quality Uncompressed)" -ForegroundColor Green
        
        if ($key -eq "priya") {
            Copy-Item -Path $sourcePath -Destination (Join-Path $targetDir "mentor.glb") -Force
            Copy-Item -Path $sourcePath -Destination (Join-Path $hdDir "mentor.glb") -Force
            Write-Host "   -> Synced mentor.glb (Full Quality)" -ForegroundColor DarkGreen
        }
    } else {
        Write-Host " [WARNING] Could not find $sourcePath" -ForegroundColor Red
    }
}

Write-Host "All pristine avatars deployed with 100% original texture and mesh fidelity!" -ForegroundColor Cyan
