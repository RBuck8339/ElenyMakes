import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function receiptHandler(req, res) {
    const { items, orderId, user_email } = req.body;

    // Safety check: Ensure items exists before mapping
    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "No items provided" });
    }

    try {
        const itemRows = items.map(item => `
            <tr style="border-bottom: 1px solid #619B8A;">
                <td style="padding: 10px 0; font-family: sans-serif; color: #3D3534;">${item.item_name}</td>
                <td style="padding: 10px 0; text-align: right; font-family: sans-serif; color: #3D3534;">$${Number(item.price).toFixed(2)}</td>
            </tr>
        `).join('');

        const emailHtml = `
            <div style="background-color: #F5EDEC; padding: 40px 20px; font-family: 'Times New Roman', serif;">
                <div style="max-width: 580px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <h1 style="color: #3D3534; margin: 0; font-size: 28px;">Eleny Makes</h1>
                    <p style="color: #3D3534; opacity: 0.7; margin-bottom: 30px;">Order #${orderId}</p>
                    <p style="line-height: 1.6; color: #3D3534; font-size: 16px;">
                        Thank you for supporting Eleny Makes! Your digital patterns are on their way to your inbox. 
                        Be on the lookout for an email from <strong>patterns@elenymakes.com</strong>.
                    </p>
                    <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                        ${itemRows}
                    </table>
                    <p style="font-size: 14px; color: #3D3534; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                        Questions? Reach out at <a href="mailto:support@elenymakes.com" style="color: #619B8A; text-decoration: underline;">support@elenymakes.com</a>
                    </p>
                </div>
            </div>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Eleny Makes <eleny@elenymakes.com>',
            to: user_email,
            subject: `Order Confirmation #${orderId}`,
            html: emailHtml
        });

        if (error) throw error;
        return res.status(200).json({ message: "Receipt sent!", data });
    } catch (err) {
        console.error("Error sending receipt:", err);
        return res.status(500).json({ error: "Failed to send receipt email" });
    }
}