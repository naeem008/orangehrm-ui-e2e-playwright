import fs from 'fs';

export default async function globalTeardown() {
    const sessionPath = 'playwright/.auth/admin.json';

    if (fs.existsSync(sessionPath)) {
        fs.unlinkSync(sessionPath);
        console.log('Session file (admin.json) deleted successfully during teardown.');
    }
}