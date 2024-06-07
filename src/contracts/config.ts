export const CONTRACT_ADDRESS = 'EQC3FRoofH_NRIn_M-VyvqW7Dtodh2EAN378Iz8l9uDR9d8v';
export const JETTON_MINTER_ADDRESS = 'EQAO_g3zYDPJd8vwxzSPjspogpnEbI1oF4BWtcwvWnaLh3Sc';
export const NETWORK = 'testnet';
export const TREASURY_ADDRESS = 'EQAYb6q5B0cA5rYuOw6czluN_McV9Q9k_nTtS97kfEEBR1NN';
export const TRACE_API = NETWORK == 'testnet'
    ? 'https://testnet.tonapi.io/v2/traces/'
    : 'https://tonapi.io/v2/traces/';
export const CONTRACT_TRACK_API = NETWORK == 'testnet'
    ? `https://testnet.tonapi.io/v2/blockchain/accounts/${CONTRACT_ADDRESS}/transactions?limit=1000`
    : `https://tonapi.io/v2/blockchain/accounts/${CONTRACT_ADDRESS}/transactions?limit=1000`;
export const TREASURY_TRACK_API = NETWORK == 'testnet'
    ? `https://testnet.tonapi.io/v2/blockchain/accounts/${TREASURY_ADDRESS}/transactions?limit=1000`
    : `https://tonapi.io/v2/blockchain/accounts/${TREASURY_ADDRESS}/transactions?limit=1000`;
export const SPIN_100_PRICE = 3600;
export const SPIN_250_PRICE = 8900;
export const SPIN_500_PRICE = 17700;
export const SPIN_1000_PRICE = 35200;