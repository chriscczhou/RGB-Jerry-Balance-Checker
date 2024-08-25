import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [addresses, setAddresses] = useState('');
    const [balances, setBalances] = useState([]);

    const handleCheckBalances = async () => {
        const addressArray = addresses.split('\n').filter(addr => addr.trim());
        try {
            const responses = await Promise.all(addressArray.map(async (address) => {
                const response = await axios.post('https://node.bihelix.io/api/ln/get_account_by_address', {
                    address: address
                });
                return response.data;
            }));

            const balances = responses.map(response => {
                const jerryAsset = response.data.find(asset => asset.asset_id === 'rgb:RspPWEW9-mzuSNHQ-dGCb054-bLjHPYi-$I9$Ih2-Fy9vxFU');
                return {
                    address: response.data[0].address,
                    balance: jerryAsset ? jerryAsset.balance : 0
                };
            });

            setBalances(balances);
        } catch (error) {
            console.error('Error checking balances:', error);
        }
    };

    return (
        <div>
            <h1>Check JERRY Token Balances (twitter:@chainchaincat)</h1>
            <textarea
                value={addresses}
                onChange={(e) => setAddresses(e.target.value)}
                placeholder="Enter Bitcoin addresses, one per line"
                rows="10"
                cols="50"
            />
            <button onClick={handleCheckBalances}>Check Balances</button>
            <div>
                {balances.map((result, index) => (
                    <div key={index}>
                        <p>Address: {result.address}</p>
                        {result.error ? (
                            <p>Error: {result.error}</p>
                        ) : (
                            <p>JERRY Balance: {result.balance}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
