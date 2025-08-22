let vsatData = {};
let hocbaData = {};
let tohopData = {};

async function loadData() {
   const vsatRes = await fetch("../../public/data/vsat-data.json");
   vsatData = await vsatRes.json();

   const hocbaRes = await fetch("../../public/data/hocba-data.json");
   hocbaData = await hocbaRes.json();

   const tohopRes = await fetch("../../public/data/tohop-data.json");
   tohopData = await tohopRes.json();

   console.log("Dữ liệu VSAT:", vsatData);
   console.log("Dữ liệu HOCBA:", hocbaData);
   console.log("Dữ liệu TOHOP:", tohopData);
   return true;
}

async function test() {
   console.log("TEST TEST TEST");
}
test();

loadData().then(() => {
   console.log("TEST ", hocbaData.Toan[12].note);
});

// Load component HTML
async function loadComponent(id, file) {
   const res = await fetch(file);
   const html = await res.text();
   document.getElementById(id).innerHTML = html;
   if (id === "header") {
      const themeToggle = document.getElementById("theme-toggle");
      if (themeToggle) {
         themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            if (document.body.classList.contains("dark-theme")) {
               themeToggle.innerHTML = "<i class='fas fa-sun'></i>";
            } else {
               themeToggle.innerHTML = "<i class='fas fa-moon'></i>";
            }
         });
      }

      // Responsive nav toggle
      const navToggle = document.getElementById("nav-toggle");
      const navMenu = document.getElementById("nav-menu");
      if (navToggle && navMenu) {
         navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
         });
         navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
               if (window.innerWidth <= 768) {
                  navMenu.classList.remove("open");
               }
            });
         });
      }

      const toolsMenu = document.querySelector('.menu__tools');
      const toolsList = toolsMenu ? toolsMenu.querySelector('.menu_tools__list') : null;
      if (toolsMenu && toolsList) {
         // Only for mobile: click to toggle dropdown
         const toolsToggle = toolsMenu.querySelector('div');
         toolsToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
               e.preventDefault();
               toolsList.classList.toggle('open');
               toolsList.classList.toggle('hidden');
            }
         });
         // Close dropdown when clicking outside
         document.addEventListener('click', function(e) {
            if (window.innerWidth > 768) return;
            if (!toolsMenu.contains(e.target)) {
               toolsList.classList.remove('open');
               toolsList.classList.add('hidden');
            }
         });
      }
   }
}
loadComponent("header", "../src/components/header.html");
loadComponent("footer", "../src/components/footer.html");
