var isRun = true;
var isGroupsRun = true;
const getRun = () => {
    return isRun;
}
const setRun = v => {
    isRun = v;
}

const getGruopRun = () => {
    return isGroupsRun;
}
const setGruopRun = v => {
    isGroupsRun = v;
}

module.exports = {getRun, setRun, getGruopRun, setGruopRun};