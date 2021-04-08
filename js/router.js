let routesArr = [];

const router = () => {
  const path = parseLocation(); // Get the current path
  console.log("current path is ", path);
  // Find the component based on the current path If there's no matching route, get the "Error" component
  const { component = ErrorComponent } = findComponentByPath(path, routesArr) || {};
  document.getElementById('app').innerHTML = component.render(); // Render the component in the "app" placeholder
};

const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
const findComponentByPath = (path, routes) => routes
    .find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;
