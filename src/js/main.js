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

//FAQ Function
document.addEventListener('DOMContentLoaded', () => {
   const faqItems = document.querySelectorAll('.accordion-item button');
   faqItems.forEach(item => {
      item.addEventListener('click', () => {
         const content = item.nextElementSibling;
         const parent = item.parentElement;
         const isActive = parent.classList.toggle('active');

         if (isActive) {
            content.classList.add('active');
         } else {
            content.classList.remove('active');
         }
      });
   });
});

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
      const savedTheme = localStorage.getItem("theme");
      const htmlElement = document.documentElement;
      if (savedTheme === "dark") {
         htmlElement.classList.add("dark");
      } else {
         htmlElement.classList.remove("dark");
      }
      if (themeToggle) {
         themeToggle.addEventListener("click", () => {
            htmlElement.classList.toggle("dark");
            if (htmlElement.classList.contains("dark")) {
               themeToggle.innerHTML = "<i class='ri-sun-fill'></i>"
               localStorage.setItem("theme", "dark");
            } else {
               themeToggle.innerHTML = "<i class='fas fa-moon'></i>"
               localStorage.setItem("theme", "light");
            }
         });
      }
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
   let successMsg = `<i class="fa-solid fa-circle-check"></i> ${message}`;
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

   if (type === "success") {
      toast.classList.add("success");
      toast.innerHTML = successMsg;
   }

   toastBox.appendChild(toast);
   toast.addEventListener("click", () => {
      toast.remove();
   })
   setTimeout(() => {
      toast.remove();
   }, 5000);
}

export function renderImage(node) {
   try {
      html2canvas(node, {
         useCORS: true,
         allowTaint: true,
         scale: 2,
         backgroundColor: null,
         logging: false,
         onclone: (clonedDoc) => {
            const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
            originalStyles.forEach(style => {
               clonedDoc.head.appendChild(style.cloneNode(true));
            });
         }
      }).then(canvas => {
         const link = document.createElement('a');
         link.download = 'ket-qua-quy-doi.png';
         link.href = canvas.toDataURL('image/png', 1.0);
         link.click();
         link.remove();
      })

      renderToast("Tạo ảnh thành công", "success");
   } catch (error) {
      console.error("Xảy ra lỗi khi tạo hình ảnh: ", error);
      renderToast(error, "error");
   }
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

