export function getCountOfNeededReferral(countReferrals: number, level: number) {
    switch (level) {
        case 1:
            return String(30 - countReferrals);
        case 2:
            return String(100 - countReferrals);
    }
}

