export let vsatData = {};
export let hocbaData = {};
export let tohopData = {};

export const basePath = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
  ? ""
  : "/CTU_StudentsTools";

export async function loadData() {
   const vsatRes = await fetch(`${basePath}/public/data/vsat-data.json`);
   vsatData = await vsatRes.json();

   const hocbaRes = await fetch(`${basePath}/public/data/hocba-data.json`);
   hocbaData = await hocbaRes.json();

   const tohopRes = await fetch(`${basePath}/public/data/tohop-data.json`);
   tohopData = await tohopRes.json();

   return { vsatData, hocbaData, tohopData };
}

// Load component HTML
export async function loadComponent(id, file) {
   let path = file;
   if (file.startsWith('/')) {
      path = basePath + file;
   } else if (file.startsWith('./')) {
      path = basePath + file.slice(1);
   } else {
      path = basePath + '/' + file;
   }

   const res = await fetch(path);
   const html = await res.text();
   document.getElementById(id).innerHTML = html;

   if (id === "header") {
      const themeToggle = document.getElementById("theme-toggle");
      if (themeToggle) {
         themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            themeToggle.innerHTML = document.body.classList.contains("dark-theme")
               ? "<i class='fas fa-sun'></i>"
               : "<i class='fas fa-moon'></i>";
         });
      }

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
         const toolsToggle = toolsMenu.querySelector('div');
         toolsToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
               e.preventDefault();
               toolsList.classList.toggle('open');
               toolsList.classList.toggle('hidden');
            }
         });
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


loadComponent("header", "./src/components/header.html");
loadComponent("footer", "./src/components/footer.html");


// VSAT CONVERT
