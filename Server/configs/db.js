import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        mongoose.connection.on("connected", ()=>{
            console.log("DataBase Connected Sucessfully");
            
        })
        let mongoDbURI=process.env.MONGODB_URI;
        const projectName='resume-builder';

        if(!mongoDbURI){
            throw new Error("MONGODB_URI environment variablenot set")
        }
        if(mongoDbURI.endsWith('/')){
            mongoDbURI=mongoDbURI.slice(0, -1)
        }
        await mongoose.connect(`${mongoDbURI}/${projectName}`)
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`); 
    }
}
export default connectDB;