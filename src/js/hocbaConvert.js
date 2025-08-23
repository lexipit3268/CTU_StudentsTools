import { loadData, loadComponent, hocbaData, tohopData, convertNameSubject, renderInput, renderResult, renderToast } from "./main.js";
(async () => {
   await loadData();
   await loadComponent("header", "./src/components/header.html");
   await loadComponent("footer", "./src/components/footer.html");

})();

function getAvg(input10, input11, input12){
   return parseFloat((input10 + input11 + input12)/3);
}

function convertHocBaToThpt(mon, x) {
   const data = hocbaData[mon];
   if (!data) {
      return { score: 0, rank: null };
   }

   const row = data.find(item => x >= item.hocba.min && x <= item.hocba.max);
   if (!row) {
      let msg = "Điểm của môn " + convertNameSubject(mon) + " không nằm trong khoản hợp lệ (0-10)";
      renderToast(msg, "error");
      return { score: 0, rank: null };
   }
   const a = row.hocba.min;
   const b = row.hocba.max;
   const c = row.thpt.min;
   const d = row.thpt.max;

   const y = c + ((x - a) / (b - a)) * (d - c);

   return {
      score: parseFloat(y.toFixed(2)),
      rank: row.rank
   }
}

document.addEventListener("DOMContentLoaded", () => {
   const selectToHop = document.getElementById("tohop");
   const inputContainer = document.getElementById("subject-inputs");
   const resultContent = document.getElementById("result-content");
   const resultContainer = document.getElementById("result");
   const resultTotal = document.getElementById("result-total");
   const convertBtn = document.getElementById("convert-btn");
   document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         convertBtn.click();
      }
   });

   selectToHop.addEventListener("change", () => {
      const selectValue = selectToHop.value;
      const subjects = tohopData[selectValue];
      if (subjects) {
         renderInput(subjects, inputContainer, convertNameSubject, false);
      }
   })

   convertBtn.addEventListener("click", () => {
      const selectValue = selectToHop.value;
      const subjects = tohopData[selectValue];
      if (!subjects) {
         let message = "Vui lòng chọn tổ hợp!";
         renderToast(message, "error");
         return;
      };
      let total = 0;
      let missing = false;
      let invalid = false;
      resultContainer.innerHTML = "";
      subjects.forEach(mon => {
         const input10 = document.getElementById(mon+"10");
         const input11 = document.getElementById(mon+"11");
         const input12 = document.getElementById(mon+"12");

         const inputAvg = getAvg(input10, input11, input12);
         const val = parseFloat(inputAvg.value);
         if (isNaN(val)) {
            missing = true;
         } else {
            const diem = convertHocBaToThpt(mon, val);
            if (diem.rank === null || diem.score === 0) {
               invalid = true;
            } else {
               total += diem.score;
               renderResult(mon, val, diem, resultContainer, convertNameSubject);
            }
         }
      });

      if (missing) {
         let message = "Vui lòng nhập đủ điểm tất cả các môn!";
         renderToast(message, "invalid");
      }

      if (invalid) {
         resultContent.style.display = "none";
         return;
      }

      resultContent.classList.add("slideIn");
      resultContent.style.display = "block";
      resultTotal.innerHTML = `${total.toFixed(2)}`;
      setTimeout(() => {
         resultContent.classList.remove("slideIn");
      }, 1000);

   })
})