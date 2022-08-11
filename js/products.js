const URL_API = "https://apipetshop.herokuapp.com/api/articulos";
let cardContainer
let petShopProducts

async function fetchData(url) {
  try {
    let res = await fetch(url);
    let data = await res.json();
    if (document.getElementById('medicine-products-container')) {
        cardContainer = document.getElementById('medicine-products-container')
        petShopProducts = data.response.filter(product => product.tipo === "Medicamento");

        // petShopPrice = petShopProducts.filter(product => product.precio);
        // const priceIncrease = petShopPrice.sort((a, b) => {
        //     return a.precio - b.precio;
        // });
        // console.log(priceIncrease)
    }else {
        cardContainer = document.getElementById('toys-products-container')
        petShopProducts = data.response.filter(product => product.tipo === "Juguete");
    }
    cardGenerator(petShopProducts, cardContainer);
    descriptionProduct();
  } catch (error) {
    console.log(error);
  }
}
fetchData(URL_API);

function descriptionProduct(){
    const popoverTriggerList = document.querySelectorAll(
        '[data-bs-toggle="popover"]'
      );
      const popoverList = [...popoverTriggerList].map(
        (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
      );
}

function cardGenerator(petShopProducts) {
    cardContainer.innerHTML = ''
    petShopProducts.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("card-personal");
    card.innerHTML = `
        <img src="${
          product.imagen
        }" class="card-img-top card-img-personal" alt="...">
        <div class="card-body d-flex flex-column justify-content-between gap-2">
        <button type="button" class="btn btn-details" data-bs-container="body" data-bs-toggle="popover"
        data-bs-placement="top"
        data-bs-content="${product.descripcion}">
        Descripción del producto <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
      </svg>
        </button>
        <h5 class="card-title text-center">${product.nombre}</h5>
        
        <p>$ ${product.precio}</p>
        <p id="alert-stock">${product.stock < 3 ? "¡ÚLTIMAS UNIDADES!" : ""}</p>
        <td>
                                <button class="border-0 bg-transparent" id="product-name-add"><svg
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4f706f"
                                    class="bi bi-plus-square" viewBox="0 0 16 16">
                                    <path
                                        d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                    <path
                                        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg></button>
                            </td>
                            <td class="amount cantidad">1</td>
                            <td>
                                <!-- Id de botón para restar será el nombre del producto + "subtract" -->
                                <button class="border-0 bg-transparent" id="product-name-subtract"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4f706f"
                                        class="bi bi-dash-square" viewBox="0 0 16 16">
                                        <path
                                            d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                    </svg></button>
                            </td>
        <p>Stock: ${product.stock}</p>
        <button type="button" class="btn btn-personal" id="liveToastBtn">Agregar al carritooo</button>
                    <div class="toast-container position-fixed bottom-0 end-0 p-3">
                        <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-header">
                                <strong class="me-auto">SE AGREGÓ CON ÉXITO AL CARRITO!</strong>
                                <button type="button" class="btn-close" data-bs-dismiss="toast"
                                    aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
        `;
    cardContainer.appendChild(card);
});
}







// const select = document.querySelectorAll('option')
// const arraySelect = Array.from(document.querySelectorAll('option'));
// const sortoptions = arraySelect.map( e => e.value)
// console.log(select)
// console.log(arraySelect)
// console.log(sortoptions)

// select.addEventListener('change', () => {
//         if (sortoptions.length == '1') {
//             return console.log('menor a mayor')
//         } else {
//             return console.log('mayor a menor')
//         }
//     });
// priceSort.addEventListener('change', () => {
//     if (priceSort.value === '1') {
//         return console.log('menor a mayor')
//     } else {
//         return console.log('mayor a menor')
//     }
// });

// const searchbar = document.getElementById('searchbar')

// searchbar.addEventListener('input', () => {
//     console.log('bien')
// });
