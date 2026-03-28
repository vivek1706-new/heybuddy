export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { phone, otp } = req.body;
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    // NEW: India DLT Requirements
    const senderId = process.env.MSG91_SENDER_ID || 'SMSMSG'; // Default if not set
    const peId = process.env.MSG91_PE_ID;

    if (!authKey || !templateId) {
        return res.status(500).json({ error: 'Core Auth or Template ID missing' });
    }

    try {
        // API v5 with India DLT params (Sender and PeId)
        // Note: If you don't use DLT, MSG91 might ignore these
        let url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=91${phone}&authkey=${authKey}&otp=${otp}&sender=${senderId}`;

        if (peId) {
            url += `&DLT_TE_ID=${templateId}&pe_id=${peId}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        console.log('MSG91 Response Trace:', data);

        if (data.type === 'success' || data.request_id) {
            return res.status(200).json({ status: 'sent', data });
        } else {
            return res.status(400).json({ error: 'MSG91_ERROR', details: data });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Fetch failed', message: err.message });
    }
}
