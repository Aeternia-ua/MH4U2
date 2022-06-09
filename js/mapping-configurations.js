const elementTypes = {
    KEYVALUE_CHECKBOX: 1,
    YESNO_CHECKBOX: 2,
    DROPDOWN: 3,
    TEXT: 4
}

const searchByMapping = [
    "officialName",
    "mentalhealthworkers",
    "activitycategory",
    "activitycodename",
    "subactivitycodename"

];

const codesTab = "[conf] Coding table for mental health services mapping";
const validationTab = "[conf]Validation rule set";

const administrativeUnitsBindingTemplate = [
    {
        auLevel: 0,
        auSourceProperty: "",
        auId: "root",
    },
    {
        auLevel: 1,
        auSourceProperty: "region",
        auId: "region",
    },
    {
        auLevel: 2,
        auSourceProperty: "district",
        auId: "district"
    }
];

const filtersSectionBinding = [
    {
        filterClass: "Типпослуг-check",
        arrayName: "serviceCategories",
        featurePropertyName: "ac1",
        elementType: elementTypes.KEYVALUE_CHECKBOX
    },
    {
        filterClass: "Типзакладу-check",
        arrayName: "facilityTypes",
        featurePropertyName: "facilitytype",
        elementType: elementTypes.KEYVALUE_CHECKBOX
    }
];

const codesProperties = [
	{
		name: "ac1",
		columnName: "Activity code",
        category: "1"
	},
	{
		name: "activitycategory",
		columnName: "Activity category",
        category: "1"
	},
	{
		name: "activitycodename",
		columnName: "Activity code name",
        category: "1"
	},
	{
		name: "subactivitycode",
		columnName: "Subactivity code",
        category: "1"
	},
	{
		name: "subactivitycodename",
		columnName: "Subactivity code name",
        category: "1"
	},
    {
        name: "ac2",
        columnName: "Activity code",
        category: "2"
    },
    {
        name: "subactivitycode2",
        columnName: "Subactivity code",
        category: "2"
    }

];

// const codesProperties = [
// 	{
// 		name: "ac1",
// 		columnName: "Activity code",
//         category: "1"
// 	},
// 	{
// 		name: "activitycategory",
// 		columnName: "Activity category",
//         category: "1"
// 	},
// 	{
// 		name: "activitycodename",
// 		columnName: "Activity code name",
//         category: "1"
// 	},
// 	{
// 		name: "subactivitycode",
// 		columnName: "Subactivity code",
//         category: "1"
// 	},
// 	{
// 		name: "subactivitycodename",
// 		columnName: "Subactivity code name",
//         category: "1"
// 	},
//     {
//         name: "ac2",
//         columnName: "Activity code",
//         category: "2"
//     },
//     {
//         name: "subactivitycode2",
//         columnName: "Subactivity code",
//         category: "2"
//     }
//
// ];

const buttonsJson = [
    {
        buttonId : "clearТиппослугFiltersBtn",
        className : "Типпослуг-check"
    },
    {
        buttonId : "clearOtherCategoryFiltersBtn",
        className : "other-categories-check",
    },
    {
        buttonId : "clearТипзакладуFiltersBtn",
        className : "Типзакладу-check",
    }
];