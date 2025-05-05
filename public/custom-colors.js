// This script will run in the browser to override the interview card colors
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the page to fully load
  setTimeout(function() {
    // Find all interview cards
    const cards = document.querySelectorAll('[class*="bg-[#"]');
    
    // Update the colors
    cards.forEach(card => {
      // Replace lighter colors with darker ones
      if (card.classList.contains('bg-[#FFE082]')) {
        card.classList.remove('bg-[#FFE082]');
        card.classList.add('bg-[#FFD54F]');
        
        // Also update the border
        card.classList.remove('border-yellow-200');
        card.classList.add('border-yellow-300');
      }
      
      if (card.classList.contains('bg-[#B3E5FC]')) {
        card.classList.remove('bg-[#B3E5FC]');
        card.classList.add('bg-[#81D4FA]');
        
        // Also update the border
        card.classList.remove('border-blue-200');
        card.classList.add('border-blue-300');
      }
      
      if (card.classList.contains('bg-[#C8E6C9]')) {
        card.classList.remove('bg-[#C8E6C9]');
        card.classList.add('bg-[#A5D6A7]');
        
        // Also update the border
        card.classList.remove('border-green-200');
        card.classList.add('border-green-300');
      }
      
      if (card.classList.contains('bg-[#FFCCBC]')) {
        card.classList.remove('bg-[#FFCCBC]');
        card.classList.add('bg-[#FFAB91]');
        
        // Also update the border
        card.classList.remove('border-orange-200');
        card.classList.add('border-orange-300');
      }
    });
    
    console.log('Custom colors applied!');
  }, 1000); // Wait 1 second for the page to render
});
