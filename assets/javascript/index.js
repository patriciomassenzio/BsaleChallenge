import {fetchData, buildProducts, cleanContainer} from './common';
import {NavigationPages} from '../components/NavigationPages';

const container = document.querySelector('#products');
const templatePill = document.getElementById('template-pill').content;
const fragment = document.createDocumentFragment();
const form = document.querySelector('.form-inline');

const container_categories = document.querySelector('.dropdown-menu');
let timer;

/**
 * @description La función bindEvents() agrupa todos los listener para ser ejecutados una vez se inicia la app
 */
const bindEvents = function(){
  /**
   * Listener sobre el evento keyup de la barra buscadora, recibe el timer declarado en las variables locales y 
   * si tiene un intervalo asociado lo elimina para evitar buscar por cada vez que se presiona una tecla, mejorando el rendimiento de la app
   */
  form.addEventListener('keyup', function(ev){
    ev.preventDefault();
    if(timer) window.clearInterval(timer);
    
    timer = window.setTimeout(() => {
      searchProduct();
    }, 1000);
    
  });
  /* Listener sobre la accion submit del buscador */
  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    searchProduct();
  });

  /* Listener para ejecutar el filtro de categorias */
  container_categories.addEventListener('click', async (ev) => {
    /* Se corrige bug ya que el filtro ver todo funciona con el href del html, necesita recargar la pagina por lo que no le aplicamos ev.preventDefault */
    if(ev.target.classList.contains('all')) return;
    ev.preventDefault();
    setFilter(ev);
  });
}
/**
 * @description La función cleanContainer() que se hace cargo de limpiar el contenedor de productos
 */







/**
 * @description La función buildCategories() recibe los datos del endpoint de categorias y construye mediante un template de bootstrap los elementos html con
 * la información obtenida
 * @param {Array} data Parametro que recibe la respuesta del endpoint de categorias
 */
const buildCategories = (data) => {
  data.map(({id, name}) => {
    let label = templatePill.querySelector('label');
    let input = templatePill.querySelector('input');
    label.textContent = name;
    label.setAttribute('for', name);
    label.dataset.id = id;
    input.style.display = 'none';
    input.setAttribute('id', name);

    const clone = templatePill.cloneNode(true);
    fragment.appendChild(clone);
  });
  container_categories.appendChild(fragment);
}

/**
 * @description La función searchProduct() realiza una peticion al endpoint de busqueda de productos y valida que hayan coincidencias
 */
const searchProduct = async function(){
  let inputValue = document.getElementById('search').value.toLowerCase();
  const host = 'https://bsale-challenge.herokuapp.com'; //https://bsale-challenge.herokuapp.com/

  let res = await fetch(`${host}/api/products/${inputValue}`);
  const data = await res.json();
  console.log(data);

  if (data.length == 0) {
    container.innerHTML = '<div class="container-search"><p>No se encontraron coincidencias</p><div>';
  }else {
    console.log(data)
    cleanContainer();
    buildProducts(data);
    
  } 
}


/**
 * @description La función setFilter() recibe el evento click sobre la lista de categorias en el DOM y limpia los productos para cargar 
 * solo los devueltos por el endpoint de la categoria seleccionado limpiando el contenedor de productos
 * @param {event} ev Parametro que recibe el evento del listener
 */
const setFilter = async (ev) => {
  const host = 'https://bsale-challenge.herokuapp.com'; //https://bsale-challenge.herokuapp.com/
  const res = await fetch(`${host}/api/categories/${ev.target.dataset.id}`)
  const data = await res.json();
  console.log(data);
  try{
    if(data){
      container.innerHTML = '';
      buildProducts(data);
    }
    else{
      container.innerHTML = '<p>No se encontraron coincidencias</p>';
    }
  }catch(err){
    alert(err);
  }
} 

/**
 * @description Esta función anónima ejecuta las funciones fetchData() y bindEvents() para el arranque de la app
 */
(function(){
  const product_uri = 'api/products'
  const category_uri = 'api/categories'

  fetchData(product_uri, buildProducts);
  fetchData(category_uri, buildCategories);
  bindEvents();
  new NavigationPages();
})();