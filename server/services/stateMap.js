function StateMap(){
    this.deltaMap = {};
    this.getStateList = (stateData) =>{
        return stateData.map((data)=>{
            const {state, confirmed, deaths, recovered, lastupdatedtime} = data;
            return {
              state,
              confirmed, deaths, recovered,
              lastupdatedtime
            }
        });
    }
    this.getDeltaList = (stateData) =>{
        return stateData.map((data)=>{
            const {state, delta, lastupdatedtime} = data;
            this.deltaMap[state] = delta;
            return {
              state,
              delta,
              lastupdatedtime
            }
        });
    }
    
}

module.exports = new StateMap();