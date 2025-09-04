import { loadData, loadComponent, getHocbaData, getToHopData, convertNameSubject, renderInput, renderResult, renderToast, roundToTwo, renderImage } from "./main.js";
(async () => {
   await loadData();
   await loadComponent("header", "./src/components/header.html");
   await loadComponent("footer", "./src/components/footer.html");
})();

function getAvg(input10, input11, input12) {
   return (input10 + input11 + input12) / 3;
}

function convertHocBaToThpt(mon, x) {
   const data = getHocbaData()[mon];
   if (!data) {
      return { score: 0, rank: null };
   }

   const row = data.find(item => x > item.hocba.min && x <= item.hocba.max);
   if (!row) {
      let msg = "Điểm trung bình môn " + convertNameSubject(mon) + " không nằm trong khoản hợp lệ";
      renderToast(msg, "invalid");
      return { score: 0, rank: null };
   }
   const a = row.hocba.min;
   const b = row.hocba.max;
   const c = row.thpt.min;
   const d = row.thpt.max;
   const y = c + (((x - a) / (b - a)) * (d - c));

   const roundedY = Math.ceil(y * 100) / 100;

   return {
      score: roundedY,
      rank: row.rank
   }
}

function isInvalidValue(value) {
   return value < 0 || value > 10;
}


document.addEventListener("DOMContentLoaded", () => {
   const selectToHop = document.getElementById("tohop");
   const inputContainer = document.getElementById("subject-inputs");
   const resultContent = document.getElementById("result-content");
   const resultContainer = document.getElementById("result");
   const resultTotal = document.getElementById("result-total");
   const convertBtn = document.getElementById("convert-btn");
   const saveImgBtn = document.getElementById("save-image-button");

   document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         convertBtn.click();
      }
   });

   selectToHop.addEventListener("change", () => {
      const selectValue = selectToHop.value;
      const subjects = getToHopData()[selectValue];
      if (selectValue === "none") inputContainer.innerHTML = "";
      if (subjects) {
         renderInput(subjects, inputContainer, convertNameSubject, false);
      }
   })

   convertBtn.addEventListener("click", () => {
      const selectValue = selectToHop.value;
      const subjects = getToHopData()[selectValue];
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
         const input10 = document.getElementById(mon + "10");
         const input11 = document.getElementById(mon + "11");
         const input12 = document.getElementById(mon + "12");

         const val10 = parseFloat(input10.value);
         const val11 = parseFloat(input11.value);
         const val12 = parseFloat(input12.value);

         if (isNaN(val10) || isNaN(val11) || isNaN(val12)) {
            missing = true;
         }


         if (isInvalidValue(val10) || isInvalidValue(val11) || isInvalidValue(val12)) {
            invalid = true;
            let message = "Điểm môn " + convertNameSubject(mon) + " không hợp lệ!";
            renderToast(message, "invalid");
            return;
         }

         const inputAvg = roundToTwo(getAvg(val10, val11, val12));
         if (isNaN(inputAvg)) {
            missing = true;
         } else {
            const diem = convertHocBaToThpt(mon, inputAvg);
            if (diem.rank === null || diem.score === 0) {
               invalid = true;
            } else {
               total += diem.score;
               renderResult(mon, roundToTwo(inputAvg), diem, resultContainer, convertNameSubject, false);
            }
         }
      });

      if (missing) {
         let message = "Vui lòng nhập đủ điểm tất cả các môn!";
         renderToast(message, "error");
         return;
      }

      if (invalid) {
         resultContent.style.display = "none";
         return;
      }

      resultContent.classList.add("slideIn");
      resultContent.style.display = "block";
      resultTotal.innerHTML = `${roundToTwo(total)}`;

      let scrollBlockStyle = "start";
      if (window.innerWidth >= 768) {
         scrollBlockStyle = "end";
      }

      resultContent.scrollIntoView({
         behavior: 'smooth',
         block: scrollBlockStyle
      });

      saveImgBtn.style.display = "block";


      setTimeout(() => {
         resultContent.classList.remove("slideIn");
      }, 1000);

   })

   saveImgBtn.addEventListener("click", () => {
      renderImage(resultContent);
   });
})