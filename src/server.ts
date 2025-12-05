import app from "./app";
import config from "./config";
import initDB from "./config/db";

const port = config.port || 5000;

initDB();

app.listen(port, ()=>{
    console.log('Server is running on port: ',port);
})