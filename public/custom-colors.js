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
              card.style.backgroundColor = "#F7D77F";
              card.style.borderColor = "#F7D77F";
              break;
            case 1: // Behavioral Interview (Blue)
              card.style.backgroundColor = "#8FC8E8";
              card.style.borderColor = "#8FC8E8";
              break;
            case 2: // Problem Solving (Green)
              card.style.backgroundColor = "#B2E887";
              card.style.borderColor = "#B2E887";
              break;
            case 3: // System Design (Orange)
              card.style.backgroundColor = "#E8BA98";
              card.style.borderColor = "#E8BA98";
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
          .bg-\\[\\#FFE082\\], .bg-\\[\\#F7D77F\\] { background-color: #F7D77F !important; }
          .border-yellow-200 { border-color: #F7D77F !important; }

          .bg-\\[\\#B3E5FC\\], .bg-\\[\\#8FC8E8\\] { background-color: #8FC8E8 !important; }
          .border-blue-200 { border-color: #8FC8E8 !important; }

          .bg-\\[\\#C8E6C9\\], .bg-\\[\\#B2E887\\] { background-color: #B2E887 !important; }
          .border-green-200 { border-color: #B2E887 !important; }

          .bg-\\[\\#FFCCBC\\], .bg-\\[\\#E8BA98\\] { background-color: #E8BA98 !important; }
          .border-orange-200, .border-red-200 { border-color: #E8BA98 !important; }
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
