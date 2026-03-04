import {supabase} from '../../logic/supabaseClient';

export default async function logOrder(req, res) {
    if (req.method !== 'POST'){
        return res.status(405).json({error: 'Only POST methods allowed'});
    }

    const {paypalId, email, amount, items} = req.body;

    if(!paypalId || !email || ! items){
        return res.status(400).json({error: 'Missing required data for order'});
    }

    try{
        const {data, error} = await supabase.from('orders').insert([
            {
                paypal_id: paypalId,
                customer_email: email,
                total_amount: amount,
                items: items,
                status: 'completed'
            }
        ]).select();
        if (error) throw error;
        return res.status(200).json({message: 'Order logged successfully', orderId: data[0].id}) // Only one element in data
    }
    catch(error){
        console.error('Database Error: ', error.message);
        return res.status(500).json({error: 'Failed to log order to Supabase'});
    }
}