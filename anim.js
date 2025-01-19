/****************************
 * JavaScript Bubble Cursor *
 * (c)2010-13 mf2fm web-design
 ****************************/

// Global variables for bubbles
const colours = ["#1d2250", "#bb1fb2", "#bb1fb2", "#bb1fb2", "#bb1fb2"]; // Colors for borders and bubble backgrounds
const bubbles = 66; // Max bubbles on screen
const over_or_under = "over"; // Bubbles on top ("over") or behind other objects ("under")
let x = 400, y = 300, ox = 400, oy = 300;
let swide = 800, shigh = 600, sleft = 0, sdown = 0;
const bubb = [], bubbx = [], bubby = [], bubbs = [];

// Initialize the bubble effect
function addLoadEvent(callback) {
  const oldonload = window.onload;
  window.onload = typeof oldonload !== 'function' ? callback : () => {
    oldonload && oldonload();
    callback();
  };
}

addLoadEvent(initBubbleCursor);

function initBubbleCursor() {
  if (!document.getElementById) return;

  for (let i = 0; i < bubbles; i++) {
    const bubble = createBubble();
    document.body.appendChild(bubble);
    bubb[i] = bubble.style;
  }

  setDimensions();
  startBubbles();
}

function createBubble() {
  const bubble = createDiv("3px", "3px");
  bubble.style.visibility = "hidden";
  bubble.style.zIndex = over_or_under === "over" ? "1001" : "0";

  const div1 = createDiv("auto", "auto");
  div1.style.cssText = `
    top: 1px;
    left: 0px;
    bottom: 1px;
    right: 0px;
    border-left: 1px solid ${colours[3]};
    border-right: 1px solid ${colours[1]};
  `;
  bubble.appendChild(div1);

  const div2 = createDiv("auto", "auto");
  div2.style.cssText = `
    top: 0px;
    left: 1px;
    right: 1px;
    bottom: 0px;
    border-top: 1px solid ${colours[0]};
    border-bottom: 1px solid ${colours[2]};
  `;
  bubble.appendChild(div2);

  const div3 = createDiv("auto", "auto");
  div3.style.cssText = `
    left: 1px;
    right: 1px;
    bottom: 1px;
    top: 1px;
    background-color: ${colours[4]};
    opacity: 0.5;
  `;
  bubble.appendChild(div3);

  return bubble;
}

function startBubbles() {
  if (Math.abs(x - ox) > 1 || Math.abs(y - oy) > 1) {
    ox = x;
    oy = y;

    for (let c = 0; c < bubbles; c++) {
      if (!bubby[c]) {
        bubb[c].left = `${(bubbx[c] = x)}px`;
        bubb[c].top = `${(bubby[c] = y - 3)}px`;
        bubb[c].visibility = "visible";
        bubbs[c] = 3;
        break;
      }
    }
  }

  for (let c = 0; c < bubbles; c++) {
    if (bubby[c]) updateBubble(c);
  }

  setTimeout(startBubbles, 40);
}

function updateBubble(i) {
  if (bubby[i]) {
    bubby[i] -= bubbs[i] / 2 + i % 2;
    bubbx[i] += (i % 5 - 2) / 5;

    if (
      bubby[i] > sdown &&
      bubbx[i] > sleft &&
      bubbx[i] < sleft + swide + bubbs[i]
    ) {
      if (Math.random() < (bubbs[i] / shigh) * 2 && bubbs[i]++ < 8) {
        bubb[i].width = `${bubbs[i]}px`;
        bubb[i].height = `${bubbs[i]}px`;
      }
      bubb[i].top = `${bubby[i]}px`;
      bubb[i].left = `${bubbx[i]}px`;
    } else {
      bubb[i].visibility = "hidden";
      bubby[i] = 0;
    }
  }
}

function createDiv(height, width) {
  const div = document.createElement("div");
  div.style.position = "absolute";
  div.style.height = height;
  div.style.width = width;
  div.style.overflow = "hidden";
  return div;
}

function setDimensions() {
  swide = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  shigh = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

// Event handlers
document.onmousemove = (e) => {
  x = e.pageX || e.clientX + sleft;
  y = e.pageY || e.clientY + sdown;
};

document.onmousedown = () => (ox = oy = -1);
document.onmouseup = () => clearTimeout(sploosh);

window.onscroll = () => {
  sleft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
  sdown = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
};

window.onresize = setDimensions;

/******************************
 * Smooth Scrolling Navigation *
 ******************************/
document.querySelectorAll("a.nav-link").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").slice(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      const navbarHeight = document.querySelector(".navbar").offsetHeight;
      const extraOffset = 20; // Space above section
      const targetPosition = targetSection.offsetTop - navbarHeight - extraOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

/******************************
 * About Section Animations *
 ******************************/


// Function to reset and replay animations
function replayAnimations() {
	const aboutImage = document.querySelector('.about-image');
	const aboutText = document.querySelector('.about-text');
  
	// Remove animation classes
	aboutImage.classList.remove('animated');
	aboutText.classList.remove('animated');
  
	// Force reflow to reset animations
	void aboutImage.offsetWidth;
	void aboutText.offsetWidth;
  
	// Re-add animation classes
	aboutImage.classList.add('animated');
	aboutText.classList.add('animated');
  }
  
   // Intersection Observer to replay animations when scrolling
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
	  const aboutImage = document.querySelector('.about-image');
	  const aboutText = document.querySelector('.about-text');
  
	  if (entry.isIntersecting) {
		// Add animation classes when the section is visible
		aboutImage.classList.add('animated');
		aboutText.classList.add('animated');
	  } else {
		// Remove animation classes when the section goes out of view
		aboutImage.classList.remove('animated');
		aboutText.classList.remove('animated');
	  }
	});
  }, { threshold: 0.5 }); // Trigger when 50% of the section is visible
  
  // Observe the "About" section
  const aboutSection = document.querySelector('#about');
  if (aboutSection) {
	observer.observe(aboutSection);
  }
  
  
  // Handle navigation clicks
  document.querySelectorAll('a.nav-link').forEach((anchor) => {
	anchor.addEventListener('click', function (e) {
	  e.preventDefault();
	  const targetId = this.getAttribute('href').slice(1);
	  const targetSection = document.getElementById(targetId);
  
	  if (targetSection) {
		const navbarHeight = document.querySelector('.navbar').offsetHeight;
		const extraOffset = 20; // Space above the section
		const targetPosition = targetSection.offsetTop - navbarHeight - extraOffset;
  
		// Smooth scroll to the section
		window.scrollTo({
		  top: targetPosition,
		  behavior: 'smooth',
		});
  
		// Replay animations if it's the "About" section
		if (targetId === 'about') {
		  setTimeout(replayAnimations, 500); // Delay to allow scrolling to complete
		}
	  }
	});
  });
  
 