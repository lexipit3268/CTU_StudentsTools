import { loadData, loadComponent, vsatData, hocbaData, tohopData, convertNameSubject } from "./main.js";
(async () => {
   await loadData();
   await loadComponent("header", "./src/components/header.html");
   await loadComponent("footer", "./src/components/footer.html");

   console.log("VSAT Data:", vsatData);
   console.log("To hop mon: ", tohopData);
})();

function convertVsatToThpt(mon, x) {
   const data = vsatData[mon];
   if (!data) return { score: 0, rank: null };

   const row = data.find(item => x >= item.vsat.min && x <= item.vsat.max);
   if (!row) {
      alert("Điểm của môn " + convertNameSubject(mon) + " không nằm trong khoản hợp lệ");
      return { score: 0, rank: null };
   }

   const a = row.vsat.min;
   const b = row.vsat.max;
   const c = row.thpt.min;
   const d = row.thpt.max;

   const y = c + ((x - a) / (b - a)) * (d - c);

   return {
      score: parseFloat(y.toFixed(2)),
      rank: row.rank
   };
}


document.addEventListener("DOMContentLoaded", () => {
   const selectToHop = document.getElementById("tohop");
   const inputContainer = document.getElementById("subject-inputs");
   const resultContent = document.getElementById("result-content");
   const resultContainer = document.getElementById("result");
   const resultTotal = document.getElementById("result-total");

   selectToHop.addEventListener("change", () => {
      const selectValue = selectToHop.value;
      inputContainer.innerHTML = "";
      if (tohopData[selectValue]) {
         const subjects = tohopData[selectValue];

         subjects.forEach(mon => {
            const div = document.createElement("div");
            div.classList.add("form__input");
            div.innerHTML =
               `
               <label for="${mon}">${convertNameSubject(mon)}</label>
               <input type="number" name="" id="${mon}" placeholder="Nhập điểm V-Sat (0-150)">
            `;

            inputContainer.appendChild(div);
         });
      }
   })

   // Xu ly diem VSAT
   const convertBtn = document.getElementById("convert-btn");
   convertBtn.addEventListener("click", () => {
      const selectValue = selectToHop.value;
      if (!tohopData[selectValue]) {
         alert("Vui lòng chọn tổ hợp!");
         return;
      }

      const subjects = tohopData[selectValue];
      let total = 0;
      let missing = false;
      let invalid = false;
      resultContainer.innerHTML = "";

      subjects.forEach(mon => {
         const input = document.getElementById(mon);
         const val = parseFloat(input.value);
         if (isNaN(val)) {
            missing = true;
         } else {
            const diem = convertVsatToThpt(mon, val);
            if (diem.score === 0 || diem.rank === null) {
               invalid = true;
            } else {
               console.log(convertVsatToThpt(mon, val))
               total += diem.score;

               const div = document.createElement("div");
               div.classList.add("result-item");
               div.innerHTML =
                  `
               <div class="text-center">
                  <h5 class="text-sm">Điểm V-SAT</h5>
                  <h2 class="text-2xl font-bold">${val}</h2>
                  <small class="block">${convertNameSubject(mon)}</small>
               </div>

               <div class="text-center">
                  <h5 class="text-sm">Điểm THPT</h5>
                  <h2 class="text-2xl font-bold">${diem.score}</h2>
                  <small class="block">Thứ hạng ${diem.rank}</small>
               </div>
            `;
               resultContainer.appendChild(div);
            }
         }
      })

      if (missing) {
         alert("Vui lòng nhập đủ điểm cho tất cả môn!");
         return;
      }

      if (invalid) {
         resultContent.style.display = "none";
         return;
      }

      resultContent.style.display = "block";
      resultTotal.innerHTML = total;

   })
})

