import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const XAMPP_DIR = process.env.XAMPP_DIR ?? 'C:\\xampp';
const SERVER_MODE = process.env.SERVER_MODE ?? 'docker';

function runXamppStop(): void {
    const exePath = path.join(XAMPP_DIR, 'xampp_stop.exe');

    if (!fs.existsSync(exePath)) {
        console.warn(`[TEARDOWN] XAMPP stop executable not found: ${exePath}`);
        return;
    }

    console.log('[TEARDOWN] Stopping XAMPP Server...');
    const result = spawnSync(exePath, { cwd: XAMPP_DIR, stdio: 'inherit' });

    if (typeof result.status === 'number' && result.status !== 0) {
        console.warn(`[TEARDOWN] xampp_stop.exe exited with code ${result.status}`);
    } else {
        console.log('[TEARDOWN] Server stopped gracefully.');
    }
}

export default async function globalTeardown(): Promise<void> {
    if (SERVER_MODE === 'docker' || process.env.CI === 'true') {
        console.log('[TEARDOWN] Docker/CI mode detected. Skipping XAMPP stop.');
        return;
    }

    if (process.platform !== 'win32') {
        console.log('[TEARDOWN] Non-Windows environment detected. Skipping XAMPP stop.');
        return;
    }

    runXamppStop();
}
