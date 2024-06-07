export abstract class Op {
    static transfer = 0xf8a7ea5;
    static transfer_notification = 0x7362d09c;
    static internal_transfer = 0x178d4519;
    static excesses = 0xd53276db;
    static burn = 0x595f07bc;
    static burn_notification = 0x7bdd97de;

    static provide_wallet_address = 0x2c76b973;
    static take_wallet_address = 0xd1735400;
    static deploy = 0x610ca46c;
    static mint = 21;
    static owner_withdraw_jetton = 3;
    static owner_withdraw_ton = 4;
    static change_owner = 5;
    static update_merkle_root = 6;
}