import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe('pk_test_51OgBP9GllNof3LkvW4DqbkiKXlAglDeZWlsNwwMyE1pbZ0F2vpeX5EhnVjzVvAmYHUx8KnEElEwqw6N3txfkoy3200hhIurTxV')

export const bookTour = async tourId => {
    try{
    // 1) Get checkout session from API 
    const session = await axios(`http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form
    await stripe.redirectToCheckout({
        sessionId : session.data.session.id
    });

    }catch(err){
        showAlert('error' , err);
    } 
}