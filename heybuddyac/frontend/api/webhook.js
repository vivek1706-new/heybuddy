export default function handler(req, res) {
    if (req.method === 'POST') {
        // Log the event from MSG91 so you can see it in Vercel Logs
        console.log('MSG91 Webhook Received:', JSON.stringify(req.body, null, 2));

        // Respond back to MSG91 with a 200 OK
        return res.status(200).json({ status: 'ok', received: true });
    } else {
        // Return error for non-POST requests
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
