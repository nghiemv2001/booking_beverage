var nextDomTS = document.getElementById('next');
var preDomTS = document.getElementById('prev');
var carouselDomTS = document.querySelector('.carousel');
var listItemDomTS = document.querySelector('.carousel .list');
var thumbnailDomTS = document.querySelector('.carousel .thumbnail');
var dataListDomTS = document.getElementById('data-list');
var btnCartTS = document.getElementById("btn_open_box_model");
var currentCategoryTS = '';
var queryNameTS = '';
fetchDataTS('Coffee', '');
updateCartCountTS();
btnCartTS.addEventListener('click', function () {
    window.location.href = "../html/buy.html";
});
document.getElementById('categorySelect').addEventListener('change', function () {
    currentCategoryTS = this.value;
    var query = document.getElementById('inputSearch').value.trim();
    fetchDataTS(currentCategoryTS, query);
});
document.getElementById('inputSearch').addEventListener('input', debounceTS(handleSearchTS, 300));
function handleSearchTS() {
    var query = this.value.trim();
    currentCategoryTS = document.getElementById('categorySelect').value.trim();
    fetchDataTS(currentCategoryTS, query);
}
function fetchDataTS(category, query) {
    clearDataListTS();
    fetch('https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/products')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        updateCartCountTS();
        data.forEach(function (item) {
            if (item.Categorie === category && item.name.toLowerCase().includes(query.toLowerCase())) {
                var itemDom = createItemDomTS(item);
                dataListDomTS.appendChild(itemDom);
                var thumbnailItemDom = createThumbnailItemDomTS(item);
                thumbnailDomTS.appendChild(thumbnailItemDom);
            }
        });
        setupThumbnailClickEventsTS();
    })
        .catch(function (error) { return console.error('Lỗi tải dữ liệu:', error); });
}
function clearDataListTS() {
    while (dataListDomTS.firstChild && thumbnailDomTS.firstChild) {
        dataListDomTS.removeChild(dataListDomTS.firstChild);
        thumbnailDomTS.removeChild(thumbnailDomTS.firstChild);
    }
}
function updateCartCountTS() {
    fetch('https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var itemCount = data.length;
        var cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = itemCount.toString();
            cartCountElement.style.display = itemCount > 0 ? 'block' : 'none';
        }
        else {
            console.error('Element with class "cart-count" not found.');
        }
    })
        .catch(function (error) {
        console.error('Error fetching cart data:', error);
    });
}
function setupThumbnailClickEventsTS() {
    document.querySelectorAll('.carousel .thumbnail .item').forEach(function (thumbnailItemDom) {
        thumbnailItemDom.addEventListener('click', function () {
            var itemThumbnails = Array.from(document.querySelectorAll('.carousel .thumbnail .item'));
            var index = itemThumbnails.indexOf(thumbnailItemDom);
            chooseItemTS(index);
        });
    });
}
function chooseItemTS(index) {
    var itemSlider = document.querySelectorAll('.carousel .list .item');
    var itemThumbnail = document.querySelectorAll('.carousel .thumbnail .item');
    if (index >= 0 && index < itemSlider.length && index < itemThumbnail.length) {
        thumbnailDomTS.prepend(itemThumbnail[index]);
        listItemDomTS.prepend(itemSlider[index]);
    }
    else {
        console.error('Invalid index: ', index);
    }
}
function createItemDomTS(item) {
    var itemDom = document.createElement('div');
    var contentDom = document.createElement('div');
    var nameDom = document.createElement('div');
    var priceDom = document.createElement('div');
    var btnBuyNowDom = document.createElement('button');
    itemDom.className = 'item';
    contentDom.className = 'content';
    nameDom.className = 'name';
    priceDom.className = 'price';
    btnBuyNowDom.className = 'buttons';
    btnBuyNowDom.textContent = 'BUY';
    var imageSrc = item.images && item.images.length > 0 ? item.images[0] : null;
    if (imageSrc) {
        var img = new Image();
        img.src = imageSrc;
        img.alt = item.name;
        img.classList.add('img_content_thumbnail');
        itemDom.appendChild(img);
    }
    else {
        var loadingText = document.createElement('div');
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
    btnBuyNowDom.addEventListener('click', function () {
        addToCartTS(item);
    });
    return itemDom;
}
function createThumbnailItemDomTS(item) {
    var thumbnailItemDom = document.createElement('div');
    thumbnailItemDom.className = 'item';
    var thumbnailImg = new Image();
    var imageSrc = item.images && item.images.length > 0 ? item.images[0] : '../assets/images/img_coffee_small.jpg';
    thumbnailImg.src = imageSrc;
    thumbnailImg.alt = item.name;
    thumbnailItemDom.appendChild(thumbnailImg);
    var thumbnailContentDom = document.createElement('div');
    thumbnailContentDom.className = 'content';
    var thumbnailNameDom = document.createElement('div');
    thumbnailNameDom.className = 'name';
    thumbnailNameDom.textContent = item.name;
    thumbnailContentDom.appendChild(thumbnailNameDom);
    thumbnailItemDom.appendChild(thumbnailContentDom);
    return thumbnailItemDom;
}
function addToCartTS(item) {
    var cart = {
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
        .then(function (response) { return response.json(); })
        .then(function () {
        updateCartCountTS();
        showAlertTS("../assets/icons/ic_success.svg", "Good Job!", "The drink has been added to the cart, please check in your cart!");
    })
        .catch(function (error) {
        console.error('Error:', error);
        showAlertTS("../assets/icons/ic_fail.svg", "Sorry", "Something went wrong");
    });
}
function debounceTS(func, wait) {
    var timeout;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timeout);
        timeout = setTimeout(function () { return func.apply(_this, args); }, wait);
    };
}
nextDomTS.addEventListener('click', function () { return showSliderTS('next'); });
preDomTS.addEventListener('click', function () { return showSliderTS('prev'); });
var timeRunningTS = 3000;
var runTimeOutTS;
function showSliderTS(type) {
    var itemSlider = document.querySelectorAll('.carousel .list .item');
    var itemThumbnail = document.querySelectorAll('.carousel .thumbnail .item');
    if (type === 'next') {
        listItemDomTS.appendChild(itemSlider[0]);
        thumbnailDomTS.appendChild(itemThumbnail[0]);
        carouselDomTS.classList.add('next');
    }
    else {
        var positionLastItem = itemSlider.length - 1;
        listItemDomTS.prepend(itemSlider[positionLastItem]);
        thumbnailDomTS.prepend(itemThumbnail[positionLastItem]);
        carouselDomTS.classList.add('prev');
    }
    clearTimeout(runTimeOutTS);
    runTimeOutTS = setTimeout(function () {
        carouselDomTS.classList.remove('next');
    }, timeRunningTS);
}
function showAlertTS(iconSrc, titleText, messageText) {
    var alertIcon = document.getElementById("alert_icon");
    alertIcon.src = iconSrc;
    document.getElementById("alert_title").textContent = titleText;
    document.getElementById("alert_content").textContent = messageText;
    document.getElementById('alertBox').classList.add('show');
}
function closeAlertTS() {
    document.getElementById('alertBox').classList.remove('show');
}
