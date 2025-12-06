import app from "./app";
import config from "./config";

const port = config.port || 5000;


app.listen(port, ()=>{
    console.log('Server is running on port: ',port);
})