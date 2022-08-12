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
      filters(petShopProducts);
    } else {
      cardContainer = document.getElementById('toys-products-container')
      petShopProducts = data.response.filter(product => product.tipo === "Juguete");
      filters(petShopProducts);
    }
    cardGenerator(petShopProducts, cardContainer);
    descriptionProduct();
  } catch (error) {
    console.log(error);
  }
}
fetchData(URL_API);

function descriptionProduct() {
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );
}

function cardGenerator(arrayProducts) {
  cardContainer.innerHTML = ''
  arrayProducts.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("card-personal");
    card.innerHTML = `    
    <img src="${product.imagen}" class="card-img-top card-img-personal" alt="Imagen de producto">
              <div class="card-body d-flex flex-column justify-content-between">
              <button type="reset" class="btn btn-details" data-bs-container="body" data-bs-toggle="popover"
              data-bs-placement="top"
              data-bs-content="${product.descripcion}">
              Descripción del producto <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
              </svg>
              </button>
              <h5 class="card-title text-center">${product.nombre}</h5>
              <p>$ ${product.precio}</p>
              <p id="alert-stock">${product.stock < 3 ? "¡ÚLTIMAS UNIDADES!" : ""}</p>       
              <p id="stock" value="${product.stock}">Stock: ${product.stock}</p>
              <button class="btn btn-personal" value="${product.stock}" onclick="addToCart('${product.tipo}','${product._id}', ${product.stock})">Agregar al carrito</button>`;
              cardContainer.appendChild(card);
  });

  if (arrayProducts.length === 0) {
    let img = document.createElement('img')
    img.src = "./assets/img/notfoundcat.png"
    img.classList = "img-error"
    cardContainer.appendChild(img)
  }
}


let cant = 0
let idsAndCantMeds = []
let idsAndCantToys = []
let addToCart = (category, id, stock) => {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Tu producto fue agregado con éxito',
    showConfirmButton: false,
    timer: 1500
  })
  if (category === "Medicamento") {
    let newObject = {
      id: id,
      cant: cant
    }
    let newId = id
    let newCant = cant
    let objectIndex = {}
    if (idsAndCantMeds.length > 0) {
      idsAndCantMeds.find(obj => {
        if (obj.id.includes(newId)) {
          newObject = {
            id: newId,
            cant: obj.cant
          }
        } else {
          newObject = {
            id: newId,
            cant: newCant
          }
        }
      })
    }
    objectIndex = idsAndCantMeds.find(obj => obj.id === newId)
    if (idsAndCantMeds.indexOf(objectIndex) == 0) {
      let objectTemp = objectIndex
      newObject = objectTemp
      if (newObject.cant < stock) {
        idsAndCantMeds.shift()
        newObject.cant += 1
        idsAndCantMeds.push(newObject)
      } else {
        newObject.cant = stock
      }
    } else {
      if (newObject.cant < stock) {
        idsAndCantMeds.splice(idsAndCantMeds.indexOf(objectIndex), idsAndCantMeds.indexOf(objectIndex))
        newObject.cant += 1
        idsAndCantMeds.push(newObject)
      } else {
        newObject.cant = stock + 1
      }
    }
    // idsAndCantMeds.push(newObject)
    localStorage.setItem('cartMeds', JSON.stringify(idsAndCantMeds))
  } else{
    let newObject = {
      id: id,
      cant: cant
    }
    let newId = id
    let newCant = cant
    let objectIndex = {}
    if (idsAndCantToys.length > 0) {
      idsAndCantToys.find(obj => {
        if (obj.id.includes(newId)) {
          newObject = {
            id: newId,
            cant: obj.cant
          }
        } else {
          newObject = {
            id: newId,
            cant: newCant
          }
        }
      })
    }
    objectIndex = idsAndCantToys.find(obj => obj.id === newId)
    if (idsAndCantToys.indexOf(objectIndex) == 0) {
      let objectTemp = objectIndex
      newObject = objectTemp
      if (newObject.cant < stock) {
        idsAndCantToys.shift()
        newObject.cant += 1
        idsAndCantMeds.push(newObject)
      } else {
        newObject.cant = stock
      }
    } else {
      if (newObject.cant < stock) {
        idsAndCantToys.splice(idsAndCantToys.indexOf(objectIndex), idsAndCantToys.indexOf(objectIndex))
        newObject.cant += 1
        idsAndCantToys.push(newObject)
      } else {
        newObject.cant = stock + 1
      }
      localStorage.setItem('cartToys', JSON.stringify(idsAndCantToys))
    }
  }
}

function orderFilterAs(arrayProducts) {
  return arrayProducts.sort((a, b) => a.precio - b.precio)
}

function orderFilterDes(arrayProducts) {
  return arrayProducts.sort((a, b) => b.precio - a.precio)
}

function filters(arrayProducts) {
  let select = document.querySelector('select')
  select.addEventListener('change', () => {
    if (select.value == 1) {
      cardGenerator(orderFilterAs(arrayProducts))
      descriptionProduct()
    } else if (select.value == 2) {
      cardGenerator(orderFilterDes(arrayProducts))
      descriptionProduct()
    } else {
      cardGenerator(arrayProducts)
      descriptionProduct()
    }
  })
  let searchbar = document.getElementById('searchbar')
  searchbar.addEventListener('keyup', () => {
    cardGenerator(searchText(arrayProducts, searchbar.value))
    descriptionProduct();
  })
};

function searchText(arrayProducts, text) {
  let filteredSearchProducts = arrayProducts.filter(product => product.nombre.toLowerCase().includes(text.toLowerCase()))
  return filteredSearchProducts
}
