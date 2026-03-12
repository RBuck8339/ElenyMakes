import { supabase } from '../../logic/supabaseClient';

export default async function logOrder(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST methods allowed' });
    }

    const { paypalId, email, amount, items } = req.body;

    if (!paypalId || !email || !items) {
        return res.status(400).json({ error: 'Missing required data for order' });
    }

    try {
        // Log the insert attempt
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    paypal_id: paypalId,
                    customer_email: email,
                    total_amount: Number(amount),
                    // If your column is type JSONB, pass 'items' directly. 
                    // If it's type TEXT, use JSON.stringify(items).
                    items: items, 
                    status: 'completed'
                }
            ])
            .select();

        if (error) throw error;

        // Ensure we actually got a row back before accessing data[0]
        if (!data || data.length === 0) {
            throw new Error("No data returned from order insertion");
        }

        return res.status(200).json({ 
            success: true,
            message: 'Order logged successfully', 
            orderId: data[0].id 
        });

    } catch (error) {
        console.error('>>> LOG ORDER ERROR: ', error.message);
        return res.status(500).json({ error: 'Failed to log order to Supabase', details: error.message });
    }
}