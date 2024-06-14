export const CONTRACT_ADDRESS = 'EQDEgOGuXZE2XfHeQRPILtNDy6twOO3cYxBh9t3Qq6_0B3-F';
export const JETTON_MINTER_ADDRESS = 'EQCObh4-ZaghOva8uCz_AMMnvifM3PS-EppUJEJQXXnlP0zX';
export const NETWORK = 'mainnet';
export const TREASURY_ADDRESS = 'UQCLWHdSKY2XKj9Uq3k3cBFLSkvAeFkq2fuvbu70ZI_Klk6r';
export const TRACE_API = NETWORK == 'mainnet'
    ? 'https://tonapi.io/v2/traces/'
    : 'https://testnet.tonapi.io/v2/traces/';
export const CONTRACT_TRACK_API = NETWORK == 'mainnet'
    ? `https://tonapi.io/v2/blockchain/accounts/${CONTRACT_ADDRESS}/transactions?limit=1000`
    : `https://testnet.tonapi.io/v2/blockchain/accounts/${CONTRACT_ADDRESS}/transactions?limit=1000`;
export const TREASURY_TRACK_API = NETWORK == 'mainnet'
    ? `https://tonapi.io/v2/blockchain/accounts/${TREASURY_ADDRESS}/transactions?limit=1000`
    : `https://testnet.tonapi.io/v2/blockchain/accounts/${TREASURY_ADDRESS}/transactions?limit=1000`;
export const SPIN_100_PRICE = 3600;
export const SPIN_250_PRICE = 8900;
export const SPIN_500_PRICE = 17700;
export const SPIN_1000_PRICE = 35200;