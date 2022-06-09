function buildServiceCategory(categoriesRoot, codes) {
    console.log("buildServiceCategory codes ", codes);
    let filteredCodes = codes.map(x => {
    return {
        codeValue: x.ac1,
        codeName: x.activitycodename
    }});
    let map = new Map()
    let distinctCodes = [];

    for (const element of filteredCodes) {
        if (!map.has(element.codeValue)) {
            map.set(element.codeValue, true);
            distinctCodes.push(element);
        }
    }

    let serviceCategory = [];
    distinctCodes.forEach(code => {
        serviceCategory.push({
            "filterProperty": "ac1",
            "filterDisplayName": code.codeName,
            "filterValueName": code.codeValue
        });
    });

    let categoriesParent = buildCategorySection(categoriesRoot, "Тип послуг", "Типпослуг");
    buildCheckboxFilters("Типпослуг", serviceCategory, categoriesParent);
}

function rowsToColumns(rows) {
    return rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));
}

function buildFacilityTypeCategory(categoriesRoot) {
    let columns = [];
    let facilityTypesCategory = [];
    let columnName = "амбулаторна чи стаціонарна";

    let validationTable = dataTypesTemplate.find(sheetType => sheetType.type === "[conf]")
        .data.find(table => table.title === validationTab);
    columns = rowsToColumns(validationTable['values']);
    const facilityTypeCol = columns
        .find(column => column[0] === columnName); // Get the "амбулаторна чи стаціонарна" column

    facilityTypeCol.shift(); // Returns column values
    facilityTypeCol.forEach(value => {
        if (value && value !== "") { // TODO: Filter out undefined values when creating Sheet obj
            facilityTypesCategory.push({
                "filterProperty": columnName,
                "filterDisplayName": value,
                "filterValueName": value
            });
        }
    })
    let categoriesParent = buildCategorySection(categoriesRoot, "Тип закладу", "Типзакладу");
    buildCheckboxFilters("Типзакладу", facilityTypesCategory, categoriesParent);
};

function buildOtherCategories(categoriesRoot) {
    //"other-categories"
    Object.keys(otherCategories).forEach(category => {
        let categoryCanonicalName = category.replace(/ /g, "");
        let categoriesParent = buildCategorySection(categoriesRoot, category, categoryCanonicalName);
        buttonsJson.push({
            buttonId: `clear${categoryCanonicalName}FiltersBtn`,
            className: `${categoryCanonicalName}-check`
        });
        filtersSectionBinding.push({
            filterClass: `${categoryCanonicalName}-check`,
            arrayName: categoryCanonicalName,
            elementType: elementTypes.YESNO_CHECKBOX
        });
        buildCheckboxFilters(categoryCanonicalName, otherCategories[category], categoriesParent);
    });
}

function buildCategorySection(categoriesRoot, categoryName, categoryCanonicalName) {
        let categoryTemplate = filterCategoryTemplate
            .replace(/{categoryName}/g, categoryName)
            .replace(/{categoryCanonicalName}/g, categoryCanonicalName);
        let categoryObject = $(categoryTemplate);
        categoriesRoot.append(categoryObject);
        let categoriesParent = categoryObject.find(`#${categoryCanonicalName}Submenu .form-check`);
    return categoriesParent;
};

function buildCheckboxFilters(categoryName, categoryValues, parentElement) {
    categoryValues.forEach(value => {
        let modifiedTemplate = checkboxFilterItemTemplate
            .replace(/{categoryName}/g, categoryName)
            .replace(/{categoryItemLabel}/g, value.filterDisplayName)
            .replace(/{categoryItem}/g, value.filterValueName);
        parentElement.append($(modifiedTemplate));
    })
}


