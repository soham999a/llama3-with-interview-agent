# PowerShell script to download a professional female image for the interviewer avatar
$imageUrl = "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg"
$outputPath = "public/sanya-new.jpg"

# Create a WebClient object
$webClient = New-Object System.Net.WebClient

# Download the file
try {
    $webClient.DownloadFile($imageUrl, $outputPath)
    Write-Host "Image downloaded successfully to $outputPath"
} catch {
    Write-Host "Error downloading image: $_"
}
