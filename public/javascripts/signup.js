let card1 = document.getElementById("c1")
let card2 = document.getElementById("c2")
let cards = document.querySelector(".cards")
let HelperForm = document.querySelector(".helper")
let neederForm = document.querySelector(".needy")


card1.addEventListener("click", (e)=>{
    HelperForm.classList.remove("hidden")
    cards.classList.add("hidden")
})
card2.addEventListener("click", (e)=>{
    neederForm.classList.remove("hidden")
    cards.classList.add("hidden")
})