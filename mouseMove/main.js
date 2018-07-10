document.addEventListener("DOMContentLoaded", ()=>{
    let dot = document.querySelectorAll('#dot');
    let wrap = document.querySelector('.wrap');


    wrap.addEventListener('mousemove', (e)=>{
        let x = e.clientX-'57';
        let y = e.clientY-'57';

     
        for(let i = 0; i<dot.length; i++ ){
            let p = 'px';
            dot[i].style.top = y + p;
            dot[i].style.left = x + p;

        }
    });
});