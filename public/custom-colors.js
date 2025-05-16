// This script will run in the browser to override the interview card colors
document.addEventListener("DOMContentLoaded", function () {
  // Function to apply color changes
  function applyColorChanges() {
    try {
      console.log("Attempting to apply custom colors...");

      // Try different selectors to find the interview cards
      const interviewCards = document.querySelectorAll(
        ".grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3 > a > div"
      );
      console.log("Found interview cards:", interviewCards.length);

      if (interviewCards.length > 0) {
        interviewCards.forEach((card, index) => {
          console.log("Processing card:", index);

          // Apply colors based on index
          switch (index % 4) {
            case 0: // Technical Interview (Yellow)
              card.style.backgroundColor = "#FFE082";
              card.style.borderColor = "#FFE082";
              break;
            case 1: // Behavioral Interview (Blue)
              card.style.backgroundColor = "#B3E5FC";
              card.style.borderColor = "#B3E5FC";
              break;
            case 2: // Problem Solving (Green)
              card.style.backgroundColor = "#C8E6C9";
              card.style.borderColor = "#C8E6C9";
              break;
            case 3: // System Design (Orange)
              card.style.backgroundColor = "#FFCCBC";
              card.style.borderColor = "#FFCCBC";
              break;
          }
        });

        console.log("Custom colors applied successfully!");
      } else {
        // Try an alternative approach with direct style injection
        console.log(
          "No cards found with primary selector, trying alternative approach..."
        );

        // Create a style element
        const styleEl = document.createElement("style");
        styleEl.textContent = `
          .bg-\\[\\#FFE082\\] { background-color: #FFD54F !important; }
          .border-yellow-200 { border-color: #FFD54F !important; }

          .bg-\\[\\#B3E5FC\\] { background-color: #81D4FA !important; }
          .border-blue-200 { border-color: #81D4FA !important; }

          .bg-\\[\\#C8E6C9\\] { background-color: #A5D6A7 !important; }
          .border-green-200 { border-color: #A5D6A7 !important; }

          .bg-\\[\\#FFCCBC\\] { background-color: #FFAB91 !important; }
          .border-orange-200 { border-color: #FFAB91 !important; }
        `;

        document.head.appendChild(styleEl);
        console.log("Applied alternative color styling via CSS");
      }
    } catch (error) {
      console.error("Error applying custom colors:", error);
    }
  }

  // Try immediately
  applyColorChanges();

  // Also try after a delay to ensure the page is fully loaded
  setTimeout(applyColorChanges, 1000);

  // And try once more after a longer delay
  setTimeout(applyColorChanges, 3000);
});
