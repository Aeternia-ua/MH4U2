const homepageURL = "index.html";
const homepageMapTitle = "MH4U - Карта закладів системи охорони психічного здоров’я";
let routesArr = [];

class Route {
    path;
    component;
}

function buildListItem(listRoot, title, url) {
        let listItemTemplate = mapListItemTemplate
            .replace(/{mapTitle}/g, title)
            .replace(/{mapUrl}/g, ("#/" + url));
        let listItem = $(listItemTemplate);
    return listItem;
};

function createMapsMenu(mapsListRoot, entries) {
    let homePageListItem = buildListItem(mapsListRoot, homepageMapTitle, homepageURL); // Add a homepage to the menu
    mapsListRoot.append(homePageListItem);
    entries.forEach(entry => { // Build the list of the 3rd party maps
        let mapTitle = entry.title;
        let mapUrl = transliterate((mapTitle.toLowerCase()).replace(/ /g, "-")
            .replace(/,/g, ""))
            .replace(/:/g, ""); //TODO replace special symbols in map title to create url

        let mapRoute = new Route();
        mapRoute.path = '/' + mapUrl;
        mapRoute.component = Page1Component;
        routesArr.push(mapRoute);

        let listItem = buildListItem(mapsListRoot, mapTitle, mapUrl);
        mapsListRoot.append(listItem);
    });
}
