export function isAdmin(email: string | null | undefined): boolean {
    if (!email) return false

    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
    return adminEmails.includes(email)
}

export function checkAdminAccess(email: string | null | undefined): void {
    if (!isAdmin(email)) {
        throw new Error('Unauthorized: Admin access required')
    }
}
