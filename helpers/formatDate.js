const formatDate = (date) => {
    let stringDate = JSON.stringify(date);
    if(stringDate === "null"){
        return null;
    }
    let formattedDate = stringDate.slice(1, 11);
    return formattedDate;
}

module.exports = {formatDate};