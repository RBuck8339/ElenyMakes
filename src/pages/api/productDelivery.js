import { Resend } from 'resend';
import { getRequestContext } from '@opennextjs/cloudflare';

// Initialize Resend
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function productDeliveryHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. DISCOVERY BRIDGE: Find the R2 Bucket
  const runtime = typeof getRequestContext === 'function' ? getRequestContext() : null;
  const bucket = runtime?.env?.BUCKET || globalThis?.BUCKET || req.env?.BUCKET;

  const { items, user_email, orderId } = req.body;

  if (!bucket) {
    console.error("CRITICAL: R2 Bucket binding 'BUCKET' not found.");
    return res.status(500).json({ error: "Storage connection lost" });
  }

  if (!items || !user_email || !orderId || !Array.isArray(items)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    // 2. Fetch PDF files from Cloudflare R2
    const attachments = await Promise.all(items.map(async (slug) => {
      // Access the bucket discovered in Step 1
      const object = await bucket.get(`${slug}.pdf`);

      if (!object) {
        console.error(`>>> R2 ERROR: File ${slug}.pdf not found in bucket.`);
        throw new Error(`File not found: ${slug}`);
      }

      const arrayBuffer = await object.arrayBuffer();
      const content = new Uint8Array(arrayBuffer);

      return {
        filename: `${slug}.pdf`,
        content: content,
        size: content.byteLength
      };
    }));

    // 3. Batching Logic (Max 20MB per email)
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

    // 4. SEND PATTERNS via Resend
    const emailPromises = batches.map((batch, index) => {
      return resend.emails.send({
        from: 'Eleny Makes <patterns@elenymakes.com>',
        to: user_email,
        subject: `Your Patterns from Eleny Makes ${batches.length > 1 ? `(Part ${index + 1} of ${batches.length})` : ''}`,
        text: `Thank you for your order! Your digital patterns are attached.`,
        attachments: batch.map(({ filename, content }) => ({
          filename,
          // Use Buffer.from(content) for Node compatibility or content directly for Edge
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