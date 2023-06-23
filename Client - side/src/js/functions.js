function date_manger(){
    let list = [];

    var date = new Date();
    var start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    while(start <= end){

        var mm = ((start.getMonth()+1)>=10)?(start.getMonth()+1):'0'+(start.getMonth()+1);
        var dd = ((start.getDate())>=10)? (start.getDate()) : '0' + (start.getDate());
        var yyyy = start.getFullYear();
        var id = new Date(start.getTime());
        var date = yyyy + "-" + mm + "-" + dd;

        if (id.getDay() === 0 || id.getDay() === 5 || id.getDay() === 6) {
            
        } else {
            list.push(date);
        }

        start = new Date(start.setDate(start.getDate() + 1)); //date increase by 1
    }

    return list;
}

export default { date_manger }