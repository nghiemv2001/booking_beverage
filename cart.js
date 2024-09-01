var termCheckBoxTS = document.getElementById('terms');
var btnCheckOutTS = document.getElementById('btnCheckout');
function fetchDataCartTS() {
    var tableBody = document.getElementById('productTable');
    if (tableBody) {
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        fetch("https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart")
            .then(function (response) { return response.json(); })
            .then(function (data) {
            data.forEach(function (item) {
                var tr = document.createElement("tr");
                // Image Name column
                var tdNameImage = document.createElement("td");
                tdNameImage.classList.add("td_name_image");
                var img = document.createElement('img');
                img.src = item.image;
                img.alt = item.name; // Changed 'all' to 'alt'
                img.classList.add('img_td_buy');
                var nameText = document.createTextNode(item.name);
                tdNameImage.appendChild(img);
                tdNameImage.appendChild(nameText);
                // Price column
                var tdPrice = document.createElement('td');
                tdPrice.classList.add('td_price');
                tdPrice.textContent = "".concat(item.price, "\u0111");
                // Quantity column
                var tdQuantity = document.createElement('td');
                tdQuantity.classList.add('td_quantity');
                // Create btn decrease
                var btnDecrease = document.createElement('button');
                btnDecrease.id = 'btn_Decrease';
                btnDecrease.textContent = '-';
                btnDecrease.onclick = function () { return updateQuantityTS(tr, -1, item); };
                var quantitySpan = document.createElement('span');
                quantitySpan.id = 'quantity';
                quantitySpan.textContent = item.quantity.toString();
                var btnIncrease = document.createElement('button');
                btnIncrease.id = 'btn_Increase';
                btnIncrease.textContent = '+';
                btnIncrease.onclick = function () { return updateQuantityTS(tr, 1, item); };
                tdQuantity.appendChild(btnDecrease);
                tdQuantity.appendChild(quantitySpan);
                tdQuantity.appendChild(btnIncrease);
                // Total Column
                var tdTotalPrice = document.createElement('td');
                tdTotalPrice.id = 'total_price_product';
                tdTotalPrice.textContent = "".concat(item.price * item.quantity, "\u0111");
                // Delete Button
                var tdDeleteButton = document.createElement('td');
                tdDeleteButton.classList.add('td_button_delete');
                var btnDeleteItem = document.createElement('button');
                btnDeleteItem.id = 'btn_delete_item';
                btnDeleteItem.textContent = 'delete';
                btnDeleteItem.onclick = function () { return deleteItemTS(item); };
                tdDeleteButton.appendChild(btnDeleteItem);
                tr.appendChild(tdNameImage);
                tr.appendChild(tdPrice);
                tr.appendChild(tdQuantity);
                tr.appendChild(tdTotalPrice);
                tr.appendChild(tdDeleteButton);
                tableBody.appendChild(tr);
                sumTotalPriceTS();
            });
        });
    }
    sumTotalPriceTS();
}
fetchDataCartTS();
function sumTotalPriceTS() {
    var totalPriceElements = document.querySelectorAll("#productTable #total_price_product");
    var sum = 0;
    totalPriceElements.forEach(function (element) {
        var _a;
        var priceText = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.replace('đ', '');
        sum += priceText ? parseFloat(priceText) : 0;
    });
    var sumPriceTotal = document.getElementById('sum_price_total');
    if (sumPriceTotal) {
        sumPriceTotal.textContent = "".concat(sum, "\u0111");
    }
}
function updateQuantityTS(tr, change, item) {
    var _a, _b;
    var quantitySpan = tr.querySelector('#quantity');
    var quantity = parseInt(quantitySpan.textContent || '0') + change;
    if (quantity < 1)
        quantity = 1;
    quantitySpan.textContent = quantity.toString();
    var price = parseInt(((_b = (_a = tr.querySelector('.td_price')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace('đ', '')) || '0');
    tr.querySelector('#total_price_product').textContent = "".concat(price * quantity, "\u0111");
    sumTotalPriceTS();
}
function showAlertTS(iconSrc, titleText, messageText) {
    var alertIcon = document.getElementById("alert_icon");
    var alertTitle = document.getElementById("alert_title");
    var alertContent = document.getElementById("alert_content");
    var alertBox = document.getElementById('alertBox');
    if (alertIcon)
        alertIcon.src = iconSrc;
    if (alertTitle)
        alertTitle.textContent = titleText;
    if (alertContent)
        alertContent.textContent = messageText;
    if (alertBox)
        alertBox.classList.add('show');
}
function closeAlertTS() {
    var alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.classList.remove('show');
    }
}
if (termCheckBoxTS && btnCheckOutTS) {
    btnCheckOutTS.disabled = !termCheckBoxTS.checked;
    termCheckBoxTS.addEventListener('change', function () {
        if (btnCheckOutTS) {
            btnCheckOutTS.disabled = !this.checked;
        }
    });
}
btnCheckOutTS === null || btnCheckOutTS === void 0 ? void 0 : btnCheckOutTS.addEventListener('click', function () {
    fetch('https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var deleteAllTS = data.map(function (item) {
            return fetch("https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart/".concat(item.id), {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        });
        Promise.all(deleteAllTS)
            .then(function () {
            showAlertTS("../assets/icons/ic_success.svg", "Thank you!", "We will deliver for you as soon as possible.");
            fetchDataCartTS();
        })
            .catch(function (error) {
            console.error('Error deleting:', error);
            showAlertTS("../assets/icons/ic_fail.svg", "Sorry", "Something went wrong, Payment not successful.");
        });
    })
        .catch(function (error) {
        console.error('Error fetching cart items:', error);
        showAlertTS("../assets/icons/ic_fail.svg", "Sorry", "Something went wrong.");
    });
});
function deleteItemTS(item) {
    fetch("https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart/".concat(item.id), {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
        response.json();
        showAlertTS("../assets/icons/ic_success.svg", "Good Job!", "Item successfully deleted.");
        fetchDataCartTS();
        sumTotalPriceTS();
    })
        .catch(function (error) {
        console.log('Error deleting item from cart', error);
        showAlertTS("../assets/icons/ic_fail.svg", "Sorry", "Something went wrong.");
    });
}
