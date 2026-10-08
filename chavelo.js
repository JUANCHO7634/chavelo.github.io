// 1. PRODUCTOS (los originales; se usan la primera vez o al restablecer)
const productosOriginales = [
    { id: 1, nombre: "Bocina JBL Xtreme", categoria: "Accesorios", subcategoria: "Bocinas", precio: 2500, imagen: "https://tse2.mm.bing.net/th/id/OIP.iKDDgnk0KAfiTWgHugvC2gHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 2, nombre: "Bocina JBL Boombox", categoria: "Accesorios", subcategoria: "Bocinas", precio: 5800, imagen: "img/1000140513.jpg" },
    { id: 3, nombre: "Bocina JBL Go", categoria: "Accesorios", subcategoria: "Bocinas", precio: 800, imagen: "img/1000140511.jpg" },
    { id: 4, nombre: "AirPods Pro", categoria: "Accesorios", subcategoria: "Audífonos", precio: 4500, imagen: "img/1000140501.jpg" },
    { id: 5, nombre: "AirPods 3ra Gen", categoria: "Accesorios", subcategoria: "Audífonos", precio: 3200, imagen: "img/1000140503.jpg" },
    { id: 6, nombre: "Funda MagSafe", categoria: "Accesorios", subcategoria: "Cases", precio: 500, imagen: "img/1000140507.jpg" },
    { id: 7, nombre: "Cartera MagSafe Piel", categoria: "Accesorios", subcategoria: "Cases", precio: 1200, imagen: "img/1000140519.jpg" },
    { id: 8, nombre: "Batería MagSafe", categoria: "Electrónica", subcategoria: "Pilas", precio: 1800, imagen: "img/1000140517.jpg" },
    { id: 9, nombre: "Cargador Inalámbrico", categoria: "Electrónica", subcategoria: "Cargadores", precio: 750, imagen: "img/1000140509.jpg" },
    { id: 10, nombre: "Cubo 20W USB-C", categoria: "Electrónica", subcategoria: "Cargadores", precio: 400, imagen: "img/1000140505.jpg" },
    { id: 11, nombre: "Perfume Nocturno", categoria: "Personal", subcategoria: "Perfumes", precio: 1900, imagen: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=80" },
    { id: 12, nombre: "Pulsera de Cuero", categoria: "Personal", subcategoria: "Pulseras", precio: 350, imagen: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80" },
    { id: 13, nombre: "Gorra Urbana", categoria: "Personal", subcategoria: "Gorras", precio: 700, imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80" }
];

const STORAGE_KEY = "neonstore_productos";

function cargarProductos() {
    try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        if (guardado) return JSON.parse(guardado);
    } catch (e) { console.warn("No se pudo leer el almacenamiento", e); }
    return productosOriginales.map(p => ({ ...p }));
}

function guardarProductos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
    } catch (e) {
        alert("No se pudo guardar (almacenamiento lleno). Prueba con imágenes más pequeñas o usa links.");
    }
}

let productos = cargarProductos();

// Estado de la aplicación
let carrito = [];
let filtroActual = "Todos";
let imagenSubida = ""; // imagen en base64 si se sube archivo

// Utilidad: evita que texto escrito rompa el HTML
function esc(str) {
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Categorías dinámicas (se generan según los productos)
function obtenerCategorias() {
    return ["Todos", ...new Set(productos.map(p => p.categoria))];
}

// Elementos del DOM
const productsContainer = document.getElementById("products-container");
const filtersContainer = document.getElementById("filters-container");
const cartOverlay = document.getElementById("cart-overlay");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartCounter = document.getElementById("cart-counter");
const checkoutBtn = document.getElementById("checkout-btn");

// Admin
const adminOverlay = document.getElementById("admin-overlay");
const inpId = document.getElementById("prod-id");
const inpNombre = document.getElementById("prod-nombre");
const inpCategoria = document.getElementById("prod-categoria");
const inpSubcategoria = document.getElementById("prod-subcategoria");
const inpPrecio = document.getElementById("prod-precio");
const inpArchivo = document.getElementById("prod-archivo");
const inpUrl = document.getElementById("prod-url");
const imgPreview = document.getElementById("img-preview");
const imgPreviewTag = document.getElementById("img-preview-tag");
const formTitle = document.getElementById("form-title");
const adminListContainer = document.getElementById("admin-list-container");

// 2. FILTROS
function renderFilters() {
    const categorias = obtenerCategorias();
    if (!categorias.includes(filtroActual)) filtroActual = "Todos";
    filtersContainer.innerHTML = "";
    categorias.forEach(cat => {
        const btn = document.createElement("button");
        btn.classList.add("filter-btn");
        if (cat === filtroActual) btn.classList.add("active");
        btn.innerText = cat;
        btn.onclick = () => {
            filtroActual = cat;
            renderFilters();
            renderProducts();
        };
        filtersContainer.appendChild(btn);
    });
}

// 3. PRODUCTOS
function renderProducts() {
    productsContainer.innerHTML = "";
    const filtrados = filtroActual === "Todos" ? productos : productos.filter(p => p.categoria === filtroActual);

    if (filtrados.length === 0) {
        productsContainer.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#64748b;">No hay productos todavía.</p>`;
        return;
    }

    filtrados.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <div class="tags">
                <span class="tag">${esc(producto.categoria)}</span>
                <span class="tag sub">${esc(producto.subcategoria)}</span>
            </div>
            <div class="product-img-container">
                <img src="${esc(producto.imagen)}" alt="${esc(producto.nombre)}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${esc(producto.nombre)}</h3>
                <div class="product-bottom">
                    <span class="product-price">$${Number(producto.precio).toLocaleString()}</span>
                    <button class="add-btn" onclick="agregarAlCarrito(${producto.id})">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

// 4. CARRITO
window.agregarAlCarrito = (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    const itemEnCarrito = carrito.find(item => item.id === id);
    if (itemEnCarrito) itemEnCarrito.cantidad++;
    else carrito.push({ ...producto, cantidad: 1 });
    actualizarCarrito();
    openCartBtn.style.transform = "scale(1.2)";
    setTimeout(() => openCartBtn.style.transform = "scale(1)", 200);
};

window.cambiarCantidad = (id, delta) => {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) carrito = carrito.filter(i => i.id !== id);
    }
    actualizarCarrito();
};

window.eliminarItem = (id) => {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
};

function actualizarCarrito() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let cantidadItems = 0;

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart"><i class="fa-solid fa-cart-shopping fa-3x"></i><p>El carrito está vacío</p></div>`;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        carrito.forEach(item => {
            total += item.precio * item.cantidad;
            cantidadItems += item.cantidad;
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <div class="cart-item-img"><img src="${esc(item.imagen)}" alt="${esc(item.nombre)}"></div>
                <div class="cart-item-info">
                    <h4>${esc(item.nombre)}</h4>
                    <span class="price">$${(item.precio * item.cantidad).toLocaleString()}</span>
                    <div class="cart-controls">
                        <button onclick="cambiarCantidad(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                        <span>${item.cantidad}</span>
                        <button onclick="cambiarCantidad(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <button class="remove-btn" onclick="eliminarItem(${item.id})"><i class="fa-solid fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    cartTotalPrice.innerText = `$${total.toLocaleString()}`;
    if (cantidadItems > 0) {
        cartCounter.innerText = cantidadItems;
        cartCounter.classList.remove("hidden");
    } else {
        cartCounter.classList.add("hidden");
    }
}

// 5. ABRIR / CERRAR CARRITO
openCartBtn.addEventListener("click", () => cartOverlay.classList.add("active"));
closeCartBtn.addEventListener("click", () => cartOverlay.classList.remove("active"));
cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) cartOverlay.classList.remove("active");
});

// 6. PANEL DE ADMINISTRACIÓN
document.getElementById("open-admin-btn").addEventListener("click", () => {
    renderAdmin();
    adminOverlay.classList.add("active");
});
document.getElementById("close-admin-btn").addEventListener("click", () => adminOverlay.classList.remove("active"));
adminOverlay.addEventListener("click", (e) => {
    if (e.target === adminOverlay) adminOverlay.classList.remove("active");
});

// Vista previa de la imagen
function mostrarPreview(src) {
    if (src) {
        imgPreviewTag.src = src;
        imgPreview.classList.add("show");
    } else {
        imgPreview.classList.remove("show");
    }
}

// Subir archivo: se reduce a 600px para no llenar el almacenamiento
inpArchivo.addEventListener("change", () => {
    const file = inpArchivo.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
            const max = 600;
            const escala = Math.min(1, max / Math.max(img.width, img.height));
            const canvas = document.createElement("canvas");
            canvas.width = img.width * escala;
            canvas.height = img.height * escala;
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            imagenSubida = canvas.toDataURL("image/jpeg", 0.8);
            inpUrl.value = "";
            mostrarPreview(imagenSubida);
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
});

inpUrl.addEventListener("input", () => {
    imagenSubida = "";
    mostrarPreview(inpUrl.value.trim());
});

function limpiarFormulario() {
    inpId.value = "";
    inpNombre.value = "";
    inpCategoria.value = "";
    inpSubcategoria.value = "";
    inpPrecio.value = "";
    inpArchivo.value = "";
    inpUrl.value = "";
    imagenSubida = "";
    mostrarPreview("");
    formTitle.innerText = "Agregar producto";
}
document.getElementById("cancel-edit-btn").addEventListener("click", limpiarFormulario);

// Guardar (crear o editar)
document.getElementById("save-product-btn").addEventListener("click", () => {
    const nombre = inpNombre.value.trim();
    const categoria = inpCategoria.value.trim();
    const subcategoria = inpSubcategoria.value.trim();
    const precio = parseFloat(inpPrecio.value);
    const imagen = imagenSubida || inpUrl.value.trim();

    if (!nombre || !categoria || !subcategoria || isNaN(precio) || precio < 0 || !imagen) {
        alert("Completa todos los campos: nombre, categoría, subcategoría, precio e imagen.");
        return;
    }

    if (inpId.value) {
        const p = productos.find(x => x.id === Number(inpId.value));
        if (p) Object.assign(p, { nombre, categoria, subcategoria, precio, imagen });
    } else {
        const nuevoId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productos.push({ id: nuevoId, nombre, categoria, subcategoria, precio, imagen });
    }

    guardarProductos();
    // Si el producto editado está en el carrito, lo actualizamos
    carrito = carrito.map(item => {
        const p = productos.find(x => x.id === item.id);
        return p ? { ...p, cantidad: item.cantidad } : item;
    });
    limpiarFormulario();
    refrescarTodo();
});

// Editar / eliminar desde la lista del admin
window.editarProducto = (id) => {
    const p = productos.find(x => x.id === id);
    if (!p) return;
    inpId.value = p.id;
    inpNombre.value = p.nombre;
    inpCategoria.value = p.categoria;
    inpSubcategoria.value = p.subcategoria;
    inpPrecio.value = p.precio;
    inpUrl.value = p.imagen.startsWith("data:") ? "" : p.imagen;
    imagenSubida = p.imagen.startsWith("data:") ? p.imagen : "";
    mostrarPreview(p.imagen);
    formTitle.innerText = "Editando: " + p.nombre;
    document.getElementById("admin-form").scrollIntoView({ behavior: "smooth" });
};

window.borrarProducto = (id) => {
    const p = productos.find(x => x.id === id);
    if (!p || !confirm(`¿Eliminar "${p.nombre}"?`)) return;
    productos = productos.filter(x => x.id !== id);
    carrito = carrito.filter(x => x.id !== id);
    guardarProductos();
    refrescarTodo();
};

document.getElementById("reset-btn").addEventListener("click", () => {
    if (!confirm("Se borrarán tus cambios y volverán los productos originales. ¿Continuar?")) return;
    localStorage.removeItem(STORAGE_KEY);
    productos = productosOriginales.map(p => ({ ...p }));
    carrito = [];
    limpiarFormulario();
    refrescarTodo();
});

function renderAdmin() {
    document.getElementById("admin-count").innerText = productos.length;
    adminListContainer.innerHTML = "";
    productos.forEach(p => {
        const row = document.createElement("div");
        row.classList.add("admin-item");
        row.innerHTML = `
            <img src="${esc(p.imagen)}" alt="">
            <div class="admin-item-info">
                <strong>${esc(p.nombre)}</strong>
                <small>${esc(p.categoria)} · ${esc(p.subcategoria)} · $${Number(p.precio).toLocaleString()}</small>
            </div>
            <button title="Editar" onclick="editarProducto(${p.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="del" title="Eliminar" onclick="borrarProducto(${p.id})"><i class="fa-solid fa-trash"></i></button>
        `;
        adminListContainer.appendChild(row);
    });
    // Sugerencias de categorías y subcategorías
    document.getElementById("lista-categorias").innerHTML =
        [...new Set(productos.map(p => p.categoria))].map(c => `<option value="${esc(c)}">`).join("");
    document.getElementById("lista-subcategorias").innerHTML =
        [...new Set(productos.map(p => p.subcategoria))].map(c => `<option value="${esc(c)}">`).join("");
}

function refrescarTodo() {
    renderFilters();
    renderProducts();
    renderAdmin();
    actualizarCarrito();
}

// Iniciar aplicación
renderFilters();
renderProducts();
actualizarCarrito();
