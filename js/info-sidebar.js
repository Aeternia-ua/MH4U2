const demoTemplateHtml =
	`<p>This is {{replace}} message`;

function getReplacedString (demoTemplateHtml, feature) {
	for (var property in feature.properties) {
		if (feature.properties.hasItsOwnProperty(property)) {
			return demoTemplateHtml.replace("{{" + property + "}}", feature.properties[property]);
		} else {
			return demoTemplateHtml;
		}
	}
}

function populateInfoSidebar(e, sidebar) {

	let html = sidebarTemplate;

	let filterValues = getFeatureFilterValues(e.target.feature);
	let array = [... filterValues];

	let str = "";
	array.forEach(kvObjectArray => {
		let key = kvObjectArray[0];
		let filterCategory = kvObjectArray[1];
		str += `<h5 class="card-header text-center">${key}</h5><ul class="list-group">`;
		filterCategory.forEach(filterValue => {
			str += `<li class="list-group-item">`;
			str += filterValue.propertyName;
			if (filterValue.propertyAttributes.length > 0) {
				str += ": " + `<ul class="list-group">`;
				filterValue.propertyAttributes.forEach(attribute => {
					str += `<li class="list-group">` + attribute.attributeName + ": " + attribute.attributeValue + "</li>";
				});
				str += "</ul>";
			}
			str += "</li>";
		})
		str += "</ul>";
	});

	for (var property in e.target.feature.properties) {
		html = html.replace("{{" + property + "}}", e.target.feature.properties[property]);
	}
	html = html.replace("{{filterValues}}", str);

	L.DomEvent.stopPropagation(e);
	document.getElementById('sidebar-content').innerHTML = html;
	if(e.target.feature.properties.mh4uCooperation == 'Yes') {
		$(".official-name-header").prepend(mh4uCooperationBadge);
	}
	sidebar.show();
}

function getFeatureFilterValues(feature) {
	let filterPrefix = "F_";
	let filterCategoriesMap = new Map();

	let filterProperties = Object.keys(feature.properties)
		.filter(columnName => columnName.indexOf(filterPrefix) === 0
			&& feature.properties[columnName].filterValue === "Yes");

	filterProperties.forEach(property => {
		let propertyComponents = property.split("_"); // We assume that the property has 3 components: prefix, categiory and property name
		if (propertyComponents.length === 3) {
			if (!filterCategoriesMap.has(propertyComponents[1])) {
				filterCategoriesMap.set(propertyComponents[1], [])
			}
			let categoryValues = filterCategoriesMap.get(propertyComponents[1]);
			let filterObject = feature.properties[property];
			let propertyObject = {
				propertyName: propertyComponents[2],
				propertyAttributes: []
			}
			categoryValues.push(propertyObject);

			filterObject.filterAttributes.forEach(attribute => propertyObject.propertyAttributes.push(attribute));
		}
	});

	return filterCategoriesMap;
}
