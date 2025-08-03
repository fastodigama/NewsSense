// Add a click event listener to the menu button
document.getElementById("menu-btn").addEventListener("click", () => {
  const menu = document.getElementById("menu");       // The dropdown or mobile menu element
  const btn = document.getElementById("menu-btn");    // The button that toggles the menu
  const icon = document.getElementById("menu-icon");  // The SVG icon inside the button

  // Toggle the 'hidden' class to show or hide the menu
  menu.classList.toggle("hidden");

  // Update the aria-expanded attribute for accessibility
  const isExpanded = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", !isExpanded);

  // Change the icon path depending on menu visibility
  // Hamburger icon when menu is hidden
  // X (close) icon when menu is visible
  if (menu.classList.contains("hidden")) {
    icon.setAttribute("d", "M4 6h16M4 12h16M4 18h16"); // Hamburger icon
  } else {
    icon.setAttribute("d", "M6 18L18 6M6 6l12 12");     // X icon
  }
});

// Add a global click listener to close the menu when clicking outside of it
document.addEventListener("click", (e) => {
  const menu = document.getElementById("menu");       // The menu element
  const btn = document.getElementById("menu-btn");    // The toggle button

  // Check if the menu is open and the click occurred outside the menu and button
  if (!menu.classList.contains("hidden") && 
      e.target !== btn && 
      !btn.contains(e.target) && 
      e.target !== menu && 
      !menu.contains(e.target)) {
    
    // Hide the menu
    menu.classList.add("hidden");

    // Update aria-expanded to reflect collapsed state
    btn.setAttribute("aria-expanded", "false");

    // Reset the icon to hamburger
    document.getElementById("menu-icon").setAttribute("d", "M4 6h16M4 12h16M4 18h16");
  }
});
