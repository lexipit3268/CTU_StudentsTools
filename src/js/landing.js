import { loadData, getTestimonialsData } from "./main.js";

(async () => {
   await loadData();
})();

document.addEventListener("DOMContentLoaded", async () => {
   await loadData();
   const testimonialsContainer = document.getElementById("testimonials-container");
   getTestimonialsData().forEach((person) => {
      const card = document.createElement("div");
      card.className = "testimonial__card flex justify-center flex-col-reverse !p-4 gap-2";
      card.setAttribute("data-aos", "flip-left");

      const lastName = String(person.name.trim().split(" ").pop());
      const charName = lastName.charAt(0);
      const gender = person.gender;

      card.innerHTML = `
         <p>${person.content}</p>
         <div class="person flex flex-row items-center gap-4">
            <div class="person__avt"><img src="https://avatar.iran.liara.run/public/${gender}?username=${lastName}" alt="${charName}" style="background-size: cover"></img></div>
            <div class="person__about">
               <p>${person.name}</p> 
               <small>${person.role}</small>
            </div>
         </div>
      `;
      testimonialsContainer.appendChild(card);
   });
});


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