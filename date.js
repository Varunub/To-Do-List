

module.exports.date=date;

function date(){
    var today=new Date()
    var options={year:"numeric",weekday:"long",day:"numeric",month:"long"}
    var day=today.toLocaleDateString("en-US",options)
    return day
}

module.exports.day=day;
function day(){
    var today=new Date()
    var options={year:"numeric",weekday:"long",day:"numeric",month:"long"}
    var day0=today.toLocaleDateString("hi-IN",options)
    return day0
}
