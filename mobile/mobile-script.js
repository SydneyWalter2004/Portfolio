// Mobile-specific logic
console.log('Mobile script loaded');

// Example: Simple interactions for mobile
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        alert(`You clicked: ${e.target.textContent}`);
    });
});