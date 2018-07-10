document.addEventListener('DOMContentLoaded', () => {
  
  new Slider({
    images: '.wrap img',
    show: '.wrap .show',
    wrap:'.wrap'
  });


  function Slider (selector){
    this.images = document.querySelectorAll(selector.images);
    this.show = document.querySelector(selector.show);
    this.wrap = document.querySelector(selector.wrap);
    
    for (let i = 0; i < this.images.length; i++){
      this.images[i].addEventListener('mouseover',(e)=>{
        e.target.style.border = '2px solid black';
        this.show.style.backgroundImage = 'url(' + this.images[i].src + ')';
        this.show.style.backgroundSize = 'cover';
      })
  }

    for (let i = 0; i < this.images.length; i++){
      this.images[i].addEventListener('mouseout',(e)=>{
        e.target.style.border = '';
        this.show.style.backgroundImage = '';
      })
    }

  }
});