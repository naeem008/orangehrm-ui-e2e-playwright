import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';

function runXampp(exeName: string, xamppDir: string) {
    const exePath = path.join(xamppDir, exeName);
    if (!fs.existsSync(exePath)) {
        throw new Error(`XAMPP executable not found: ${exePath}`);
    }

    console.log(`\n[SETUP] Starting XAMPP via: ${exePath}`);
    const res = spawnSync(exePath, { cwd: xamppDir, stdio: 'inherit' });

    if (typeof res.status === 'number' && res.status !== 0) {
        throw new Error(`Failed to run ${exeName}. Exit code: ${res.status}`);
    }
}

function pingOnce(urlStr: string): Promise<boolean> {
    return new Promise((resolve) => {
        const u = new URL(urlStr);
        const lib = u.protocol === 'https:' ? https : http;

        const req = lib.request(
            {
                method: 'GET',
                hostname: u.hostname,
                port: u.port ? Number(u.port) : u.protocol === 'https:' ? 443 : 80,
                path: u.pathname + (u.search ?? ''),
                timeout: 5000,
            },
            (res) => {
                const ok = (res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 400;
                res.resume();
                resolve(ok);
            }
        );

        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
        req.on('error', () => resolve(false));
        req.end();
    });
}

async function waitForUrl(url: string, timeoutMs: number) {
    const start = Date.now();
    process.stdout.write(`[SETUP] Waiting for ${url} `);

    while (Date.now() - start < timeoutMs) {
        const ok = await pingOnce(url);
        if (ok) {
            process.stdout.write(' [READY]\n');
            return;
        }
        process.stdout.write('.');
        await new Promise((r) => setTimeout(r, 1000));
    }
    process.stdout.write('\n');
    throw new Error(`Timed out after ${timeoutMs}ms waiting for ${url}`);
}

async function globalSetup() {
    if (process.platform !== 'win32') {
        console.warn('[WARNING] This script targets Windows XAMPP. Skipping auto-start.');
        return;
    }

    // Default to your path if .env is missing [cite: 5, 6]
    const XAMPP_DIR = process.env.XAMPP_DIR ?? 'C:\\xampp';
    const BASE_URL = process.env.BASE_URL ?? 'http://localhost/orangehrm-5.8';
    const TIMEOUT_MS = Number(process.env.WAIT_TIMEOUT_MS ?? 60000);

    try {
        runXampp('xampp_start.exe', XAMPP_DIR);
        await waitForUrl(BASE_URL, TIMEOUT_MS);
        console.log(`[SETUP] Environment is ready. Starting tests...`);
    } catch (err: any) {
        console.error(`\n[ERROR] ${err?.message ?? err}`);
        process.exit(1);
    }
}

export default globalSetup;
