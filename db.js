
import dotenv from 'dotenv';
dotenv.config(); 
import { connect } from 'mongoose'; 
const connectMongo = async ()=>{
    await connect(process.env.MONGODB_URI);
    console.log('Connected Sucessfully.')
}  

export default connectMongo;