module.exports =  class Response{
    constructor(message, status, data){
        if(status)
            this.status = status;
        else
            this.status = 404;
        if(message)
            this.message = message;
        else 
            this.message = "";
        if(data)
            this.data = data;
        else 
            this.data = {};
    }
}