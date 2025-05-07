# PowerShell script to download an image from a URL
$imageUrl = "https://i.imgur.com/Ql4jOkl.jpg"
$outputPath = "public/interviewer-avatar.png"

# Create a WebClient object
$webClient = New-Object System.Net.WebClient

# Download the file
try {
    $webClient.DownloadFile($imageUrl, $outputPath)
    Write-Host "Image downloaded successfully to $outputPath"
} catch {
    Write-Host "Error downloading image: $_"
}
