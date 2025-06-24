import * as bcrypt from 'bcrypt';
export interface RefreshTokenEntry {
    tokenHash: string;
    userAgent?: string;
    ip?: string;
    createdAt?: Date;
}
export async function findMatchingTokenIndex(
    token: string,
    tokenHashes: { tokenHash: string }[],
): Promise<number> {
    for (let i = 0; i < tokenHashes.length; i++) {
        const match = await bcrypt.compare(token, tokenHashes[i].tokenHash);
        if (match) return i;
    }
    return -1;
}
export async function filterOutMatchingToken(
    token: string,
    tokenHashes: RefreshTokenEntry[],
): Promise<RefreshTokenEntry[]> {
    const result: RefreshTokenEntry[] = [];

    for (const entry of tokenHashes) {
        const match = await bcrypt.compare(token, entry.tokenHash);
        if (!match) result.push(entry);
    }

    return result;
}

