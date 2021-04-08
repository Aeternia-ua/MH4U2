const homepageMapTitle = "MH4U - Карта закладів системи охорони психічного здоров’я";

class Route {
    constructor(path, component, id, map) {
        this.path = path;
        this.component = component;
        this.id = id;
        this.map = map;
    }
}

function buildListItem(listRoot, title, url) {
    let listItemTemplate = mapListItemTemplate
        .replace(/{mapTitle}/g, title).replace(/{mapUrl}/g, ("#/" + url));
    let listItem = $(listItemTemplate);
    return listItem;
};

function buildHomePageListItem(listRoot, title) {
    let listItemTemplate = mapListItemTemplate
        .replace(/{mapTitle}/g, title).replace(/{mapUrl}/g, "");
    let listItem = $(listItemTemplate);
    console.log(listItem);
    return listItem;
}

function createMapsMenu(mapsListRoot, entries) {
    let homePageListItem = buildHomePageListItem(mapsListRoot, homepageMapTitle); // Add a homepage to the menu
    mapsListRoot.append(homePageListItem);
    let homepageRoute = new Route("/", HomeComponent, null, null); // Create a route for the homepage
    routesArr.push(homepageRoute);

    entries.forEach(entry => { // Build the list of the 3rd party maps
        let mapTitle = entry.title;
        let mapUrl = transliterate((mapTitle.toLowerCase()).replace(/ /g, "-")
            .replace(/,/g, ""))
            .replace(/:/g, "")
            .replace(/'/g, "") //TODO replace special symbols in map title to create url

        let mapRoute = new Route();
        mapRoute.path = '/' + mapUrl;
        mapRoute.id = entry.id;
        mapRoute.map = externalMaps.allExternalMaps.find(el => el.id === mapRoute.id);
        mapRoute.component = new PageComponent(mapRoute.map.src);
        routesArr.push(mapRoute);

        let listItem = buildListItem(mapsListRoot, mapTitle, mapUrl);
        mapsListRoot.append(listItem);
    });
}
