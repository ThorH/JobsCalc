let data = {
    name: "Thor",
    avatar: "https://github.com/ThorH.png",
    /* as "" sao colocadas por causa do - no meio das variaveis*/
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75
};

module.exports = {
    get(){
        return data
    },
    update(newData){
        data = newData
    }
}

