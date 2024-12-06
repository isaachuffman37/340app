const accountForm = document.querySelector("#updateAccountForm")
accountForm.addEventListener("change", function () {
    const updateBtn = document.querySelector("#updateAccountBtn")
    updateBtn.removeAttribute("disabled")
    updateBtn.style.backgroundColor = "green";
})

const passwordForm = document.querySelector("#updatePasswordForm")
passwordForm.addEventListener("change", function () {
    const updateBtn = document.querySelector("#updatePasswordBtn")
    updateBtn.removeAttribute("disabled")
    updateBtn.style.backgroundColor = "green";
})