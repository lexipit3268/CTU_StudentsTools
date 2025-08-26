export let vsatData = {};
export let hocbaData = {};
export let tohopData = {};
import { authenticate } from "./login.js";

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

document.addEventListener("DOMContentLoaded", async () => {
   await loadComponent("header", "./src/components/header.html");
   await loadComponent("footer", "./src/components/footer.html");
});

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
               ? "<i class='ri-sun-fill'></i>"
               : "<i class='fas fa-moon'></i>";
         });
      }

      // const navToggle = document.getElementById("nav-toggle");
      // const navMenu = document.getElementById("nav-menu");
      // if (navToggle && navMenu) {
      //    navToggle.addEventListener("click", () => {
      //       navMenu.classList.toggle("open");
      //    });
      //    navMenu.querySelectorAll("a").forEach(link => {
      //       link.addEventListener("click", () => {
      //          if (window.innerWidth <= 768) {
      //             navMenu.classList.remove("open");
      //          }
      //       });
      //    });
      // }

      // const toolsMenu = document.querySelector('.menu__tools');
      // const toolsList = toolsMenu ? toolsMenu.querySelector('.menu_tools__list') : null;
      // if (toolsMenu && toolsList) {
      //    const toolsToggle = toolsMenu.querySelector('div');
      //    toolsToggle.addEventListener('click', function (e) {
      //       if (window.innerWidth <= 768) {
      //          e.preventDefault();
      //          toolsList.classList.toggle('open');
      //          toolsList.classList.toggle('hidden');
      //       }
      //    });
      //    document.addEventListener('click', function (e) {
      //       if (window.innerWidth > 768) return;
      //       if (!toolsMenu.contains(e.target)) {
      //          toolsList.classList.remove('open');
      //          toolsList.classList.add('hidden');
      //       }
      //    });
      // }
      const navToggleBtn = document.getElementById("nav-toggle-btn");
      const navLinks = document.querySelector(".nav-links");
      navToggleBtn.addEventListener("click", function (e) {
         e.preventDefault();
         navToggleBtn.classList.toggle("ri-menu-line");
         navToggleBtn.classList.toggle("ri-close-line");

         navLinks.classList.toggle("translate-x-full");
         navLinks.classList.toggle("translate-x-0");
      });

      const toolsToggle = document.getElementById("tools-toggle");
      const toolsSubmenu = document.getElementById("tools-submenu");


      toolsToggle.addEventListener("click", (e) => {
         e.preventDefault();
         toolsSubmenu.classList.toggle("max-h-40");
         toolsSubmenu.classList.toggle("max-h-0");
      });

      document.addEventListener("click", (e) => {
         if (!toolsToggle.contains(e.target)) {
            toolsSubmenu.classList.remove("max-h-40");
            toolsSubmenu.classList.add("max-h-0");
         }
      });

      const loginBtn = document.getElementById("login-btn");
      if (loginBtn) {
         authenticate(loginBtn);
      }
   }
}

export function renderToast(message, type) {
   let toastBox = document.getElementById("toast-box");
   let errorMsg = `<i class="fa-solid fa-circle-xmark"></i> ${message}`;
   let invalidMsg = `<i class="fa-solid fa-circle-exclamation"></i>${message}`;
   let toast = document.createElement('div');
   toast.classList.add("toast");
   if (type === "error") {
      toast.classList.add("error");
      toast.innerHTML = errorMsg;
   }

   if (type === "invalid") {
      toast.classList.add("invalid");
      toast.innerHTML = invalidMsg;

   }

   toastBox.appendChild(toast);
   toast.addEventListener("click", () => {
      toast.remove();
   })
   setTimeout(() => {
      toast.remove();
   }, 5000);
}

export function convertNameSubject(mon) {
   const mapping = {
      Toan: "Toán",
      NguVan: "Ngữ Văn",
      VatLy: "Vật Lý",
      HoaHoc: "Hóa Học",
      SinhHoc: "Sinh Học",
      TiengAnh: "Tiếng Anh",
      LichSu: "Lịch Sử",
      DiaLy: "Địa Lý",
      TiengPhap: "Tiếng Pháp",
      TinHoc: "Tin học",
      CNCN: "Công nghệ Công nghiệp",
      GDKTPL: "Giáo dục kinh tế và pháp luật",
      GDCD: "Giáo dục công dân"
   };

   return mapping[mon] || mon;
}

export function renderInput(subjects, container, convertNameSubject, isVsat) {
   container.innerHTML = "";
   if (isVsat) {
      subjects.forEach(mon => {
         const div = document.createElement("div");
         div.classList.add("form__input");
         div.innerHTML =
            `
            <label for="${mon}">${convertNameSubject(mon)}</label>
            <input type="number" id="${mon}" placeholder="Nhập điểm của bạn...">
         `;
         container.appendChild(div);
      });
   } else {
      subjects.forEach(mon => {
         const div = document.createElement("div");
         div.classList.add("form__input");
         div.classList.add("hocba-input");
         div.innerHTML = `
            <label for="${mon}">${convertNameSubject(mon)}</label>
            <div class="flex flex-row gap-1">
               <input type="number" id="${mon}10" min="0" max="10" step="0.1" placeholder="Lớp 10...">
               <input type="number" id="${mon}11" min="0" max="10" step="0.1" placeholder="Lớp 11...">
               <input type="number" id="${mon}12" min="0" max="10" step="0.1" placeholder="Lớp 12...">
            </div>
         `;
         container.appendChild(div);
      })
   }

}

export function renderResult(mon, val, diem, container, convertNameSubject, isVsat) {
   const div = document.createElement("div");
   div.classList.add("result-item");
   let typeScore = "";
   if (isVsat) {
      typeScore = "V-SAT";
   } else {
      typeScore = "học bạ"
   }
   div.innerHTML =
      `
      <div class="text-center">
         <h5 class="text-sm">Điểm ${typeScore}</h5>
         <h2 class="text-2xl font-bold">${roundToTwo(val)}</h2>
         <small class="block">${convertNameSubject(mon)}</small>
      </div>

      <div class="text-center">
         <h5 class="text-sm">Điểm THPT</h5>
         <h2 class="text-2xl font-bold">${diem.score}</h2>
         <small class="block">Thứ hạng ${diem.rank}</small>
      </div>
   `;

   container.appendChild(div);
}

export function roundToTwo(num) {
   return +(Math.round(num + "e+2") + "e-2");
}

