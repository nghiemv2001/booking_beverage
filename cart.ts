const termCheckBoxTS = document.getElementById('terms') as HTMLInputElement | null;
const btnCheckOutTS = document.getElementById('btnCheckout') as HTMLButtonElement | null;



function fetchDataCartTS(): void {
    const tableBody = document.getElementById('productTable') as HTMLTableSectionElement | null;
    if (tableBody) {
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        fetch("https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart")
            .then(response => response.json())
            .then((data: any[]) => {
                data.forEach(item => {
                    const tr = document.createElement("tr");

                    // Image Name column
                    const tdNameImage = document.createElement("td");
                    tdNameImage.classList.add("td_name_image");

                    const img = document.createElement('img');
                    img.src = item.image;
                    img.alt = item.name; // Changed 'all' to 'alt'
                    img.classList.add('img_td_buy');

                    const nameText = document.createTextNode(item.name);
                    tdNameImage.appendChild(img);
                    tdNameImage.appendChild(nameText);

                    // Price column
                    const tdPrice = document.createElement('td');
                    tdPrice.classList.add('td_price');
                    tdPrice.textContent = `${item.price}đ`;

                    // Quantity column
                    const tdQuantity = document.createElement('td');
                    tdQuantity.classList.add('td_quantity');

                    // Create btn decrease
                    const btnDecrease = document.createElement('button');
                    btnDecrease.id = 'btn_Decrease';
                    btnDecrease.textContent = '-';
                    btnDecrease.onclick = () => updateQuantityTS(tr, -1, item);

                    const quantitySpan = document.createElement('span');
                    quantitySpan.id = 'quantity';
                    quantitySpan.textContent = item.quantity.toString();

                    const btnIncrease = document.createElement('button');
                    btnIncrease.id = 'btn_Increase';
                    btnIncrease.textContent = '+';
                    btnIncrease.onclick = () => updateQuantityTS(tr, 1, item);

                    tdQuantity.appendChild(btnDecrease);
                    tdQuantity.appendChild(quantitySpan);
                    tdQuantity.appendChild(btnIncrease);

                    // Total Column
                    const tdTotalPrice = document.createElement('td');
                    tdTotalPrice.id = 'total_price_product';
                    tdTotalPrice.textContent = `${item.price * item.quantity}đ`;

                    // Delete Button
                    const tdDeleteButton = document.createElement('td');
                    tdDeleteButton.classList.add('td_button_delete');

                    const btnDeleteItem = document.createElement('button');
                    btnDeleteItem.id = 'btn_delete_item';
                    btnDeleteItem.textContent = 'delete';
                    btnDeleteItem.onclick = () => deleteItemTS(item);

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

function sumTotalPriceTS(): void {
    const totalPriceElements = document.querySelectorAll("#productTable #total_price_product");
    let sum = 0;
    totalPriceElements.forEach(element => {
        const priceText = element.textContent?.replace('đ', '');
        sum += priceText ? parseFloat(priceText) : 0;
    });
    const sumPriceTotal = document.getElementById('sum_price_total');
    if (sumPriceTotal) {
        sumPriceTotal.textContent = `${sum}đ`;
    }
}

function updateQuantityTS(tr: HTMLTableRowElement, change: number, item: any): void {
    const quantitySpan = tr.querySelector('#quantity') as HTMLSpanElement;
    let quantity = parseInt(quantitySpan.textContent || '0') + change;
    if (quantity < 1) quantity = 1;

    quantitySpan.textContent = quantity.toString();

    const price = parseInt(tr.querySelector('.td_price')?.textContent?.replace('đ', '') || '0');
    tr.querySelector('#total_price_product')!.textContent = `${price * quantity}đ`;
    sumTotalPriceTS();
}

function showAlertTS(iconSrc: string, titleText: string, messageText: string): void {
    const alertIcon = document.getElementById("alert_icon") as HTMLImageElement | null;
    const alertTitle = document.getElementById("alert_title") as HTMLElement | null;
    const alertContent = document.getElementById("alert_content") as HTMLElement | null;
    const alertBox = document.getElementById('alertBox') as HTMLElement | null;

    if (alertIcon) alertIcon.src = iconSrc;
    if (alertTitle) alertTitle.textContent = titleText;
    if (alertContent) alertContent.textContent = messageText;
    if (alertBox) alertBox.classList.add('show');
}

function closeAlertTS(): void {
    const alertBox = document.getElementById('alertBox') as HTMLElement | null;
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


btnCheckOutTS?.addEventListener('click', function () {
    fetch('https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart')
        .then(response => response.json())
        .then((data: any[]) => {
            const deleteAllTS = data.map(item => {
                return fetch(`https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart/${item.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            });
            Promise.all(deleteAllTS)
                .then(() => {
                    showAlertTS("../assets/icons/ic_success.svg", "Thank you!", "We will deliver for you as soon as possible.");
                    fetchDataCartTS();
                })
                .catch(error => {
                    console.error('Error deleting:', error);
                    showAlertTS("../assets/icons/ic_fail.svg", "Sorry", "Something went wrong, Payment not successful.");
                });
        })
        .catch(error => {
            console.error('Error fetching cart items:', error);
            showAlertTS("../assets/icons/ic_fail.svg", "Sorry", "Something went wrong.");
        });
});

function deleteItemTS(item: any): void {
    fetch(`https://66cdf1758ca9aa6c8ccc4e79.mockapi.io/cart/${item.id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        response.json();
        showAlertTS("../assets/icons/ic_success.svg", "Good Job!", "Item successfully deleted.");
        fetchDataCartTS();
        sumTotalPriceTS();
    })
    .catch(error => {
        console.log('Error deleting item from cart', error);
        showAlertTS("../assets/icons/ic_fail.svg", "Sorry", "Something went wrong.");
    });
}