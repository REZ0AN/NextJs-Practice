import bcrypt from "bcryptjs";


export default async function getHashedValue(data : string) {
        
    try {

        // generating salt
        const salt = await bcrypt.genSalt(12);

        // Hash Data
        const hashedData = await bcrypt.hash(data, salt);
        return hashedData;
    } catch(error) {
        console.error("[ERROR] constructing the hash :", error);
        return null;
    }
}