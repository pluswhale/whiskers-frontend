export function getCountOfNeededReferral(countReferrals: number | null, level: number) {
    if (countReferrals === null || !level) {
        return '0';
    }

    switch (level) {
        case 1:
            return String(30 - countReferrals);
        case 2:
            return String(100 - countReferrals);
    }
}

