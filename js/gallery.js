import gallery from './gallery-items.js'; // eslint-disable-line
// console.log(gallery);

const refs = {
  ulGallery: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  backdropRef: document.querySelector('.lightbox__content'),
  largeImage: document.querySelector('.lightbox__image'),
  closeModalBnt: document.querySelector('button[data-action="close-lightbox"]'),
};

// Создание и рендер разметки по парсу
function createGalleryRef(images) {
  return images
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item"> <a class = "gallery___link" href="${original}"> <img loading= "lazy" class = "gallery__image lazyload" data-src="${preview}" data-source="${original}" alt="${description}"/></a> </li>
    `;
    })
    .join('');
}

const cardsGallery = createGalleryRef(gallery);

refs.ulGallery.insertAdjacentHTML('beforeend', cardsGallery);

refs.ulGallery.addEventListener('click', openGallery);

// Native lazy-loading - feature detection

function addSrcAttrTolazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    img.src = img.dataset.src;
  });
}

function addlazySizesScript() {
  const script = document.creatElement('script');
  script.srs =
    'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js';
  script.integrity =
    'sha512-TmDwFLhg3UA4ZG0Eb4MIyT1O1Mb+Oww5kFG0uHqXsdbyZz9DcvYQhKpGgNkamAI6h2lGGZq2X8ftOJvF/XjTUg==';
  script.crossOrigin = 'anonymous';
  document.body.appendChild(script);
}

if ('loading' in HTMLIFrameElement.prototype) {
  // supported in browser
  addSrcAttrTolazyImages();
} else {
  // fetch polyfill/third-party library
  addlazySizesScript();
}

// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.

function openGallery(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  const imageRef = event.target;

  const largeImageURL = imageRef.dataset.source;

  refs.largeImage.src = largeImageURL;
  refs.largeImage.alt = imageRef.getAttribute('alt');

  // console.log(largeImageURL);
  refs.modal.classList.add('is-open');
  window.addEventListener('keydown', onPressEscape);
  window.addEventListener('keydown', onNextImgGallery);

  setLargeImageSrc(largeImageURL);
}

//Подмена значения атрибута src элемента img.lightbox__image.

function setLargeImageSrc(url) {
  refs.largeImage.src = url;
}

// закрытие по клику на Backdrop

refs.backdropRef.addEventListener('click', onBackDropClick);

function onBackDropClick(event) {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
}

// закрытие по клику на ESC
function onPressEscape(event) {
  if (event.code === 'Escape') {
    onCloseModal();
  }
}

// закрытие модального окна
refs.closeModalBnt.addEventListener('click', onCloseModal);

function onCloseModal() {
  refs.modal.classList.remove('is-open');
  refs.largeImage.src = '';
  refs.largeImage.alt = '';
  window.removeEventListener('keydown', onPressEscape);
  window.removeEventListener('keydown', onNextImgGallery);
}

// Пролистование галереи фотографий

function onNextImgGallery(event) {
  const rightKey = 'ArrowRight';
  const leftKey = 'ArrowLeft';

  let findIndexImg = gallery.findIndex(
    img => img.original === refs.largeImage.src,
  );

  if (event.code === leftKey) {
    if (findIndexImg === 0) {
      return;
    }
    findIndexImg -= 1;
  }

  if (event.code === rightKey) {
    if (findIndexImg === gallery.length - 1) {
      return;
    }
    findIndexImg += 1;
  }
  refs.largeImage.src = gallery[findIndexImg].original;
  refs.largeImage.alt = gallery[findIndexImg].description;
}