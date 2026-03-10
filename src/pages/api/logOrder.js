export default async function logOrder(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST methods allowed' });
    }

    const { env } = req; // In Cloudflare, env contains your DB binding
    const { paypalId, email, amount, items } = req.body;

    if (!paypalId || !email || !items) {
        return res.status(400).json({ error: 'Missing required data for order' });
    }

    try {
        // We use .prepare() and .bind() to prevent SQL injection
        // items is likely an array, so we stringify it for SQLite TEXT storage
        const orderId = crypto.randomUUID(); 
        
        await env.DB.prepare(`
            INSERT INTO orders (id, paypal_id, customer_email, total_amount, items)
            VALUES (?, ?, ?, ?, ?)
        `)
        .bind(
            orderId, 
            paypalId, 
            email, 
            amount, 
            JSON.stringify(items)
        )
        .run();

        return res.status(200).json({ 
            message: 'Order logged successfully', 
            orderId: orderId 
        });

    } catch (error) {
        console.error('D1 Database Error:', error.message);
        return res.status(500).json({ error: 'Failed to log order to Cloudflare D1' });
    }
}