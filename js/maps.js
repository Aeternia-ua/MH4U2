class ExternalMap {
  constructor(type, id, title, zoom, src) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.src = src;
    this.zoom = zoom;
  }

  setSrc(type, id, zoom) {
    if(type === "gMap") {
      return 'https://www.google.com/maps/d/embed?mid=' + id + '=ru&z=' + zoom;
    }
    else if(type === "powerBiMap") {
      return 'https://app.powerbi.com/view?r=' + id;
    }
    else if(type === "tableauMap") {
      return "https://public.tableau.com/views/-" + id;
    }
    else {
      return "unknown map type";
    }
  }
}

class ExternalGoogleMap extends ExternalMap {
  ownership;
  zoom;
}

class ExternalMaps { // Class that holds a collection of maps
  constructor() {
    this.externalMaps = [];
  }

  newExternalMap(type, id, title, zoom) { // create a new map and save it in the collection
    let extMap = new ExternalMap(type, id, title, zoom);
    this.externalMaps.push(extMap);
    return extMap;
  }
  get allExternalMaps() {
    return this.externalMaps;
  }
}

let externalMaps = new ExternalMaps();

function getExternalMaps(mapArr) {
  mapArr.forEach(el => {
    let newMap = externalMaps.newExternalMap(el.type, el.id, el.title, el.zoom);
    newMap.src = newMap.setSrc(newMap.type, newMap.id, newMap.zoom);
  })
}

const mapsData = [
    {
      type: 'gMap',
      id: '1GkLzdStF83xGox0wuDf3Zb17YX0&hl',
      title: 'Карта надання психосоціальної підтримки',
      ownership: '',
      zoom: 8
    },
  {
    type: 'gMap',
    id: '1zlgLJiJSKxPl8qKGmvBY2H5E3ty7xVAS&ll',
    title: 'Соціальна карта Львова',
    ownership: '',
    zoom: 12
  },
  {
    type: 'gMap',
    id: '13YWeCte8fmBhuz4zouJGGFcD9lfCFebc&ll',
    title: 'Психіатрична допомога в Україні',
    ownership: '',
    zoom: 12
  },
  {
    type: 'gMap',
    id: '1RgKAl03MFgWU_YAxRVXD4f6RLHq72SDb&ll',
    title: 'Карта закладів, що надають послуги замісної підтримувальної терапії',
    ownership: '',
    zoom: 12
  },
  {
    type: 'gMap',
    id: '1RY6JI_cU1aMBu02NlE-FQ2UckJUMIoc1&ll',
    title: 'Карта надання психосоціальної підтримки (ВООЗ)',
    ownership: 'Mental Health and Psychosocial Support Technical Working Group (WHO)',
    zoom: 8
  },
  {
    type: 'gMap',
    id: '1wgeht7rY1xEk6Ws62233J3gj_rwqzLxh&ll',
    title: 'Карта закладів, що надавали психіатричну допомогу дітям в Україні в 2018 році',
    ownership: 'ДУ «Центр психічного здоров\'я\n і моніторингу наркотиків та алкоголю МОЗ України»',
    zoom: 6
  },
  {
    type: 'gMap',
    id: '1OnSCAXXzo-gF0zTso83c3kdfaE_YjTrV&ll',
    title: 'Карта медичної допомоги в установах Державної кримінально-виконавчої служби України',
    ownership: 'ДУ «Центр психічного здоров\'я\n і моніторингу наркотиків та алкоголю МОЗ України»',
    zoom: 12
  },
  {
    type: 'gMap',
    id: '1d1CgP5Lx1Gy6Wyckk6fZ5i2xBY8WTQKu&ll',
    title: 'Карта мережі закладів, спеціалізованих з надання психіатричної допомоги: фінансування та витрати, земельні ділянки, кількість осіб, яким надавалась медична допомога у 2018 році',
    ownership: 'ДУ «Центр психічного здоров\'я\n і моніторингу наркотиків та алкоголю МОЗ України»',
    zoom: 12
  },
  {
    type: 'gMap',
    id: '1OnSCAXXzo-gF0zTso83c3kdfaE_YjTrV&ll',
    title: 'Карта медичної допомоги в установах Державної кримінально-виконавчої служби України',
    ownership: 'ДУ «Центр психічного здоров\'я\n і моніторингу наркотиків та алкоголю МОЗ України»',
    zoom: 12
  },
  {
    type: 'gMap',
    id: '1OnSCAXXzo-gF0zTso83c3kdfaE_YjTrV&ll',
    title: 'Карта медичної допомоги в установах Державної кримінально-виконавчої служби України',
    ownership: 'ДУ «Центр психічного здоров\'я\n і моніторингу наркотиків та алкоголю МОЗ України»',
    zoom: 12
  },
  {
    type: 'powerBiMap',
    id: 'eyJrIjoiMDU5ZDE2MDAtMTI2OC00ZjgxLWI1ZjEtNGRkODU0YTQwZjk1IiwidCI6ImY2MTBjMGI3LWJkMjQtNGIzOS04MTBiLTNkYzI4MGFmYjU5MCIsImMiOjh9',
    title: 'Послуги з психічного здоровя та психосоціальної підтримки гендерно-зумовленому насиллю',
    ownership: '',
    zoom: 8
  },
  {
    type: 'powerBiMap',
    id: 'eyJrIjoiYWZkNjc3MTEtZmE5MS00NDEzLTg4OTgtOThjOWVjYzBkYmM2IiwidCI6IjI4OGJmYmNmLTVhYjItNDk2MS04YTM5LTg2MDYxYWFhY2Q4NiIsImMiOjl9',
    title: 'Національна служба здоровя України',
    ownership: '',
    zoom: 8
  },
  {
    type: 'tableauMap',
    id: '_15703951768500/sheet0_1?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Fpublic.tableau.com%2F&:tabs=yes&:toolbar=yes&:animate_transition=yes&:display_static_image=no&:display_spinner=no&:display_overlay=yes&:display_count=yes&:loadOrderID=0',
    title: 'Деінституціалізація',
    ownership: '',
    zoom: 8
  },
];
