import { loadData, loadComponent, vsatData, hocbaData, tohopData, convertNameSubject, renderInput, renderResult, renderToast, roundToTwo } from "./main.js";
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
      let msg = "Điểm của môn " + convertNameSubject(mon) + " không nằm trong khoản hợp lệ (0-150)";
      renderToast(msg, "error");
      return { score: 0, rank: null };
   }

   const a = row.vsat.min;
   const b = row.vsat.max;
   const c = row.thpt.min;
   const d = row.thpt.max;

   const y = c + ((x - a) / (b - a)) * (d - c);

   return {
      score: roundToTwo(y),
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
      const subjects = tohopData[selectValue];
      if (subjects) {
         renderInput(subjects, inputContainer, convertNameSubject, true);
      }
   })

   document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         convertBtn.click();
      }
   });

   // Xu ly diem VSAT
   const convertBtn = document.getElementById("convert-btn");
   convertBtn.addEventListener("click", () => {
      const selectValue = selectToHop.value;
      if (!tohopData[selectValue]) {
         let message = "Vui lòng chọn tổ hợp!";
         renderToast(message, "invalid");
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
               total += diem.score;
               renderResult(mon, val, diem, resultContainer, convertNameSubject, true);
            }
         }
      })

      if (missing) {
         let message = "Vui lòng nhập đủ điểm cho tất cả môn!";
         renderToast(message, "invalid");
         return;
      }

      if (invalid) {
         resultContent.style.display = "none";
         return;
      }

      resultContent.classList.add("slideIn");
      resultContent.style.display = "block";
      resultTotal.innerHTML = `${roundToTwo(total)}`;
      resultContent.scrollIntoView({
         behavior: 'smooth', 
         block: 'start'     
      });
      setTimeout(() => {
         resultContent.classList.remove("slideIn");
      }, 1000);

   });
});

