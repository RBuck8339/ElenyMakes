import { getRequestContext } from '@opennextjs/cloudflare';

export default async function logOrder(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST methods allowed' });
    }

    // 1. Discovery: OpenNext stores bindings in getRequestContext() or globalThis
    const runtime = typeof getRequestContext === 'function' ? getRequestContext() : null;
    const db = runtime?.env?.DB || globalThis?.DB || req.env?.DB;

    const { paypalId, email, amount, items } = req.body;

    if (!db) {
        console.error("CRITICAL: D1 Database binding 'DB' not found in logOrder.");
        return res.status(500).json({ error: 'Database connection lost' });
    }

    if (!paypalId || !email || !items) {
        return res.status(400).json({ error: 'Missing required data' });
    }

    try {
        // 2. Use globalThis for crypto to be safe in Edge/Node environments
        const orderId = globalThis.crypto.randomUUID(); 
        
        await db.prepare(`
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
            success: true,
            orderId: orderId 
        });

    } catch (error) {
        console.error('D1 Database Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
}