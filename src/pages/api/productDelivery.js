import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function productDeliveryHandler(req, res) {
  const { items, user_email, orderId } = req.body;

  if (!items || !user_email || !orderId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid or missing items, user_email, or orderId" });
  }

  try {
    const attachments = await Promise.all(items.map(async (item) => {
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from('patterns')
        .download(item);

      if (downloadError) throw new Error(`Failed to download: ${item}`);
      
      const buffer = Buffer.from(await fileBlob.arrayBuffer());

      return { 
        filename: item, 
        content: buffer, 
        size: buffer.length // Added size for the batching logic
      };
    }));

    // Your Batching Logic
    const MAX_SIZE = 20 * 1024 * 1024;
    let batches = [];
    let currentBatch = [];
    let currentBatchSize = 0;

    attachments.forEach((att) => {
      if (currentBatchSize + att.size > MAX_SIZE && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [];
        currentBatchSize = 0;
      }
      currentBatch.push(att);
      currentBatchSize += att.size;
    });
    if (currentBatch.length > 0) batches.push(currentBatch);

    // CALLING THE RECEIPT FUNCTION 
    // Note: On the server, we use an absolute URL or call the logic directly.
    // For local testing, we'll use a try/catch block.
    try {
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        
        await fetch(`${protocol}://${host}/api/sendReceipt`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: items, // Passing the array of names
              orderId: orderId,
              user_email: user_email,
              num_emails: batches.length
            })
        });
    } catch(err) {
      console.error("Receipt trigger failed, but continuing with patterns:", err);
    }
    
    // SEND PATTERNS
    const emailPromises = batches.map((batch, index) => {
      return resend.emails.send({
        from: 'Eleny Makes <patterns@elenymakes.com>',
        to: user_email,
        subject: `Your Patterns from Eleny Makes (Part ${index + 1} of ${batches.length})`,
        text: `Thank you for your order! This is part ${index + 1} of your digital pattern delivery.`,
        attachments: batch.map(({ filename, content }) => ({ filename, content })),
      });
    });

    const results = await Promise.all(emailPromises);
    const failedEmail = results.find(r => r.error);
    if (failedEmail) throw new Error("Pattern email failed to send.");

    return res.status(200).json({ 
        message: "All patterns sent!", 
        orderId: orderId,
        batches: batches.length 
    });

  } catch (error) {
    console.error("Multi-pattern Error:", error);
    return res.status(500).json({ 
        error: "Delivery failed", 
        details: "Please contact support@elenymakes.com with your Order ID." 
    });
  }
}