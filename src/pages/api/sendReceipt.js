import { ReceiptEmailTemplate } from "../../components/receiptTemplate";
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async function receiptHandler(req, res) {
    // Destructure the data sent from the first function
    const { items, orderId, num_emails, user_email } = req.body;

    try {
        // Map the item strings to the object format your template expects
        const templateItems = items.map(product => ({
            name: product.item_name, 
            price: Number(product.price).toFixed(2) 
        }));

        const { data, error } = await resend.emails.send({
            from: 'Eleny Makes <eleny@elenymakes.com>',
            to: user_email,
            subject: 'Thanks for your order!',
            react: ReceiptEmailTemplate({ 
                items: templateItems, 
                orderId, 
                num_emails 
            })
        });
        if (error) throw error;

        return res.status(200).json({ message: "Receipt sent!", data });
    }
    catch (err) {
        console.error("Error sending receipt email:", err);
        return res.status(500).json({ error: "Failed to send receipt email" });
    }
}