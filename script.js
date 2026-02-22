window.addEventListener("load", ()=>{
    // Cacher loader après chargement
    const loader=document.getElementById("loader");
    loader.style.opacity="0";
    setTimeout(()=>loader.style.display="none",600);
});

// SCROLL SMOOTH
function scrollToShop(){
    document.getElementById("shop").scrollIntoView({behavior:"smooth"});
}

// SCROLL REVEAL
const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add("active");}
    });
});
document.querySelectorAll(".section,.card,.product").forEach(el=>{
    el.classList.add("reveal"); observer.observe(el);
});

// HOVER 3D PRODUITS
document.querySelectorAll(".product").forEach(card=>{
    card.addEventListener("mousemove", e=>{
        const rect=card.getBoundingClientRect();
        const x=e.clientX-rect.left, y=e.clientY-rect.top;
        const centerX=rect.width/2, centerY=rect.height/2;
        const rotateX=(y-centerY)/10, rotateY=(centerX-x)/10;
        card.style.transform=`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    card.addEventListener("mouseleave", ()=>{card.style.transform="rotateX(0) rotateY(0) scale(1)";});
});

// PARTICLES JS CYBER
particlesJS("particles-js",{
    "particles":{"number":{"value":80},"color":{"value":"#FFD700"},
    "shape":{"type":"circle"},"opacity":{"value":0.5},"size":{"value":3},"line_linked":{"enable":true,"distance":150,"color":"#FFD700","opacity":0.3,"width":1},
    "move":{"enable":true,"speed":2}}},
    "interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"}},"modes":{"grab":{"distance":200,"line_linked":{"opacity":0.5}}}}
);

// FONCTIONS PAYMENTS STRIPE (exemple)
function buyStripe(pack){
    alert("Stripe Checkout prêt à être intégré pour pack "+pack+" coins");
    // Ici, ajouter ton code Stripe API pour checkout réel
}

// MUSIQUE AMBIANCE
const music=document.getElementById("bg-music");
music.volume=0.2;
