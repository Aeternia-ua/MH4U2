let routesArr = [];

const router = () => {
  const path = parseLocation(); // Get the current path
  // Find the component based on the current path If there's no matching route, get the "Error" component
  const { component = ErrorComponent } = findComponentByPath(path, routesArr) || {};
  document.getElementById('app').innerHTML = component.render(); // Render the component in the "app" placeholder
  toggleHomePageComponents(path);
};

const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
const findComponentByPath = (path, routes) => routes
    .find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;


function toggleHomePageComponents(path) { // TODO: Refactor this function
  if(path === "/") {
    document.getElementById('control-barCollapse').style.display = "inline-block";
    document.getElementById('breadCrumbRootLevel').style.display = "inline-block";
    document.getElementById('control-bar').style.display = "inline-block";
    document.getElementById('map').style.display = "inline-block";
    document.getElementById('sidebar').style.display = "inline-block";
  }
  else {
    document.getElementById('control-barCollapse').style.display = "none";
    document.getElementById('breadCrumbRootLevel').style.display = "none";
    document.getElementById('control-bar').style.display = "none";
    document.getElementById('map').style.display = "none";
    document.getElementById('sidebar').style.display = "none";
  }
};

// const clearHomePageComponents = () => {
//   const mh4uNavbarButtons = mh4uNavbarButtons();
//   document.getElementById('navbar-content').insertAdjacentHTML('afterbegin', mh4uNavbarButtons);
// };

// function mh4uNavbarButtons() {
//   return `<button type="button" id="control-barCollapse" class="btn btn-info">
//                         <span class="icon">&#xf0b0;</span>
//                         <span class="button-label-minimize">Фільтри пошуку</span>
//                         </button>
//                         <!-- Region filter breadcrumb -->
//                         <div class="breadcrumbs btn btn-warning mr-auto" style="z-index: 10000" id="breadCrumbRootLevel">
//                         </div>
//                         <!-- Region filter breadcrumb END -->`;
// }
