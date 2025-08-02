document.getElementById("menu-btn").addEventListener("click", () => {
  const menu = document.getElementById("menu");
  const btn = document.getElementById("menu-btn");
  const icon = document.getElementById("menu-icon");
  
  // Toggle menu visibility
  menu.classList.toggle("hidden");
  
  // Toggle aria-expanded for accessibility
  const isExpanded = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", !isExpanded);
  
  // Change icon between hamburger and X
  if (menu.classList.contains("hidden")) {
    icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
  } else {
    icon.setAttribute("d", "M6 18L18 6M6 6l12 12");
  }
});

// Close menu when clicking outside or on a link
document.addEventListener("click", (e) => {
  const menu = document.getElementById("menu");
  const btn = document.getElementById("menu-btn");
  
  if (!menu.classList.contains("hidden") && 
      e.target !== btn && 
      !btn.contains(e.target) && 
      e.target !== menu && 
      !menu.contains(e.target)) {
    menu.classList.add("hidden");
    btn.setAttribute("aria-expanded", "false");
    document.getElementById("menu-icon").setAttribute("d", "M4 6h16M4 12h16M4 18h16");
  }
});