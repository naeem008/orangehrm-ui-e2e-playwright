import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

async function globalTeardown() {
    if (process.platform !== 'win32') return;

    const XAMPP_DIR = process.env.XAMPP_DIR ?? 'C:\\xampp';
    const exePath = path.join(XAMPP_DIR, 'xampp_stop.exe');

    if (fs.existsSync(exePath)) {
        console.log(`\n[TEARDOWN] Stopping XAMPP Server...`);
        spawnSync(exePath, { cwd: XAMPP_DIR, stdio: 'inherit' });
        console.log(`[TEARDOWN] Server stopped gracefully.`);
    }
}

export default globalTeardown;
