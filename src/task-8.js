import galleryItems from './gallery-items.js';
('use strict')

const refs = {
    galleryItem: document.querySelector('.js-gallery'),
    modalWindow: document.querySelector('.js-lightbox'),
    lightboxImg: document.querySelector('.lightbox__image'),
    closedButton: document.querySelector('button[data-action="close-lightbox"]'),
    parentImg: null
}

const fragment = document.createDocumentFragment();
galleryItems.forEach(image => {
    refs.galleryItem.insertAdjacentHTML('beforeend', 
    `<li class="gallery__item">
        <a class="gallery__link" href=${image.original}>
            <img class="gallery__image" src=${image.preview} data-source=${image.original} alt="${image.description}" />
        </a>
    </li>`)
})
refs.galleryItem.appendChild(fragment);

refs.galleryItem.addEventListener('click', openModal);

function openModal(e){
    e.preventDefault();
    if (e.target.nodeName === 'IMG') {
        refs.parentImg = e.target.closest('li');
        refs.modalWindow.classList.add('is-open') ;   
        refs.lightboxImg.setAttribute('src', e.target.dataset.source)
        
    }
    window.addEventListener('keydown',keyPress);
    
}

refs.closedButton.addEventListener('click', closedBtn)

function closedBtn(e){
    if(e.target.nodeName !== 'IMG'){
        refs.modalWindow.classList.remove('is-open') 
        refs.lightboxImg.src = '';            
    } 
    window.removeEventListener('keydown',keyPress);
}
refs.modalWindow.addEventListener('click', closedBtn) //Закрытие модального окна по клику на div.lightbox__overlay.


function keyPress(evn){
    if (evn.code ==='Escape') {
    closedBtn(evn)
    }
        else if (evn.code === 'ArrowRight'){
            const nextLi = refs.parentImg.nextSibling 
            refs.parentImg = nextLi;
            const newImg = nextLi.querySelector('img');
            const newDataSourse = newImg.dataset.source;
            refs.lightboxImg.setAttribute('src', newDataSourse)
            console.log(newDataSourse)
    }  
    else if (evn.code === 'ArrowLeft'){
        const previousLi = refs.parentImg.previousSibling 
        refs.parentImg = previousLi;
        const newImg =  previousLi.querySelector('img');
        const newDataSourse = newImg.dataset.source;
        refs.lightboxImg.setAttribute('src', newDataSourse)
        console.log(newDataSourse)
}   
    return
}


// ====== Lazyload for gallery======

const lazyLoad = target =>{
    const options = {};

    const lazyItems = new IntersectionObserver((entries, observer)=>{
        entries.forEach(entry=>{
            console.log(entry.target)
            if(entry.isIntersecting){
                const img = entry.target;
                const imageUrl = img.dataset.source;

                img.setAttribute('src', imageUrl);
                observer.disconnect()
            }
        })
    },options)

    lazyItems.observe(target);
};
const items = refs.galleryItem.querySelectorAll("li > a > img")

items.forEach(li =>{
    lazyLoad(li);
});
