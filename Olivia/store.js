//we need to check to make sure the HTML page is done loading...otherwise this JS will run, but there would be no body for it to run off of, which means it won't be able to find HTML elements referenced below b/c they haven't been generated yet
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready) //this event fires as soon as the page is done loading...when it is done loading, we'll call ready
} else {  //if the document is already done loading, we'll call ready!
    ready()
}

// We know the page is already loaded when the code gets to this point b/c of the above if-else
function ready() {
    var removeCartItemButtons = document.getElementsByClassName('btn-danger') //collection of all buttons with the class 'btn-danger'
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem) //when the button is clicked, call removeCartItem function...event listener always returns  an event object inside of the function that it calls, so we can pass in an event object as a parameter to this function removeCartItem
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    alert('Thank you for your purchase')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    //remove all of the cart items:
    while (cartItems.hasChildNodes()) //while there are children inside of the cart item 
    {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target //target is a property of event...the button we clicked is event.target
    buttonClicked.parentElement.parentElement.remove() //look at store.html...when we click the remove button, we want to remove the cart row, which is the parent of the parent of the button
    updateCartTotal() //update the total money owed in the cart after removing an item
}

function quantityChanged(event) {
    var input = event.target //the target of our event is the input element that we need
    if (isNaN(input.value) || input.value <= 0) { //make sure the value inputted in quantity is a valid value (i.e., a number > 0)
        input.value = 1 //1 is the lowest possible quantity that we want people to purchase per item
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement // this will get the 'shop-item' div
    //we can query the items inside of the shop-items div to get the shop-item-title, for example
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div') //this is a div that we can later add to our HTML...we want to add this to our 'cart-items' div
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    //before adding a new row for an item to the cart, check to make sure it's not already in the cart (if it's already in the cart, alert the user)
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) //if this is true, we've already added this item to the cart
        {
            alert("This item is already added to the cart") //popup that user can dismiss
            return //exit out of the function b/c don't want to add to cart
        }
    }
    //back ticks (``) allow you to write a string on multiple lines
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents //use innerHTML b/c we're actually using HTML elements inside of this instead of just text
    cartItems.append(cartRow) //add cartRow to the end of our cart-items
    //add event listeners to our new remove button and quantity input
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    //find the price, multiply that by the quantity, and then add that together for every row, and display that in the total
    var cartItemContainer = document.getElementsByClassName('cart-items')[0] //look at store.html...the div w/ class cart-items wraps all of the items inside the cart...we only want the first element in the array that is returned by getElementsByClassName
    var cartRows = cartItemContainer.getElementsByClassName('cart-row') //this will only get the elements inside of the cartItemContainer object that have the class name 'cart-row'
    total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value //input elements don't have inner text...they have a value associated with them
        total += price * quantity
    }
    total = Math.round(total * 100) / 100 //round the total to the nearest 2 decimal places
    document.getElementsByClassName('cart-total-price')[0].innerText = "$" + total
}