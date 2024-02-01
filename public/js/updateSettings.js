import axios from 'axios';
import { showAlert } from './alerts';

//type  : 'password' or 'data'
export const updateSettings = async (data , type) => {
    try{
        const url = type === 'password' ? 'http://localhost:8000/api/v1/users/updateMyPassword' : 'http://localhost:8000/api/v1/users/updateMe';

        const res = await axios({
            method : 'PATCH',
            url,
            data
        });

        if(res.data.status === 'success')
        {
            showAlert('success',`${type.toUpperCase()} updated successffuly !`);
        }
    }catch(err){
        showAlert('error' , err.response.data.message);
    }
};

