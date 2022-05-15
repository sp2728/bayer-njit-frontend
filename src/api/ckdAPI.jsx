import axios from "axios";

const backendURL = "http://localhost:3000";

export const login = async (userid, password)=>{
    return (await axios.put(backendURL+'/users/login',{
        userid: userid,
        password: password,
    }));
}

export const signup = async (userid, email, fullName, password, termsAccepted) => {
    return (
        await axios.post(backendURL+'/users',{
            userid: userid,
            fullName: fullName,
            password: password,
            email: email,
            termsAccepted: termsAccepted,
            termsAcceptedDate: `${(new Date()).getFullYear()}-${(new Date()).getMonth()}-${(new Date()).getDate()} ${(new Date()).getHours()}:${(new Date()).getMinutes()}:${(new Date()).getSeconds()}`
        })
    );
}