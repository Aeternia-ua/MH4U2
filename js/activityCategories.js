const prevCodeSetStructure = [
    {
        "Activity code": "15",
        "Activity category": "Служби/послуги в закладах тривалого перебування",
        "Activity code name": "Будинки-інтернати (будинки догляду)",
        "Subactivity code": "15,2",
        "Subactivity code name": "Будинки-інтернати для людей похилого віку"
    },
    {
        "Activity code": "1",
        "Activity category": "Загальні",
        "Activity code name": "Загальні активності з охорони психічного здоров’я та психосоціальної підтримки",
        "Subactivity code": "1,1",
        "Subactivity code name": "Загальні активності з охорони психічного здоров’я та психосоціальної підтримки"
    },
]

function buildCodeObjects(rowData) {
    const [header, ...rows] = rowData;
    const codeObjects = [];
    for (let values = 0; values < rows.length; values ++) {
        let row = rows[values];
        let codeObject = {};
        for (let key = 0; key < header.length; key++) {
            codeObject[header[key]] = row[key]
        }
        codeObjects.push(codeObject);
    }
    return codeObjects;
}

function mergeCodes(arr, codeArr) {
    let codeSet = codeArr.map(codeType => codeType.data).flat().find(sheet => sheet.Title === codesTab);
    let codes = [];

    const codeObjects = buildCodeObjects(codeSet.values);
    if (codeSet) {
        codeObjects.forEach(code => {
            let codeElement = {};
            codesProperties.forEach(codeProperty => {
                codeElement[codeProperty.name] = code[codeProperty.columnName];
            });
            codes.push(codeElement);
            console.log("code ", code);
            // TODO: Fetch ac2 and subac2 using code['Category']
            arr.features.forEach(feature => {
                feature.properties.ac1 === code['Activity code'];
                feature.properties.subac1 === code['Subactivity code'];
                console.log("feature.properties.ac2 ", feature.properties.ac2)
            });
            arr.features
            .filter(feature => feature.properties.ac1 === code['Activity code']
                && feature.properties.subac1 === code['Subactivity code']
            ) // Get all features with the specific ac1 and subac1
            .forEach(feature => {
                codesProperties.forEach(codeProperty => {
                    feature.properties[codeProperty.name] = code[codeProperty.columnName];
                });
            });
        });
    }
    return codes;
}

