const PINATA_API_KEY = process.env.PINATA_API_KEY!;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY!;

export const pinataService = {
    async uploadJSON(data: Record<string, unknown>, metadata?: Record<string, unknown>) {
        try {
            const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY,
                },
                body: JSON.stringify({
                    pinataContent: data,
                    pinataMetadata: metadata,
                }),
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(`Pinata API Error: ${res.status} ${res.statusText} - ${errorData}`);
            }

            const responseData = await res.json();
            return {
                ipfsHash: responseData.IpfsHash,
                gatewayUrl: `https://gateway.pinata.cloud/ipfs/${responseData.IpfsHash}`,
            };
        } catch (error) {
            console.error('Pinata upload error:', error);
            throw new Error('Failed to upload to IPFS');
        }
    },

    async uploadFile(file: Buffer, filename: string, mimetype: string) {
        const formData = new FormData();
        const fileBlob = new Blob([file], { type: mimetype });
        formData.append('file', fileBlob, filename);

        try {
            const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: 'POST',
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(`Pinata API Error: ${res.status} ${res.statusText} - ${errorData}`);
            }

            const responseData = await res.json();
            return {
                ipfsHash: responseData.IpfsHash,
                gatewayUrl: `https://gateway.pinata.cloud/ipfs/${responseData.IpfsHash}`,
            };
        } catch (error) {
            console.error('Pinata file upload error:', error);
            throw new Error('Failed to upload file to IPFS');
        }
    },

    async getFromIPFS(hash: string) {
        try {
            const res = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(`Pinata API Error: ${res.status} ${res.statusText} - ${errorData}`);
            }

            return res.json();
        } catch (error) {
            console.error('IPFS fetch error:', error);
            throw new Error('Failed to fetch from IPFS');
        }
    },
};

