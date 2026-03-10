import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function productDeliveryHandler(req, res) {
  const { items, user_email, orderId } = req.body;

  if (!items || !user_email || !orderId || !Array.isArray(items) || items.length === 0) {
    console.error(">>> ERROR: Invalid request body data.");
    return res.status(400).json({ error: "Invalid or missing items, user_email, or orderId" });
  }

  try {
    
    const attachments = await Promise.all(items.map(async (item) => {      
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from('patterns')
        .download(`${item}.pdf`);

      if (downloadError) {
        console.error(`>>> DOWNLOAD ERROR for ${item}:`, downloadError);
        throw new Error(`Failed to download: ${item}`);
      }
      
      const arrayBuffer = await fileBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return { 
        filename: `${item}.pdf`, 
        content: buffer, 
        size: buffer.length 
      };
    }));


    // Batching Logic (Max 20MB per email)
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

    
    // SEND PATTERNS
    const emailPromises = batches.map((batch, index) => {
      return resend.emails.send({
        from: 'Eleny Makes <patterns@elenymakes.com>', // Since domain is verified
        to: user_email,
        subject: `Your Patterns from Eleny Makes (Part ${index + 1} of ${batches.length})`,
        text: `Thank you for your order! This is part ${index + 1} of your digital pattern delivery.`,
        attachments: batch.map(({ filename, content }) => ({ filename, content })),
      });
    });

    const results = await Promise.all(emailPromises);
    
    // Check for Resend-specific errors in the response
    const failedEmail = results.find(r => r.error);
    if (failedEmail) {
        console.error(">>> RESEND SEND ERROR:", failedEmail.error);
        throw new Error("Pattern email failed to send via Resend.");
    }


    return res.status(200).json({ 
        message: "All patterns sent!", 
        orderId: orderId,
        batches: batches.length 
    });

  } catch (error) {
    console.error(">>> CRITICAL ERROR IN DELIVERY:", error.message);
    return res.status(500).json({ 
        error: "Delivery failed", 
        details: error.message 
    });
  }
}