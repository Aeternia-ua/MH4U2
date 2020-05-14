// Color coding used for the markers. Returns different colors depending on the string passed.
const markerColors = {
    "1": "cadetblue",
    "2": "orange",
    "3": "red",
    "4": "yellow",
    "5": "lightgreen",
    "6": "lightpurple",
    "7": "lightgreen",
    "8": "green",
    "9": "pink",
    "10": "darkred",
    "11": "darkgreen",
    "12": "blue",
    "13": "darkblue",
    "14": "gray",
    "15": "purple",
    "16": "lightgray"
};

function getCheckboxStatesObject() {
    let checkboxStates = {};
    filtersSectionBinding.forEach(section => {
            checkboxStates[section.arrayName] = [];
        }
    );

    return checkboxStates;
}