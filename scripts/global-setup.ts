import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080';
const XAMPP_DIR = process.env.XAMPP_DIR ?? 'C:\\xampp';
const TIMEOUT_MS = Number(process.env.WAIT_TIMEOUT_MS ?? 180000);
const SERVER_MODE = process.env.SERVER_MODE ?? 'docker';

function buildLoginUrl(baseUrl: string): string {
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    return `${cleanBaseUrl}/web/index.php/auth/login`;
}

function runXampp(exeName: string): void {
    const exePath = path.join(XAMPP_DIR, exeName);

    if (!fs.existsSync(exePath)) {
        throw new Error(
            `XAMPP executable not found: ${exePath}\n` + 'Set XAMPP_DIR env var if your install path is different.'
        );
    }

    console.log(`[SETUP] Starting XAMPP via: ${exePath}`);
    const result = spawnSync(exePath, { cwd: XAMPP_DIR, stdio: 'inherit' });

    if (typeof result.status === 'number' && result.status !== 0) {
        throw new Error(`Failed to run ${exeName}. Exit code: ${result.status}`);
    }
}

function pingOnce(urlString: string): Promise<boolean> {
    return new Promise((resolve) => {
        const url = new URL(urlString);
        const client = url.protocol === 'https:' ? https : http;

        const request = client.request(
            {
                method: 'GET',
                hostname: url.hostname,
                port: url.port ? Number(url.port) : url.protocol === 'https:' ? 443 : 80,
                path: `${url.pathname}${url.search}`,
                timeout: 5000,
            },
            (response) => {
                const statusCode = response.statusCode ?? 0;
                response.resume();
                resolve(statusCode >= 200 && statusCode < 400);
            }
        );

        request.on('timeout', () => {
            request.destroy();
            resolve(false);
        });

        request.on('error', () => resolve(false));
        request.end();
    });
}

async function waitForUrl(url: string, timeoutMs: number): Promise<void> {
    const start = Date.now();

    process.stdout.write(`[SETUP] Waiting for ${url}`);

    while (Date.now() - start < timeoutMs) {
        const isReady = await pingOnce(url);

        if (isReady) {
            process.stdout.write('  [READY]\n');
            return;
        }

        process.stdout.write('.');
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    process.stdout.write('\n');
    throw new Error(`Timed out after ${timeoutMs}ms waiting for ${url}`);
}

export default async function globalSetup(): Promise<void> {
    const loginUrl = buildLoginUrl(BASE_URL);

    if (SERVER_MODE === 'docker' || process.env.CI === 'true') {
        console.log('[SETUP] Docker/CI mode detected. Skipping XAMPP start.');
        await waitForUrl(loginUrl, TIMEOUT_MS);
        console.log('[SETUP] Environment is ready. Starting tests...');
        return;
    }

    if (process.platform !== 'win32') {
        console.log('[SETUP] Non-Windows environment detected. Skipping XAMPP start.');
        await waitForUrl(loginUrl, TIMEOUT_MS);
        console.log('[SETUP] Environment is ready. Starting tests...');
        return;
    }

    runXampp('xampp_start.exe');
    await waitForUrl(loginUrl, TIMEOUT_MS);
    console.log('[SETUP] Environment is ready. Starting tests...');
}
