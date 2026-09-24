# scripts/utils/sync_custom_avatars.ps1
# Automates importing and converting custom VRM/GLB avatars from Downloads into PinIT Career OS

param (
    [string]$SourceDir = "C:\Users\Admin\Downloads",
    [string]$TargetDir = "$PSScriptRoot\..\..\public\avatar",
    [string]$BackupDir = "$PSScriptRoot\..\..\public\avatar_old_backup"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   PinIT Career OS - Custom Avatar Synchronizer          " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ResolvedTarget = (Resolve-Path $TargetDir).Path
Write-Host "Source directory: $SourceDir" -ForegroundColor Yellow
Write-Host "Target directory: $ResolvedTarget" -ForegroundColor Yellow

# Create backup directory if not exists
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    Write-Host "Created backup folder: $BackupDir" -ForegroundColor DarkGray
}

$AvatarMap = [ordered]@{
    "priya"   = @("Ms. Priya", "Ms.Priya", "Priya", "priya")
    "anish"   = @("Mr.Anish", "Mr. Anish", "Anish", "anish")
    "kashyap" = @("Kashyap sir", "Kashyap Sir", "Kashyap", "kashyap")
    "karthic" = @("Karthi sir", "Karthi Sir", "Karthic Sir", "Karthic", "karthic")
    "maya"    = @("Ms.Maya", "Ms. Maya", "Maya", "maya")
    "divya"   = @("Ms.Divya", "Ms. Divya", "Divya", "divya")
    "aisha"   = @("Ms.Aisha", "Ms. Aisha", "Aisha", "aisha")
    "sneha"   = @("Ms.Sneha", "Ms. Sneha", "Sneha", "sneha")
    "rohan"   = @("Mr.Rohan", "Mr. Rohan", "Rohan", "rohan")
    "vikram"  = @("Mr. Vikram", "Mr.Vikram", "Vikram", "vikram")
    "shalini" = @("Ms. Shalini", "Ms.Shalini", "Shalini", "shalini")
    "aditya"  = @("Mr.Aditya", "Mr. Aditya", "Aditya", "aditya")
    "neha"    = @("Ms.Neha", "Ms. Neha", "Neha", "neha")
    "rajesh"  = @("Mr.Rajesh", "Mr. Rajesh", "Rajesh", "rajesh")
    "abhijit" = @("Mr. Abhijit", "Mr.Abhijit", "Abhijit", "abhijit")
}

$FoundVRMCount = 0

foreach ($key in $AvatarMap.Keys) {
    $aliases = $AvatarMap[$key]
    $foundModel = $null

    # Search for .vrm or .glb in SourceDir
    foreach ($alias in $aliases) {
        $candidateVRM = Join-Path $SourceDir "$alias.vrm"
        $candidateGLB = Join-Path $SourceDir "$alias.glb"
        if (Test-Path $candidateVRM) {
            $foundModel = $candidateVRM
            break
        }
        if (Test-Path $candidateGLB) {
            $foundModel = $candidateGLB
            break
        }
    }

    if ($foundModel) {
        $destFile = Join-Path $ResolvedTarget "$key.glb"
        
        # Backup existing model if present
        if (Test-Path $destFile) {
            Copy-Item -Path $destFile -Destination (Join-Path $BackupDir "$key.glb") -Force
        }
        
        # Deploy custom VRM model as .glb
        Copy-Item -Path $foundModel -Destination $destFile -Force
        $fileSizeMB = ((Get-Item $destFile).Length / 1MB).ToString("0.00")
        Write-Host " [SUCCESS] $key.glb deployed from '$foundModel' ($fileSizeMB MB)" -ForegroundColor Green
        
        if ($key -eq "priya") {
            # Also keep mentor.glb synced as the default fallback
            Copy-Item -Path $foundModel -Destination (Join-Path $ResolvedTarget "mentor.glb") -Force
            Write-Host "   -> Also synced to 'mentor.glb'" -ForegroundColor DarkGreen
        }
        $FoundVRMCount++
    } else {
        Write-Host " [NOT FOUND] $key.glb - No matching .vrm or .glb found in $SourceDir" -ForegroundColor Red
    }
}

Write-Host "----------------------------------------------------------"
$totalCount = $AvatarMap.Count
Write-Host "Sync Complete: $FoundVRMCount / $totalCount avatars successfully imported and deployed." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
