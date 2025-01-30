export function getQuantityString(count: number, one: string, few: string, many: string) {
    const mod100 = count % 100

    if (mod100 >= 11 && mod100 <= 14) {
        return many
    }

    switch (count % 10) {
        case 1:
            return one
        case 2:
        case 3:
        case 4:
            return few
        default:
            return many
    }
}