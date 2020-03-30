const parseMapData = (mapData, covidData) => {
    let geometries = mapData.objects.india.geometries;
    geometries = geometries.map((data, i) => {
        let stateData = getStateByName(covidData, data.properties.ST_NM);
        if (stateData) {
            return { ...data, properties: { ...data.properties, ...stateData, id: `st_${data.properties.ST_NM.split(" ").join("_")}` } };
        }
        return data;
    });
    mapData.objects.india.geometries = geometries;
    return mapData;
}

const getStateByName = (covidData, state) => {
    for (let i in covidData) {
        if (covidData[i].state == state) return covidData[i];
    }
    return null;
}

export { parseMapData, getStateByName };