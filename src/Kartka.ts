declare var tinymce: any
export class Kartka {
    btnCunt: HTMLDivElement
    element: HTMLDivElement
    isResizerClicked: boolean = false
    isClicked: boolean = false
    offsetX: number = 0
    offsetY: number = 0
    private resizer: HTMLDivElement
    startX: number = 0
    startY: number = 0
    startWidth: number = 0
    startHeight: number = 0
    textBox: HTMLDivElement
    paragraph: HTMLParagraphElement
    protected paragraphText: Text
    button: unknown
    paragraphId: string
    constructor() {
        //notka
        this.element = document.createElement('div')
        this.element.classList.add('kartka')

        //add buttons
        this.btnCunt = document.createElement('div')
        this.btnCunt.classList.add('btnCunt')

        this.addButton("X", () => this.deleteKartka())
        this.addButton("E", () => this.editText())

        this.element.appendChild(this.btnCunt)
        
        // add text
        this.textBox = document.createElement('div')
        this.textBox.classList.add('textBox')
        this.element.appendChild(this.textBox)

        this.paragraph = document.createElement('p')
        this.paragraph.classList.add('paragraph')
        this.paragraphId = "i"+Math.random().toString(36).substring(7);
        this.paragraph.id = this.paragraphId;
        this.textBox.appendChild(this.paragraph)
        this.paragraphText = document.createTextNode("ur mom")
        this.paragraph.appendChild(this.paragraphText)

        //draging
        this.element.addEventListener("mousedown", this.handleMouseDown.bind(this))
        document.addEventListener("mouseup", this.handleMouseUp.bind(this))

        //resize
        this.resizer = document.createElement('div')
        this.resizer.className = 'resizer'
        this.element.appendChild(this.resizer)

        this.resizer.addEventListener('mousedown', this.clickResize.bind(this), false);
        document.documentElement.addEventListener('mouseup', this.stopResize.bind(this), false);

        //dodanie
        document.body.appendChild(this.element)
    }
    //dodawanie guzików
    addButton(label: string, clickHandler: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
        const button = document.createElement('button')
        button.innerText = label
        button.classList.add('notkabtn')
        button.onclick = clickHandler
        if(button.innerText == "E"){
            button.classList.add('edit-icon')
        }else if(button.innerText =="X"){
            button.classList.add('delete-icon')
        }
        this.btnCunt.appendChild(button) 
    }
    //funkcja usuwania notki & i zmniejszanie obecnie
    deleteKartka() {
        this.isClicked = false
        this.element.remove()
        var obLicz = document.querySelector('.ram') as HTMLDivElement
        var kartkaElements = document.querySelectorAll('.kartka')
        obLicz!.innerText = kartkaElements.length.toString()
    }
    //edytowanie tekstu
    editText() {
        var originalContent = document.querySelector('.paragraph')?.textContent
        document.body.appendChild(this.textBox)
        this.textBox.classList.remove('textBox')
        this.textBox.classList.add('writeBox')
    
        var buttonPlus = document.querySelector('.plusBTN')
        buttonPlus!.classList.add('disabled')
    
        const kartka = document.querySelectorAll(".kartka") as NodeListOf<HTMLDivElement>
        for(let i = 0; i < kartka.length; i++){
            kartka[i].classList.add("disabled")
        }
        var thiis = this
        try {
            tinymce.init({
                selector: '#' + thiis.paragraphId,
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            });
            //custom guziki
            setTimeout(()=>{
                setTimeout(()=>{
                    document.querySelector(".tox-statusbar__branding")?.remove()
                document.querySelector(".tox-statusbar__resize-handle")?.remove()
                },1)
                var tinymice = document.querySelector(".tox-tinymce")
                var save = document.createElement("button")
                var close = document.createElement("button")
                save.addEventListener("click",()=>{
                    this.element.appendChild(this.textBox)
                    this.textBox.classList.remove('writeBox')
                    this.textBox.classList.add('textBox')
                    for(let i = 0; i < kartka.length; i++){
                        kartka[i].classList.remove("disabled")
                    }
                    buttonPlus!.classList.remove('disabled')
                    if (tinymce.activeEditor) {
                        tinymce.remove()
                    }
                })
                close.addEventListener("click",()=>{
                    tinymce.activeEditor.setContent(originalContent)
                    this.element.appendChild(this.textBox);
                    this.textBox.classList.remove('writeBox')
                    this.textBox.classList.add('textBox');
                    for(let i = 0; i < kartka.length; i++){
                        kartka[i].classList.remove("disabled")
                    }
                    buttonPlus!.classList.remove('disabled')
                    if (tinymce.activeEditor) {
                        tinymce.remove();
                    }
                })
                save.classList.add("tox-mbtn")
                save.classList.add("tox-mbtn--select")
                save.classList.add("save-icon")
                save.innerText="💾"
                close.classList.add("tox-mbtn")
                close.classList.add("tox-mbtn--select")
                close.classList.add("material-symbols-outlined")
                close.innerText="❌"
                setTimeout( ()=>{
                    tinymice!.children[0].children[3].children[0].appendChild(save)
                    tinymice!.children[0].children[3].children[0].appendChild(close)
                },200)
            },200)

        } 
        catch (error) {
            alert(':p');
        }
    }
    //draging
    handleMouseDown(e:MouseEvent) {
        
        this.offsetX = e.clientX - this.element.getBoundingClientRect().left
        this.offsetY = e.clientY - this.element.getBoundingClientRect().top

        this.isClicked = true

        document.addEventListener("mousemove", this.moveElement.bind(this))
        
        //z-index kartki
        const highestZIndex = Array.from(document.querySelectorAll('.kartka')).reduce((maxZIndex, kartka) => {
            const zIndex = parseInt(getComputedStyle(kartka).zIndex, 10)
            return isNaN(zIndex) ? maxZIndex : Math.max(maxZIndex, zIndex)
        }, 0)

        this.element.style.zIndex = `${highestZIndex + 1}`

        //z-index for plusBTN & counterr
        const buttonPluh = document.querySelector('.plusBTN') as HTMLButtonElement
        const btnZIndex = parseInt(getComputedStyle(buttonPluh!).zIndex, 10)
        buttonPluh!.style.zIndex = `${btnZIndex + 1}`

        const counterPluh = document.querySelector('.counterr') as HTMLDivElement
        const counterrZIndex = parseInt(getComputedStyle(counterPluh!).zIndex, 10)
        counterPluh!.style.zIndex = `${counterrZIndex + 1}`
    }

    moveElement(e:MouseEvent) {
        if (this.isClicked) {
            this.element.style.left = e.clientX - this.offsetX + "px"
            this.element.style.top = e.clientY - this.offsetY + "px"
        }
    }

    handleMouseUp() {
        this.isClicked = false
        document.removeEventListener("mousemove", this.moveElement.bind(this))
                
    }
    //resize
    clickResize(e:MouseEvent) {
        this.isResizerClicked = true
        this.startX = e.clientX
        this.startY = e.clientY
        this.startWidth = parseInt(document.defaultView!.getComputedStyle(this.element).width, 10)
        this.startHeight = parseInt(document.defaultView!.getComputedStyle(this.element).height, 10)
        document.documentElement.addEventListener('mousemove', this.doResize.bind(this), false)
    }    

    doResize(e:MouseEvent) {       
        if (this.isResizerClicked) {
            this.isClicked = false
            this.element.style.width = (this.startWidth + e.clientX - this.startX) + 'px'
            this.element.style.height = (this.startHeight + e.clientY - this.startY) + 'px'
        }
    }

    stopResize() {
        this.isResizerClicked = false
        document.documentElement.removeEventListener('mousemove', this.doResize.bind(this), false)
    }
            
}