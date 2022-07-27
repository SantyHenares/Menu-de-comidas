let botonCarrito = document.getElementById("carrito");
let carrito = 0, cantidad = 0, precio = 0;
const arrayProductos = [];
const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };

class listaDeCompra {
    constructor(nombre, cantidad, precio) {
        this.nombre = nombre;
        this.cantidad = Number(cantidad);
        this.total = cantidad * precio;
    }
}

function evento(nombre, producto) {
    nombre.onclick = () => {
        Swal.fire({
            title: '¿Cuántos quéres comprar?',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,

        }).then((result) => {

            if (result.isConfirmed) {

                arrayProductos.push(new listaDeCompra(producto.nombre, result.value, producto.precio));

                guardarLocal("listaDeCompra", JSON.stringify(arrayProductos));

                Toastify({
                    text: `Agregaste ${result.value} ${producto.nombre} al carrito.`,
                    duration: 5000,
                    gravity: "bottom",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #ff6426, #fc4f0a)",
                    },
                }).showToast();
            }
        })
    }
}

botonCarrito.onclick = () => {
    let aPagar = 0;

    const almacenado = JSON.parse(localStorage.getItem("listaDeCompra"));
    const listaCarrito = [];

    if (almacenado.length != 0) {
        for (const objetos of almacenado) {
            listaCarrito.push(new listaDeCompra(objetos));
            aPagar = aPagar + objetos.total;
        }
    } else {
        aPagar = 0;
    }

    Swal.fire({
        title: `El total a pagar es de ${aPagar}.`,
        html: '<div id="carrito-contenedor"> </div>',
        confirm: "Ok",
        showCancelButton: true,
        cancelButtonText: 'Vaciar carrito.',
    }).then((result) => {
        if (result.isDismissed) {
            arrayProductos.splice(0, arrayProductos.length);
            guardarLocal("listaDeCompra", JSON.stringify(arrayProductos));
        }
    })

    renderProductosCarrito(almacenado);
}

const nuestrosProductos = document.getElementById('listado');

const listadoDeProductos = async () => {
    const resp = await fetch('public/stock.json')
    const data = await resp.json()

    data.forEach(product => {
        const div = document.createElement('div');
        div.classList.add('col-sm-6');
        div.innerHTML = `
                <div class="single_food_item media">
                    <img src="img/food_menu/single_food_${product.id}.png" class="mr-3" alt="...">
                    <div class="media-body align-self-center">
                        <h3>${product.nombre}</h3>
                        <p>${product.descripcion}</p>
                        <h5>$${product.precio}</h5>
                        <a class="d-flex justify-content-end pr-4 " id="boton${product.id}"><i class="material-icons puntero">add_shopping_cart</i></a>
                    </div>
                </div>
            `
        nuestrosProductos.appendChild(div);
        const botonCompra = document.getElementById(`boton${product.id}`);
        evento(botonCompra, product);

    });
}

listadoDeProductos()

const renderProductosCarrito = (carritoDeCompras) => {
    const contenedor = document.getElementById('carrito-contenedor');

    contenedor.innerHTML = "";

    carritoDeCompras.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('productoEnCarrito');
        div.innerHTML = `<div class=" d-flex justify-content-between"> 
                        <p>${producto.nombre}</p>
                        <p>Cantidad:${producto.cantidad}</p>
                        <p>Precio:${producto.total}</p>
                        </div>
                      `
        contenedor.appendChild(div);
    });
};