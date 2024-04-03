import { Kartka } from "./Kartka"

const plusKartkaGuzior = document.querySelector('.plusBTN') as HTMLButtonElement
plusKartkaGuzior.addEventListener('click', () => {
    //przebieg +1
    var przeLicz = document.querySelector('.pam') as HTMLDivElement
    var przebieg = parseInt(przeLicz!.innerText)
    przeLicz.innerText = `${przebieg + 1}`

    //obecnie +1
    var obLicz = document.querySelector('.ram') as HTMLDivElement
    var obecnie = parseInt(obLicz.innerText)
    obLicz.innerText = `${obecnie + 1}`

    new Kartka()
})
