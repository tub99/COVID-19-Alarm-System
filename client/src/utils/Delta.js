const getCurrentDT = () => {
    var currentdate = new Date();
    var datetime =
      "Last Sync: " +
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    return datetime;
  };

const storeDelta = (currentData) =>{
    const delta = {
        updatedAt: getCurrentDT(),
        deltaList: currentData
    }
    localStorage.setItem('delta',JSON.stringify(delta));
}

const getDelta = (currentData) => {

    //get previous delta  
    const storeData = JSON.parse(localStorage.getItem('delta'));
    //store Current Delta
    const delta = {
        updatedAt: getCurrentDT(),
        deltaList: currentData
    }
    localStorage.setItem('delta',JSON.stringify(delta));
    const updatedDiff = findDelta(currentData, storeData.deltaList);
    const deltaList = updatedDiff.filter(delta=> delta.isChanged);
    return {
        lastUpdate: storeData.updatedAt,
        deltaList
    }

}
const findDelta = (stateWiseData, deltaList) => {
    const updateDeltaList = [];
    const getDeltaStateWise = (current, prev) => {
      let isConfirmed = current.confirmed - prev.confirmed;
      let isDead = current.deaths - prev.deaths;
      let isRecovered = current.recovered - prev.recovered;

      isConfirmed = isConfirmed < 0 ? 0 : isConfirmed;
      isDead = isDead < 0 ? 0 : isDead;
      isRecovered = isRecovered < 0 ? 0 : isRecovered;
      const { state } = current;
      if (state === "Total" && !(isConfirmed || isDead || isRecovered)) {
        return null;
      }
      if (isDead || isRecovered || isConfirmed) {
        return {
          isChanged: true,
          ...current,
          isDead,
          isRecovered,
          isConfirmed
        };
      } else {
        return {
          isChanged: false,
          ...current,
          isDead,
          isRecovered,
          isConfirmed
        }
      }
    };

    const isAnyUpdate = getDeltaStateWise(stateWiseData.length && stateWiseData[0] || {}, deltaList[0]);
    if (isAnyUpdate) {
      for(const [i, deltaState] of deltaList.entries()) {
        const current = stateWiseData[i];
        const prev = deltaState;
        const delta = getDeltaStateWise(current, prev);
        updateDeltaList.push(delta);
      }
    }
    return updateDeltaList;
  };


export { getDelta, storeDelta};