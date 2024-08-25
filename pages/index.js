import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [addresses, setAddresses] = useState('');
    const [balances, setBalances] = useState([]);

    const handleCheckBalances = async () => {
        const addressArray = addresses.split('\n').filter(addr => addr.trim());
        try {
            const response = await axios.post('/api/balance', { addresses: addressArray });
            setBalances(response.data);
        } catch (error) {
            console.error('Error checking balances:', error);
        }
    };

    return (
        <div>
            <h1>Check JERRY Token Balances</h1>
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

