const snackbar = document.getElementById("snackbar");
const textTitle = document.getElementById('h-title');
const leftMenu = document.getElementById('leftMenu');
const menuButtons = document.querySelectorAll('.left-menu-container button');
const body = document.body;
const darkModeToggle = document.getElementById('darkModeToggle');
const sunIcon = darkModeToggle ? darkModeToggle.querySelector('.sun-icon') : null;
const moonIcon = darkModeToggle ? darkModeToggle.querySelector('.moon-icon') : null;
const fbstateTextarea = document.getElementById('yourFbstate');

let isDarkMode = true; 

function showSnackbar(message) {
  if (snackbar) {
    snackbar.textContent = message;
    snackbar.classList.add("show");
    setTimeout(function() {
      snackbar.classList.remove("show");
    }, 3000);
  }
}

function enableDarkMode() {
  body.classList.add('dark-mode');
  isDarkMode = true;
  if (sunIcon && moonIcon) {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
}

function disableDarkMode() {
  body.classList.remove('dark-mode');
  isDarkMode = false;
  if (sunIcon && moonIcon) {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
  enableDarkMode();
} else {
  disableDarkMode();
}

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', () => {
    if (isDarkMode) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
    localStorage.setItem('darkMode', isDarkMode);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (leftMenu) {
    leftMenu.classList.remove('open');
    leftMenu.style.transform = 'translateX(-100%)';
  }

  if (textTitle && leftMenu) {
    textTitle.addEventListener('click', () => {
      leftMenu.classList.toggle('open');
      if (leftMenu.classList.contains('open')) {
        leftMenu.style.transform = 'translateX(0)';
      } else {
        leftMenu.style.transform = 'translateX(-100%)';
      }
    });

    document.addEventListener('click', (event) => {
      if (!textTitle.contains(event.target) && !leftMenu.contains(event.target) && leftMenu.classList.contains('open')) {
        leftMenu.classList.remove('open');
        leftMenu.style.transform = 'translateX(-100%)';
      }
    });
  }
});


menuButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600); 
  });
});


const overlayButtons = document.querySelectorAll('.textarea-actions-overlay button');
overlayButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 600); 
  });
});
