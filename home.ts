const nextDomTS: HTMLElement = document.getElementById('next')!;
const preDomTS: HTMLElement = document.getElementById('prev')!;
const carouselDomTS: HTMLElement = document.querySelector('.carousel')!;
const listItemDomTS: HTMLElement = document.querySelector('.carousel .list')!;
const thumbnailDomTS: HTMLElement = document.querySelector('.carousel .thumbnail')!;
const dataListDomTS: HTMLElement = document.getElementById('data-list')!;
const btnCartTS: HTMLElement = document.getElementById("btn_open_box_model")!;

let currentCategoryTS: string = '';
let queryNameTS: string = '';

fetchDataTS('Coffee', '')
updateCartCountTS();

btnCartTS.addEventListener('click', function () {
    window.location.href = "../html/buy.html"
});

document.getElementById('categorySelect')!.addEventListener('change', function () {
    currentCategoryTS = (this as HTMLSelectElement).value;
    const query = (document.getElementById('inputSearch') as HTMLInputElement).value.trim();
    fetchDataTS(currentCategoryTS, query);
})

document.getElementById('inputSearch')!.addEventListener('input', debounceTS(handleSearchTS, 300));

function handleSearchTS(this: HTMLInputElement) {
    const query = this.value.trim();
    currentCategoryTS = (document.getElementById('categorySelect') as HTMLSelectElement).value.trim()
    fetchDataTS(currentCategoryTS, query);
}

function fetchDataTS(category: string, query: string): void {
    clearDataListTS();
    fetch('https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/products')
        .then(response => response.json())
        .then((data: any[]) => {
            updateCartCountTS();
            data.forEach(item => {
                if (item.Categorie === category && item.name.toLowerCase().includes(query.toLowerCase())) {
                    const itemDom = createItemDomTS(item);
                    dataListDomTS.appendChild(itemDom);
                    const thumbnailItemDom = createThumbnailItemDomTS(item);
                    thumbnailDomTS.appendChild(thumbnailItemDom);
                }
            });
            setupThumbnailClickEventsTS();
        })
        .catch(error => console.error('Lỗi tải dữ liệu:', error));
}

function clearDataListTS(): void {
    while (dataListDomTS.firstChild && thumbnailDomTS.firstChild) {
        dataListDomTS.removeChild(dataListDomTS.firstChild);
        thumbnailDomTS.removeChild(thumbnailDomTS.firstChild);
    }
}

function updateCartCountTS(): void {
    fetch('https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart')
        .then(response => response.json())
        .then((data: any[]) => {
            const itemCount = data.length;
            const cartCountElement = document.querySelector('.cart-count') as HTMLElement | null;

            if (cartCountElement) {
                cartCountElement.textContent = itemCount.toString();
                cartCountElement.style.display = itemCount > 0 ? 'block' : 'none';
            } else {
                console.error('Element with class "cart-count" not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching cart data:', error);
        });
}


function setupThumbnailClickEventsTS(): void {
    document.querySelectorAll('.carousel .thumbnail .item').forEach(thumbnailItemDom => {
        thumbnailItemDom.addEventListener('click', () => {
            const itemThumbnails = Array.from(document.querySelectorAll('.carousel .thumbnail .item'));
            const index = itemThumbnails.indexOf(thumbnailItemDom);
            chooseItemTS(index);
        })
    })
}

function chooseItemTS(index: number): void {
    const itemSlider = document.querySelectorAll('.carousel .list .item');
    const itemThumbnail = document.querySelectorAll('.carousel .thumbnail .item');
    if (index >= 0 && index < itemSlider.length && index < itemThumbnail.length) {
        thumbnailDomTS.prepend(itemThumbnail[index]);
        listItemDomTS.prepend(itemSlider[index]);
    } else {
        console.error('Invalid index: ', index);
    }
}

function createItemDomTS(item: any): HTMLElement {
    const itemDom = document.createElement('div');
    const contentDom = document.createElement('div');
    const nameDom = document.createElement('div');
    const priceDom = document.createElement('div');
    const btnBuyNowDom = document.createElement('button');

    itemDom.className = 'item';
    contentDom.className = 'content';
    nameDom.className = 'name';
    priceDom.className = 'price';
    btnBuyNowDom.className = 'buttons';
    btnBuyNowDom.textContent = 'BUY';

    const imageSrc = item.images && item.images.length > 0 ? item.images[0] : null;
    if (imageSrc) {
        const img = new Image();
        img.src = imageSrc;
        img.alt = item.name;
        img.classList.add('img_content_thumbnail');
        itemDom.appendChild(img);
    } else {
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'Loading...';
        itemDom.appendChild(loadingText);
    }

    nameDom.textContent = item.name;
    priceDom.textContent = item.price + 'đ';

    contentDom.appendChild(nameDom);
    contentDom.appendChild(priceDom);
    contentDom.appendChild(btnBuyNowDom);
    itemDom.appendChild(contentDom);

    btnBuyNowDom.addEventListener('click', () => {
        addToCartTS(item);
    });

    return itemDom;
}

function createThumbnailItemDomTS(item: any): HTMLElement {
    const thumbnailItemDom = document.createElement('div');
    thumbnailItemDom.className = 'item';

    const thumbnailImg = new Image();
    const imageSrc = item.images && item.images.length > 0 ? item.images[0] : '../assets/images/img_coffee_small.jpg';
    thumbnailImg.src = imageSrc;
    thumbnailImg.alt = item.name;
    thumbnailItemDom.appendChild(thumbnailImg);

    const thumbnailContentDom = document.createElement('div');
    thumbnailContentDom.className = 'content';

    const thumbnailNameDom = document.createElement('div');
    thumbnailNameDom.className = 'name';
    thumbnailNameDom.textContent = item.name;

    thumbnailContentDom.appendChild(thumbnailNameDom);
    thumbnailItemDom.appendChild(thumbnailContentDom);

    return thumbnailItemDom;
}

function addToCartTS(item: any): void {
    const cart = {
        name: item.name,
        image: item.images[0],
        price: item.price,
        quantity: 1
    };

    fetch('https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    })
        .then(response => response.json())
        .then(() => {
            updateCartCountTS();
            showAlertTS("../assets/icons/ic_success.svg", "Good Job!", "The drink has been added to the cart, please check in your cart!");
        })
        .catch(error => {
            console.error('Error:', error);
            showAlertTS("../assets/icons/ic_fail.svg", "Sorry", "Something went wrong");
        });
}

function debounceTS(func: (...args: any[]) => void, wait: number): (...args: any[]) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

nextDomTS.addEventListener('click', () => showSliderTS('next'));
preDomTS.addEventListener('click', () => showSliderTS('prev'));

let timeRunningTS: number = 3000;
let runTimeOutTS: ReturnType<typeof setTimeout>;

function showSliderTS(type: 'next' | 'prev'): void {
    const itemSlider = document.querySelectorAll('.carousel .list .item');
    const itemThumbnail = document.querySelectorAll('.carousel .thumbnail .item');

    if (type === 'next') {
        listItemDomTS.appendChild(itemSlider[0]);
        thumbnailDomTS.appendChild(itemThumbnail[0]);
        carouselDomTS.classList.add('next');
    } else {
        const positionLastItem = itemSlider.length - 1;
        listItemDomTS.prepend(itemSlider[positionLastItem]);
        thumbnailDomTS.prepend(itemThumbnail[positionLastItem]);
        carouselDomTS.classList.add('prev');
    }

    clearTimeout(runTimeOutTS);
    runTimeOutTS = setTimeout(() => {
        carouselDomTS.classList.remove('next');
    }, timeRunningTS);
}

function showAlertTS(iconSrc: string, titleText: string, messageText: string): void {
    const alertIcon = document.getElementById("alert_icon") as HTMLImageElement;
    alertIcon.src = iconSrc;
    document.getElementById("alert_title")!.textContent = titleText;
    document.getElementById("alert_content")!.textContent = messageText;
    document.getElementById('alertBox')!.classList.add('show');
}

function closeAlertTS(): void {
    document.getElementById('alertBox')!.classList.remove('show');
}