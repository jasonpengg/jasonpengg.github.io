const variables = {
    init(){
        cssVars = this.getAllCSSVariableNames();
        const divHeight = document.querySelector('.hotbar').offsetHeight;
        document.documentElement.style.setProperty('--hotbar-height', `${divHeight}px`);
    },
    getAllCSSVariableNames(styleSheets = document.styleSheets){
        var cssVars = [];
        for(var i = 0; i < styleSheets.length; i++){
            try{ 
                for( var j = 0; j < styleSheets[i].cssRules.length; j++){
                    try{
                    for(var k = 0; k < styleSheets[i].cssRules[j].style.length; k++){
                        let name = styleSheets[i].cssRules[j].style[k];
                        if(name.startsWith('--') && cssVars.indexOf(name) == -1){
                            cssVars.push(name);
                        }
                    }
                    } catch (error) {}
                }
            } catch (error) {}
        }
        return cssVars;
    },
    getElementCSSVariables(allCSSVars, element = document.body, pseudo){
        var elStyles = window.getComputedStyle(element, pseudo);
        var cssVars = {};
        for(var i = 0; i < allCSSVars.length; i++){
            let key = allCSSVars[i];
            let value = elStyles.getPropertyValue(key)
            if(value){cssVars[key] = value;}
        }
        return cssVars;
    }

}

const Slider = {
    sectionContainer: null,
    prevButton: null,
    nextButton: null,
    sections: null,
    slideIndex: 0,
    pageNumber: 1,
    maxIndex: null,
    cssVar: null,
    myDiv: null,
    width: null,



    init() {
        this.cssVar = variables.getElementCSSVariables(variables.getAllCSSVariableNames(), document.documentElement);
        this.sectionContainer = document.querySelector(".section-container");
        this.prevButton = document.getElementById("prev");
        this.nextButton = document.getElementById("next");
        this.sections = document.querySelectorAll(".section");
        this.maxIndex = this.sections.length;
        this.slideIndex = 0;

        this.nextButton.addEventListener("click", () => this.nextSlide());
        this.prevButton.addEventListener("click", () => this.prevSlide());
        this.updateCurrentSlide();

       
    },

    nextSlide() {
        if (this.slideIndex < this.maxIndex -1) {
            //this.pageNumber++;
            this.slideIndex++;
            console.log("Next slide:", this.slideIndex);
            this.updateSlidePosition();
    }
    },

    prevSlide() {
        if (this.slideIndex > 0){
            //this.pageNumber--;
            this.slideIndex--;
            this.updateSlidePosition();
            console.log(this.slideIndex);
        }
    },

    updateCurrentSlide(){
        if (this.slideIndex == 0){
            document.getElementById('prev').style.visibility = "hidden";
        }else 
            document.getElementById('prev').style.visibility = "visible";

        if (this.slideIndex == (this.maxIndex -1)){
            document.getElementById('next').style.visibility = "hidden";
        }else 
            document.getElementById('next').style.visibility = "visible";

    },
    updateSlidePosition(){
        this.sectionContainer.style.transform = `translateX(${-this.slideIndex * 100}%)`;
        this.updateCurrentSlide();
    }

}


const hover = {
    sections: null,
    currhover: null,
    init(){

        this.sections = document.querySelectorAll(".trip-section");

        this.sections.forEach((item) =>{
            item.addEventListener('mouseenter',() => this.checkHover(item));
        });
        this.currhover = 0;

        this.sections[0].classList.add('active');
    },
    
    checkHover(item){
         setTimeout(() => {
            requestAnimationFrame(() => {
                item.classList.add('active');
                item.querySelector("video").play();
                item.querySelector("video").classList.add('active');
            });
        },100);
        setTimeout(() => {
            this.sections.forEach((item) => {
                item.classList.remove('active');
                item.querySelector("video").pause();
                 item.querySelector("video").classList.remove('active');
                })
        },100);
    
    }
}


class PictureGallery {
  constructor(container) {
    this.container = container;
    this.isDown = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.init();
  }

  init() {
    // Mouse events
    this.container.addEventListener("mousedown", (e) => this.startDrag(e));
    this.container.addEventListener("mouseleave", () => this.stopDrag());
    this.container.addEventListener("mouseup", () => this.stopDrag());
    this.container.addEventListener("mousemove", (e) => this.drag(e));

    // Touch events
    this.container.addEventListener("touchstart", (e) => this.startDrag(e.touches[0]),{ passive: false });
    this.container.addEventListener("touchend", () => this.stopDrag());
    this.container.addEventListener("touchmove", (e) => this.drag(e.touches[0]),{ passive: false });
  }

  startDrag(e) {
    this.isDown = true;
    this.container.classList.add("dragging");
    this.startX = e.pageX - this.container.offsetLeft;
    this.scrollLeft = this.container.scrollLeft;
  }

  stopDrag() {
    this.isDown = false;
    this.container.classList.remove("dragging");
  }

  drag(e) {
    if (!this.isDown) return;
    
    const x = e.pageX - this.container.offsetLeft;
    const walk = (x - this.startX) * 1.5;
    this.container.scrollLeft = this.scrollLeft - walk;
  }
}

const darkMode = {
    button: null,
    root: null,
    savedTheme: null,
    picture:null,

    init() {
        // get elements
        this.button = document.getElementById("darkMode");
        this.picture = document.getElementById("darkModePic");
        this.root = document.documentElement;

        // load saved theme if exists
        this.savedTheme = localStorage.getItem("theme");
        
        if (this.savedTheme === "dark") {
            this.root.setAttribute("data-theme", "dark");
        }

        // add button click listener
        this.button.addEventListener("click", () => this.changeColours());
    },

    changeColours() {
        // check current theme
        const current = this.root.getAttribute("data-theme");
        const isDark = current === "dark";

        // toggle theme
        let newTheme; 
        if(isDark){
            newTheme = "light";
            this.picture.src = "pictures/sun.png";
        }else{
            newTheme = "dark";
            this.picture.src = "pictures/moon.png";
        }
        this.root.setAttribute("data-theme", newTheme);

        // save preference
        localStorage.setItem("theme", newTheme);
    }
};

const smoothscroll = {
    section: null,
    current: 0,
    scrolling: false, 
    lastScroll: 0,
    delta: 0,
    threshold:5,
    scrollAccum:0,
    enabled: true,
    set:10,
    minpage:0,
    maxpage: null,

    init(){
        this.pages = document.querySelectorAll('.page');
        this.maxpage = this.pages.length -1;
        this.threshold = 200;
        this.scrollAccum = 0;

        window.addEventListener('wheel', (e) => {

            if(!this.enabled) return;

            if (this.scrolling == true){
                e.preventDefault();  // stop momentum scroll
                e.stopImmediatePropagation();
               
                return;
                
            }else{
                document.body.style.overflowY = 'auto';
            };
            
            this.scrollAccum += e.deltaY * 0.4;

            if (this.scrollAccum > this.threshold + this.set){
                this.scrollAccum = this.threshold + this.set;
            }
            if (this.scrollAccum < -1*this.threshold - this.set){
                this.scrollAccum = -1*this.threshold - this.set;
            }

            if(this.current == this.minpage && this.scrollAccum < 0){
                this.scrollAccum =0;
            } 

            // User scrolls down past threshold
            if (this.scrollAccum > this.threshold && this.current < this.pages.length - 1) {
                this.current++;
                this.scrollToPage();
            }
            // User scrolls up past threshold
            else if (this.scrollAccum < -this.threshold && this.current > 0 && e.deltaY<=0) {
                this.current--;
                this.scrollToPage();
            }
        },{ passive: false });
    },
    scrollToPage(){
        this.scrollAccum = 0;
        this.scrolling = true;
        this.pages[this.current].scrollIntoView({behavior: 'smooth'});

        setTimeout(() => {
            this.scrolling = false;
        }, 1000);
        
        
    },

};

const buttons = {
    init(){

        document.getElementById("resume").addEventListener("click", function() {
            window.open("./resources/Jason_Peng_Resume.pdf", "_blank", "noopener,noreferrer");
        });
        document.getElementById("resume1").addEventListener("click", function() {
            window.open("./resources/Jason_Peng_Resume.pdf", "_blank", "noopener,noreferrer");
        });
        document.getElementById("close").addEventListener("click", () => this.closeModal());
           
        document.getElementById("open").addEventListener("click", () => this.openModal());

        document.getElementById("modal-link").addEventListener("click", () => this.openModal());

        window.addEventListener("click", e => {
            if (e.target===modal){
                this.closeModal();
            }
        });


        for(let page of document.getElementsByClassName("pg1")){ 
            page.addEventListener("click", function(){
                smoothscroll.current= smoothscroll.minpage;
                smoothscroll.scrollAccum = 0;
                this.reset();
            })
            
        }
        for(let page of document.getElementsByClassName("pg3")){ 
            page.addEventListener("click", function(){
                smoothscroll.current= smoothscroll.maxpage;
                smoothscroll.scrollAccum = 0;
                this.reset();
            })
            
        }
          for(let page of document.getElementsByClassName("pg2")){ 
            page.addEventListener("click", function(){
                smoothscroll.current = 1;
                smoothscroll.scrollAccum = 0;
                this.reset();
            })
            
        }
        
    },
    openModal(){
        document.getElementById("modal").classList.add("show-modal");
        document.body.style.overflow = 'hidden';
        smoothscroll.enabled=false;
    },
    closeModal(){
        document.getElementById("modal").classList.remove("show-modal");
        document.getElementById("status").textContent = "";
        document.body.style.overflow = '';
        smoothscroll.enabled=true;
    },
    reset(){
        window.addEventListener('hashchange', () => {
            document.documentElement.style.scrollBehavior = 'auto';
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = 'smooth';
            }, 100);
        });
    }
}

const links ={
    init(){
        document.querySelectorAll('.link').forEach(link => {
            link.addEventListener('click', function(e) {
            smoothscroll.scrollAccum = 0;
            setTimeout(()=>{
                history.replaceState(null, '', window.location.pathname + window.location.search);
            });
            });
        });
    }
}

const sendemails = {
    form: null,
    status:null, 

    init(){
        
        this.form = document.getElementById("contact-form");
        this.status = document.getElementById("status");
        this.form.addEventListener("submit", (e) => this.submit(e));
    },
    submit(e){
        const submitBtn = this.form.querySelector(".submit-btn");
        submitBtn.disabled = true;
        submitBtn.value = "Sending...";
        emailjs.sendForm("service_kwc5srn", "template_r99mbiu", this.form)
            .then(() => {
                this.status.textContent = "Sent!";
                this.status.style.color = "green";

                this.form.reset();
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                this.status.textContent = "Please try again.";
                this.status.style.color = "red";
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.value = "Send";
            });
    }



}

const onload = {
    init(){
        window.addEventListener("load", ()=> this.refresh());
    },
    refresh(){
        smoothscroll.current = 0;
        smoothscroll.scrollAccum =0;
        smoothscroll.scrollToPage();
    }
}

document.addEventListener("DOMContentLoaded", () => variables.init());
document.addEventListener("DOMContentLoaded", () => Slider.init());
document.addEventListener("DOMContentLoaded", () => hover.init());
document.addEventListener("DOMContentLoaded", () => darkMode.init());
document.addEventListener('DOMContentLoaded', () => smoothscroll.init());
document.querySelectorAll(".img-slides").forEach((carousel) => {
  new PictureGallery(carousel);
});

document.addEventListener('DOMContentLoaded', () => buttons.init());
document.addEventListener('DOMContentLoaded', () => links.init());
document.addEventListener('DOMContentLoaded', () => sendemails.init());
document.addEventListener('DOMContentLoaded', () => onload.init());