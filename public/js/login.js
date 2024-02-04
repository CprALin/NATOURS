import axios from 'axios';
import { showAlert } from './alerts';

export const login = async ( email , password ) => {
    try{
        const res = await axios({
            method : 'POST',
            url : 'http://localhost:8000/api/v1/users/login',
            data : {
                email : email,
                password : password
            }
        });

        if(res.data.status === 'success')
        {
            showAlert('success','Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }

    }catch(err){
        showAlert('error' ,err.response.data.message);
    }
};

export const singup = async (name, email , password , passwordConfirm) => {
    try{
        const res = await axios({
            method : 'POST',
            url : 'http://localhost:8000/api/v1/users/singup',
            data : {
                name : name,
                email : email,
                password : password,
                passwordConfirm : passwordConfirm
            }
        });

        if(res.data.status === 'success')
        {
            showAlert('success', 'Registered successfully!');

            window.setTimeout(() => {
                login(email, password);
            }, 1500);  
        }

    }catch(err){
        showAlert('error' , err.response.data.message);
    }
};


export const logout = async () => {
    try{
        const res = await axios({
            method : 'GET',
            url : 'http://localhost:8000/api/v1/users/logout'
        });

        if(res.data.status = 'success')
        {
            location.reload(true);
        }
    }catch(err)
    {
        showAlert('error' , 'Error logging out ! Try again.');
    }
};