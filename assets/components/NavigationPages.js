import {fetchData, buildProducts, cleanContainer} from '../javascript/common';

export class NavigationPages {
  constructor(){
    //Traer el template
    //Multiplicar el template
    //Conectar el endpoint con paginacion
    //pasarle los numeros de las paginas
    //Añadirle evento click y pasar emediante params el numero de la pagina
    this.template = document.getElementById('navigation-pages-template').content;
    this.fragment = document.createDocumentFragment();
    this.containerPages = document.querySelector('#navigation-pages');
    this.containerProducts = document.getElementById('#products');
    this.arrowRight = document.querySelector('.arrow-right');
    this.arrowLeft = document.querySelector('.arrow-left');
  
    this.currentPage = 0;
    this.selector = null;
    
    this.bindEvents();
    this.buildPages();
  }

  bindEvents = () => {
    this.containerPages.addEventListener('click', this.pagination);
    this.arrowRight.addEventListener('click', this.nextPage);
    this.arrowLeft.addEventListener('click', this.prevPage);
  }

  pagination = (ev) => {
    ev.preventDefault();
    if(ev.target.classList.contains('label')){
      //console.log(ev.target.dataset.id);
      this.cleanStylesPages();
      if(this.selector !== null) this.selector.classList.remove('selected-page');
      this.selector = ev.target;
      this.currentPage = ev.target.dataset.id - 1;
      this.selector.classList.add('selected-page');
      
      cleanContainer();
      fetchData(`api/products?page=${this.currentPage}`, buildProducts)
    }
  }

  buildPages = async () => {
    let totalPages = await this.countPages();
    
    for (var index = 0 ; index < totalPages; ) {
      ++index
      let label = this.template.querySelector('label');
      let input = this.template.querySelector('input');
      label.textContent = index;
      label.setAttribute('for', index);
      label.dataset.id = index;
      input.style.display = 'none';
      input.setAttribute('id', index);
      const clone = this.template.cloneNode(true);
      
      this.fragment.appendChild(clone);
      
    }
    this.containerPages.appendChild(this.fragment);
    //Se agrega la clase selected item al primer elemento ya que la primera pagina viene pre cargada
    this.containerPages.firstElementChild.classList.add('selected-page');
  }

  /**
   * 
   * @returns total de paginas
   */
  countPages = async () => {
    const res = await fetch(`https://bsale-challenge.herokuapp.com/api/products`);
    const data = await res.json();

    return data.totalPages;
  }

  cleanStylesPages = () => {
    let childs = this.containerPages.children;
 
    for (let i = 0; i < childs.length; i++) {
      let child = childs[i];
      child.classList.remove('selected-page');
    }

  }
  //tengo el id de la pagina actual 
  //le sumo 1 y hago fetch para obtener la pagina siguiente
  //debo traer el total de paginas para saber cuando llego a la última pagina
  nextPage = async (ev) => {    
    ev.preventDefault();
    let totalPages = await this.countPages();
    let childs = this.containerPages.children;
    
    --totalPages;
   //Cuando llegue a la última página, se regresa a la primera
    if(this.currentPage >= totalPages) this.currentPage = -1;
    ++this.currentPage;
    let newPage = this.currentPage; 

  //Se elimina clase del selector manual
    if(this.selector) this.selector.classList.remove('selected-page');

    this.cleanStylesPages();
    childs[newPage].classList.add('selected-page');

    cleanContainer();
    fetchData(`api/products?page=${newPage}`, buildProducts); 
  }

  prevPage = async (ev) => {    
    ev.preventDefault();
    let totalPages = await this.countPages(); 

    //Cuando llegue a la última página, se regresa a la primera
    if(this.currentPage <= 0) this.currentPage = totalPages;
    --this.currentPage;
    let newPage = this.currentPage; 
    //Asigno los hijos del div a la variable childs
    let childs = this.containerPages.children;

    //Se elimina clase del selector manual
    if(this.selector) this.selector.classList.remove('selected-page');

    this.cleanStylesPages();
    childs[newPage].classList.add('selected-page');

    cleanContainer();
    fetchData(`api/products?page=${newPage}`, buildProducts);
  }
}
