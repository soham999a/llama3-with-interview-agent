# PowerShell script to download the Sanya image
$imageUrl = "https://img.freepik.com/free-photo/portrait-young-businesswoman-with-dark-hair_23-2148209165.jpg"
$outputPath = "public/sanya.jpg"

# Create a WebClient object
$webClient = New-Object System.Net.WebClient

# Download the file
try {
    $webClient.DownloadFile($imageUrl, $outputPath)
    Write-Host "Image downloaded successfully to $outputPath"
} catch {
    Write-Host "Error downloading image: $_"
}
