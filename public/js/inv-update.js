const form = document.querySelector("#updateForm")
form.addEventListener("change", function () {
    const updateBtn = document.querySelector("button")
    updateBtn.removeAttribute("disabled")
    updateBtn.style.backgroundColor = "green";
})