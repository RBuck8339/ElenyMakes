import { Resend } from 'resend';
import { supabase } from '../../logic/supabaseClient'; // Adjust path to your client

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function productDeliveryHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { items, user_email, orderId } = req.body;

  if (!items || !user_email || !orderId || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    // 1. Fetch PDF files from Supabase Storage
    const attachments = await Promise.all(items.map(async (slug) => {
      // Assuming your bucket name is 'eleny-patterns'
      const { data, error } = await supabase
        .storage
        .from('patterns')
        .download(`${slug}.pdf`);

      if (error || !data) {
        console.error(`>>> SUPABASE STORAGE ERROR for ${slug}:`, error?.message);
        throw new Error(`File not found: ${slug}`);
      }

      // Convert Blob (Supabase output) to ArrayBuffer for Resend
      const arrayBuffer = await data.arrayBuffer();
      const content = new Uint8Array(arrayBuffer);

      return {
        filename: `${slug}.pdf`,
        content: content,
        size: content.byteLength
      };
    }));

    // 2. Batching Logic (Max 20MB per email)
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

    // 3. SEND PATTERNS via Resend
    const emailPromises = batches.map((batch, index) => {
      return resend.emails.send({
        from: 'Eleny Makes <patterns@elenymakes.com>',
        to: user_email,
        subject: `Your Patterns from Eleny Makes ${batches.length > 1 ? `(Part ${index + 1} of ${batches.length})` : ''}`,
        text: `Thank you for your order! Your digital patterns are attached.`,
        attachments: batch.map(({ filename, content }) => ({
          filename,
          content: Buffer.from(content) 
        })),
      });
    });

    await Promise.all(emailPromises);

    return res.status(200).json({ 
      success: true,
      message: "All patterns sent!", 
      orderId: orderId,
      batches: batches.length 
    });

  } catch (error) {
    console.error(">>> DELIVERY ERROR:", error.message);
    return res.status(500).json({ 
      error: "Delivery failed", 
      details: error.message 
    });
  }
}