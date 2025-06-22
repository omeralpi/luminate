import { trpc } from '@/trpc/client';
import {
    isConnected as isFreighterConnected,
    requestAccess,
    signMessage,
} from '@stellar/freighter-api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useWallet = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const utils = trpc.useUtils();

    const getChallengeMutation = trpc.auth.getChallenge.useMutation();
    const authenticateMutation = trpc.auth.authenticate.useMutation({
        onSuccess: () => {
            utils.auth.getSession.invalidate();
            router.refresh();
        },
    });

    const disconnectMutation = trpc.auth.disconnect.useMutation({
        onSuccess: () => {
            utils.auth.getSession.invalidate();
            router.refresh();
        },
    });

    const { data: session, isLoading: sessionLoading } = trpc.auth.getSession.useQuery();

    const walletAddress = session?.user?.walletAddress || null;
    const isAuthenticated = !!walletAddress;

    const connectWallet = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const freighterInstalled = await isFreighterConnected();
            if (!freighterInstalled) {
                throw new Error('Please install Freighter wallet extension');
            }


            const accessResult = await requestAccess();
            if (!accessResult || !accessResult.address) {
                throw new Error('Wallet access denied');
            }

            const publicKey = accessResult.address;

            if (walletAddress === publicKey) {
                setError('Already connected with this wallet');
                return;
            }

            const { challenge, message } = await getChallengeMutation.mutateAsync({
                walletAddress: publicKey
            });

            const signResult = await signMessage(message, {
                address: publicKey,
            });

            if (!signResult || signResult.error) {
                throw new Error(signResult.error?.message || 'Message signing cancelled');
            }

            await authenticateMutation.mutateAsync({
                walletAddress: publicKey,
                signerAddress: signResult.signerAddress,
                challenge: challenge,
            });
        } catch (error) {
            console.error('Wallet connection error:', error);
            setError(error instanceof Error ? error.message : 'Connection failed');
        } finally {
            setIsLoading(false);
        }
    };

    const disconnect = async () => {
        try {
            setIsLoading(true);
            await disconnectMutation.mutateAsync();
        } catch (error) {
            console.error('Disconnect error:', error);
            setError('Failed to disconnect');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        walletAddress,
        isAuthenticated,

        isLoading: isLoading || sessionLoading,
        isSessionLoading: sessionLoading,

        error,

        connectWallet,
        disconnect,

        user: session?.user,
    };
};