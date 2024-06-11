import { Cell, beginCell, storeMessage, TonClient } from "@ton/ton";
import { Address } from '@ton/core';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { NETWORK } from "./config";

export async function retry<T>(fn: () => Promise<T>, options: { retries: number, delay: number }): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < options.retries; i++) {
        try {
            return await fn();
        } catch (e) {
            if (e instanceof Error) {
                lastError = e;
            }
            await new Promise(resolve => setTimeout(resolve, options.delay));
        }
    }
    throw lastError;
}

export async function getTxByBOC(senderAddress: Address, exBoc: string): Promise<string> {

    const client = new TonClient({
        endpoint: await getHttpEndpoint({ network: NETWORK }),
    });

    return retry(async () => {
        const transactions = await client.getTransactions(senderAddress, {
            limit: 5,
        });
        for (const tx of transactions) {
            const inMsg = tx.inMessage;
            if (inMsg?.info.type === 'external-in') {

                const inBOC = inMsg?.body;
                if (typeof inBOC === 'undefined') {

                    Promise.reject(new Error('Invalid external'));
                    continue;
                }
                const extHash = Cell.fromBase64(exBoc).hash().toString('hex')
                const inHash = beginCell().store(storeMessage(inMsg)).endCell().hash().toString('hex')

                // Assuming `inBOC.hash()` is synchronous and returns a hash object with a `toString` method
                if (extHash === inHash) {
                    const txHash = tx.hash().toString('hex');
                    return (txHash);
                }
            }
        }
        throw new Error('Transaction not found');
    }, { retries: 30, delay: 1000 });
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}