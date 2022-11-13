const container = document.querySelector('#products');
const templateCard = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment();
/**
 * @description La función fetchData() realiza una petición GET a la Rest APi para consumir sus datos. Está diseñada para cambiar el
 * endpoint(uri) y la función que manipula los datos(callback) con el fin de reutilizar el código.
 * 
 * @param {string} uri Parametro que recibe el endpoint 
 * @param {function} callback Parametro que recibe una función para manipular los datos recibidos
 */

//https://bsale-challenge.herokuapp.com/
export const fetchData = async (uri, callback) => {
  const load = document.querySelector('#cargando');
  const host = 'https://bsale-challenge.herokuapp.com';
  try {
    const res = await fetch(`${host}/${uri}`);
    const data = await res.json();
    if (data) load.style.display = 'none';
    callback(data)
  } catch(err){
    alert(err);
  }
}

/**
 * @description La función buildProducts() recibe la data resultado de fetch data y construye mediante un template de bootstrap los elementos html con
 * la información obtenida
 * @param {Array} data Parametro que recibe la respuesta del endpoint de productos
 */
export const buildProducts = (data) => {
  
  if(data.content){
    data.content.map(({url_image, name, price, id}) => {
      //Validamos que la imagen exista
      createProductCard(url_image, name, price, id);
      });
      container.appendChild(fragment);

  }else {
    data.map(({url_image, name, price, id}) => {
      //Validamos que la imagen exista
      createProductCard(url_image, name, price, id);
    });  
    container.appendChild(fragment);
  }
}

const createProductCard = (url_image, name, price, id) => {
  if(!url_image) return;
  templateCard.querySelector('.card').classList.add('zoomIn');
  templateCard.querySelector('h5').textContent = name;
  templateCard.querySelector('p').textContent = price;
  templateCard.querySelector('img').setAttribute('src', url_image);
  templateCard.querySelector('button').dataset.id = id;
  const clone = templateCard.cloneNode(true);
  fragment.appendChild(clone)
}
 
export const cleanContainer = () => {
  container.innerHTML = '';
}