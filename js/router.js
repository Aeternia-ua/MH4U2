// Components
const HomeComponent = {
  render: () => {
    return `
      <section>
        <h1>Home</h1>
        <p>This is just a test</p>
      </section>
    `;
  }
} 

const Page1Component = {
  render: () => {
    return `
      <section>
        <h1>Page 1</h1>
        <p>This is just a test</p>
      </section>
    `;
  }
} 

const Page2Component = {
  render: () => {
    return `
      <section>
        <h1>Page 2</h1>
        <p>This is just a test</p>
      </section>
    `;
  }
} 

const ErrorComponent = {
  render: () => {
    return `
      <section>
        <h1>Error</h1>
        <p>This is just a test</p>
      </section>
    `;
  }
}

const routes = [ // TODO: Build array of Routes
  { path: '/', component: HomeComponent, },
  { path: '/page1', component: Page1Component, },
  { path: '/page2', component: Page2Component, },
];

const router = () => {
  const path = parseLocation(); // Get the current path
  console.log("current path is ", path);
  // Find the component based on the current path If there's no matching route, get the "Error" component
  const { component = ErrorComponent } = findComponentByPath(path, routesArr) || {};
  document.getElementById('app').innerHTML = component.render(); // Render the component in the "app" placeholder
};

// const parseLocation = () => (location.hash.slice(1).toLowerCase() || '/'.replace(/#(.*)$/, ''));

const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';
const findComponentByPath = (path, routes) => routes
    .find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;

// window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;

