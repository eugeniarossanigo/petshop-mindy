const URL_API = "https://apipetshop.herokuapp.com/api/articulos";
let cartContainer
let petShopProducts

const getAndShowData = async() => {
    try {
        const res = await fetch(URL_API)
        let data = await res.json()
        petShopProducts = data.response
        cartContainer = document.getElementById('cart-tbody-container')

        let arrayCart = filterProducts(petShopProducts)
        createProductsCart(arrayCart)
        
        
        let subtotal = document.getElementById("subtotal")
        let total = document.getElementById("total")
        let totalList = [...document.querySelectorAll('.total-price')]
        updateSubtotal(totalList, subtotal)
        updateSubtotal(totalList, total)
        
        const radioShipment = document.querySelectorAll("input[type=radio]")
        let radioShipmentArray = Array.from(radioShipment)

        radioShipmentArray.forEach(radio => {
            let checked
            radio.addEventListener("change", () => {
                checked = radioShipmentArray.filter(e => e.checked).map(e => e.value)
                calculateTotal(checked[0], subtotal, total)
            })
        })

        document.getElementById('clear-cart').addEventListener("click", () => {
            localStorage.clear()
            subtotal.textContent = 0
            total.textContent = 0
            let table = document.querySelector('.table')
            table.classList.add('d-flex')
            table.classList.add('justify-content-center')
            table.innerHTML = `<img class="kitty" src="./assets/img/gatito-carrito.png" alt="gatito"></img>`
        })

        document.getElementById('clear-btn').addEventListener("click", () => {
            localStorage.clear()
            subtotal.textContent = 0
            total.textContent = 0
            cartContainer.innerHTML = ""
        })

        cartContainer.addEventListener('click', deleteProduct);
        function deleteProduct(e) {
            if (e.target.classList.contains('delete')) {
                Swal.fire({
                    title: 'Está seguro?',
                    text: "Se eliminará permanentemente",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#576F72',
                    cancelButtonColor: '#B2675E',
                    confirmButtonText: 'Sí, borralo!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        let tr = e.target.closest("tr")
                        let value = tr.children[0].id
                        cartContainer.removeChild(tr)
                        localStorage.setItem('cartMeds', JSON.stringify(medsStorage.filter(el => el.id != value)))
                        localStorage.setItem('cartToys', JSON.stringify(toysStorage.filter(el => el.id != value)))
                        updateSubtotal(totalList, subtotal)
                        Swal.fire(
                            'Eliminado!',
                            'El producto ya no está en el carrito',
                            'success'
                        )
                    }
                })
               
            }
        }

        cartContainer.addEventListener('click', addProduct);
        function addProduct(e) {
            if (e.target.classList.contains('product-name-add')) {
                let res
                let amount = e.target.parentNode.parentNode.previousElementSibling
                let stock = Number(amount.dataset.value)
                let price = Number(amount.parentNode.children[4].textContent)
                let total = amount.parentNode.children[8]
                if (Number(amount.textContent) < stock) {
                    res = Number(amount.textContent) + 1
                    amount.innerHTML = res
                    total.innerHTML = multiply(res,price)
                    updateSubtotal(totalList, subtotal)
                } else {
                    amount.innerHTML = stock
                }
            }
        }

        cartContainer.addEventListener('click', subtractProduct);
        function subtractProduct(e) {
            if (e.target.classList.contains('product-name-subtract')) {
                let res
                let amount = e.target.parentNode.parentNode.nextElementSibling
                let stock = Number(amount.dataset.value)
                let price = Number(amount.parentNode.children[4].textContent)
                let total = amount.parentNode.children[8]
                if (Number(amount.textContent) == 1) {
                    e.target.classList.add('delete')
                    deleteProduct
                } else if (Number(amount.textContent) > 0) {
                    res = Number(amount.textContent) - 1
                    amount.innerHTML = res
                    total.innerHTML = multiply(res,price)
                    updateSubtotal(totalList, subtotal)
                }
            }
        }
        
    } catch(err) {
        console.log(err)
    }
}
getAndShowData()

let createProductsCart = (array) => {
    cartContainer.innerHTML = ""
    array.forEach(product => {
        let cartProd = document.createElement('tr');
        cartProd.id = `index-${product.id}`
        cartProd.innerHTML = `<td scope="row" id="${product.id}">🟢</td>
                            <td> <img class="cart-product-img"
                                    src="${product.img}"
                                    alt="image"></td>
                            <td>${product.name}</td>
                            <td>${product.description}</td>
                            <td class="unit-price cantidad">${product.price}</td>
                            <td>
                                <button class="border-0 bg-transparent">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4f706f"
                                        class="bi bi-dash-square product-name-subtract" style="z-index: 2;" viewBox="0 0 16 16">
                                        <path
                                            d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                    </svg></button>
                            </td>
                            <td class="amount cantidad" data-value="${product.stock}">${product.cant}</td>
                            <td>
                                <button class="border-0 bg-transparent"><svg
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4f706f"
                                    class="bi bi-plus-square product-name-add" style="z-index: 2;" viewBox="0 0 16 16">
                                    <path
                                        d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                    <path
                                        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg></button>
                            </td>
                            <td class="total-price cantidad">${product.multiplyCant(product.price, product.cant)}</td>
                            <td>
                                <button class="border-0 bg-transparent">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#4f706f"
                                        class="bi bi-trash delete" style="z-index: 2;" viewBox="0 0 16 16">
                                        <path
                                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path fill-rule="evenodd"
                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                    </svg>
                                </button>
                            </td>`
        cartContainer.appendChild(cartProd);
    })
}

let medsStorage = []
let toysStorage = []
if (localStorage.getItem('cartMeds')) {
    medsStorage = JSON.parse(localStorage.getItem('cartMeds'))
}
if (localStorage.getItem('cartToys')){
    toysStorage = JSON.parse(localStorage.getItem('cartToys'))
}

let filterProducts = (array) => {
    let newArray = []
    for (let prod of medsStorage.concat(toysStorage)) {
        array.find(elem => {
            if (elem._id === prod.id) {
                let newProduct = {
                    id: elem._id,
                    img: elem.imagen,
                    name: elem.nombre,
                    price: elem.precio,
                    description: elem.descripcion,
                    stock: elem.stock,
                    cant: prod.cant,
                    multiplyCant: function(a,b) {
                        return a*b
                    }
                }
                newArray.push(newProduct)
            }
        })
    }
    return newArray
}

let multiply = (n1, n2) => n1 * n2

let updateSubtotal = (array, container) => {
    container.textContent = array.reduce((acc, el) => acc + Number(el.textContent), 0)
}

function calculateTotal(check) {
    let res = 0
    if (check == "enviar") {
        res = Number(subtotal.textContent) + 1000
        total.textContent =res
    } else if (check == "retiro") {
        res = Number(subtotal.textContent)
        total.textContent = res
    }
}



let date = document.getElementById("actual")
let newDate = new Date().toLocaleDateString();
date.innerHTML = "Fecha de compra: "+newDate
