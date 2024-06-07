export const CONTRACT_ADDRESS = 'EQC3FRoofH_NRIn_M-VyvqW7Dtodh2EAN378Iz8l9uDR9d8v';
export const JETTON_MINTER_ADDRESS = 'EQAO_g3zYDPJd8vwxzSPjspogpnEbI1oF4BWtcwvWnaLh3Sc';
export const NETWORK = 'testnet';
export const TREASURY_ADDRESS = 'UQBfyTQRWItvjCETMnFmPwfByLHCeIZ_gQbt0MgW67GRdnA6';
export const TRACE_API = NETWORK == 'testnet'
    ? 'https://testnet.tonapi.io/v2/traces/'
    : 'https://tonapi.io/v2/traces/';
export const CONTRACT_TRACK_API = NETWORK == 'testnet'
    ? `https://testnet.tonapi.io/v2/blockchain/accounts/${CONTRACT_ADDRESS}/transactions?limit=1000`
    : `https://tonapi.io/v2/blockchain/accounts/${CONTRACT_ADDRESS}/transactions?limit=1000`;