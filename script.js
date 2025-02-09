// Simulate loading delay (replace with actual loading logic)
setTimeout(() => {
    // Hide loading screen
    document.getElementById('loading-screen').style.display = 'none';

    // Show button screen
    document.getElementById('button-screen').classList.remove('hidden');
}, 3000); // 3-second loading delay

// Device detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Button event listeners
document.getElementById('mobile-button').addEventListener('click', () => {
    if (isMobileDevice()) {
        window.location.href = 'mobile/mobile-portfolio.html'; // Redirect to mobile portfolio
    } else {
        alert('You are not on a mobile device. Please use the desktop version.');
    }
});

document.getElementById('desktop-button').addEventListener('click', () => {
    if (!isMobileDevice()) {
        window.location.href = 'desktop/desktop-portfolio.html'; // Redirect to desktop portfolio
    } else {
        alert('You are on a mobile device. Please use the mobile version.');
    }
});