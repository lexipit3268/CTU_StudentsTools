import {renderToast } from "./main.js";

export function authenticate(button) {
   button.addEventListener("click", () => {
      renderToast("Chức năng đang được cập nhật :P", "error");
   })
}