// pages/api/balance.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed' });
    }

    const { addresses } = req.body;

    if (!Array.isArray(addresses)) {
        return res.status(400).json({ message: 'Addresses should be an array' });
    }

    const results = await Promise.all(addresses.map(async (address) => {
        try {
            const response = await axios.post('https://node.bihelix.io/api/ln/get_account_by_address', {
                address: address
            });
            const data = response.data.data;
            const jerryBalance = data.find(asset => asset.asset_id === 'rgb:RspPWEW9-mzuSNHQ-dGCb054-bLjHPYi-$I9$Ih2-Fy9vxFU')?.balance || 0;
            return { address, balance: jerryBalance };
        } catch (error) {
            return { address, balance: null, error: error.message };
        }
    }));

    res.status(200).json(results);
}

