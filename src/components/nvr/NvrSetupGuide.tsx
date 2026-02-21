'use client';

import { useState } from 'react';

interface Step {
  title: string;
  badge?: string;
  content: React.ReactNode;
}

function Code({ children }: { children: string }) {
  return (
    <code className="block bg-gray-900 border border-gray-700 rounded-md p-3 text-sm text-green-400 font-mono whitespace-pre overflow-x-auto">
      {children}
    </code>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 bg-blue-950/40 border border-blue-800/50 rounded-md p-3 text-blue-300 text-sm">
      <span>ℹ</span>
      <span>{children}</span>
    </div>
  );
}

function Once({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 bg-green-950/40 border border-green-800/50 rounded-md p-3 text-green-300 text-sm">
      <span>✓</span>
      <span>{children}</span>
    </div>
  );
}

export default function NvrSetupGuide() {
  const [openStep, setOpenStep] = useState<number | null>(0);

  const steps: Step[] = [
    {
      title: 'Step 1 — Configure go2rtc for your Dahua NVR',
      badge: 'One-time',
      content: (
        <div className="space-y-3 text-gray-300">
          <p>
            go2rtc bridges your Dahua RTSP streams into HLS. Run it on any machine
            on the same network as the NVR (a Raspberry Pi, NAS, PC, or the NVR host itself).
          </p>
          <p className="font-medium text-white">
            Edit <code className="bg-gray-800 px-1 rounded text-sm">nvr-setup/go2rtc.yaml</code> — replace
            the IP, password, and add/remove channels:
          </p>
          <Code>{`streams:
  cam1: rtsp://admin:YOUR_PASSWORD@192.168.1.100:554/cam/realmonitor?channel=1&subtype=0
  cam2: rtsp://admin:YOUR_PASSWORD@192.168.1.100:554/cam/realmonitor?channel=2&subtype=0
  cam3: rtsp://admin:YOUR_PASSWORD@192.168.1.100:554/cam/realmonitor?channel=3&subtype=0
  cam4: rtsp://admin:YOUR_PASSWORD@192.168.1.100:554/cam/realmonitor?channel=4&subtype=0`}</Code>
          <Note>
            Use <strong>subtype=0</strong> (main stream, higher quality) or <strong>subtype=1</strong> (sub-stream,
            lower bandwidth). Sub-stream is usually fine for Google Home viewing.
          </Note>
        </div>
      ),
    },
    {
      title: 'Step 2 — Create a permanent Cloudflare Tunnel (run once, lasts forever)',
      badge: 'One-time',
      content: (
        <div className="space-y-4 text-gray-300">
          <p>
            The tunnel gives go2rtc a fixed public HTTPS URL that <strong>never changes</strong> — even
            after reboots, ISP IP changes, or Docker restarts. No port forwarding needed.
          </p>

          <div className="space-y-1">
            <p className="font-medium text-white">Prerequisites:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>A domain with DNS managed by Cloudflare (free account). Any cheap domain works — even a $1/year one.</li>
              <li>Docker + Docker Compose on the machine running go2rtc.</li>
            </ul>
          </div>

          <p className="font-medium text-white">Run the one-shot setup script:</p>
          <Code>{`# From the nvr-setup/ directory:
bash setup.sh go2rtc.yourdomain.com`}</Code>
          <p>The script will:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Install cloudflared if it&apos;s not present.</li>
            <li>Open a browser to log in to your Cloudflare account.</li>
            <li>Create a named tunnel called <code className="bg-gray-800 px-1 rounded">nvr-go2rtc</code>.</li>
            <li>Create the DNS CNAME record automatically.</li>
            <li>Write <code className="bg-gray-800 px-1 rounded">cloudflared/credentials.json</code> and <code className="bg-gray-800 px-1 rounded">cloudflared/config.yml</code>.</li>
            <li>Print your permanent URL and the exact env var to set.</li>
          </ol>
          <Once>
            After this, your URL (<strong>https://go2rtc.yourdomain.com</strong>) never changes. You will
            never need to update <code className="bg-gray-800 px-1 rounded text-xs">GO2RTC_BASE_URL</code> again.
          </Once>
        </div>
      ),
    },
    {
      title: 'Step 3 — Start everything (auto-restarts on reboot)',
      badge: 'One-time',
      content: (
        <div className="space-y-3 text-gray-300">
          <p>
            From the <code className="bg-gray-800 px-1 rounded text-sm">nvr-setup/</code> directory:
          </p>
          <Code>{`docker compose up -d`}</Code>
          <p>
            Both containers use <strong>restart: always</strong> — they start automatically when the machine
            boots and restart themselves if they crash.
          </p>
          <p>Verify go2rtc is running:</p>
          <Code>{`# Local dashboard
open http://localhost:1984

# Public URL (through the tunnel)
curl -I https://go2rtc.yourdomain.com/api/streams`}</Code>
          <Note>
            If you prefer to run cloudflared as a system service instead of Docker, the setup script
            prints the <code>systemctl</code> commands at the end.
          </Note>
        </div>
      ),
    },
    {
      title: 'Step 4 — Set environment variables in Vercel (set once, never touch again)',
      badge: 'One-time',
      content: (
        <div className="space-y-3 text-gray-300">
          <p>
            In your Vercel project → <strong>Settings → Environment Variables</strong>, add:
          </p>
          <Code>{`# The permanent URL from setup.sh — never changes
GO2RTC_BASE_URL=https://go2rtc.yourdomain.com

# Camera names — one pair per channel
CAM_1_NAME=Front Door
CAM_1_STREAM=cam1
CAM_2_NAME=Backyard
CAM_2_STREAM=cam2
CAM_3_NAME=Garage
CAM_3_STREAM=cam3
CAM_4_NAME=Driveway
CAM_4_STREAM=cam4

# Choose any values — shared only between you and Google Home
OAUTH_CLIENT_ID=dahua-nvr-google-home
OAUTH_CLIENT_SECRET=<random-secret>

# Generate with:  openssl rand -hex 32
OAUTH_ACCESS_TOKEN=<random-hex>`}</Code>
          <Once>
            These never need to change. GO2RTC_BASE_URL is permanent (named tunnel).
            Camera names only change if you physically add/rename cameras.
          </Once>
        </div>
      ),
    },
    {
      title: 'Step 5 — Register Google Home Smart Home Action (one-time, permanent)',
      badge: 'One-time',
      content: (
        <div className="space-y-3 text-gray-300">
          <p>
            This registers this app as a Google Home integration. You do it once — it never needs
            to be re-registered as long as your Vercel URL stays the same.
          </p>
          <ol className="list-decimal list-inside space-y-3">
            <li>
              Go to{' '}
              <a
                href="https://console.home.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                console.home.google.com
              </a>{' '}
              → <strong>New project</strong> → give it any name (e.g. &quot;My NVR&quot;).
            </li>
            <li>
              <strong>Develop → Actions → Add action → Smart Home</strong>. Set fulfillment URL:
              <Code>{`https://YOUR-APP.vercel.app/api/smart-home`}</Code>
            </li>
            <li>
              <strong>Develop → Account linking → OAuth 2.0 / Authorization Code</strong>. Set:
              <Code>{`Grant type:        Authorization Code
Authorization URL: https://YOUR-APP.vercel.app/api/oauth/authorize
Token URL:         https://YOUR-APP.vercel.app/api/oauth/token
Client ID:         <value of OAUTH_CLIENT_ID>
Client Secret:     <value of OAUTH_CLIENT_SECRET>
Scopes:            profile`}</Code>
            </li>
            <li>
              <strong>Manage → Test → Add test user</strong> — add your Google account email.
            </li>
          </ol>
          <Once>
            The fulfillment and OAuth URLs are on Vercel — they are stable and permanent. This action
            never needs to be re-registered.
          </Once>
        </div>
      ),
    },
    {
      title: 'Step 6 — Link in Google Home app and start using it',
      badge: 'One-time',
      content: (
        <div className="space-y-3 text-gray-300">
          <ol className="list-decimal list-inside space-y-2">
            <li>Open the <strong>Google Home</strong> app on your phone.</li>
            <li>
              Tap <strong>+</strong> → <strong>Set up device</strong> →{' '}
              <strong>Works with Google</strong>.
            </li>
            <li>Search for your project name and tap it.</li>
            <li>Complete the account linking flow (one browser redirect).</li>
            <li>Your cameras appear in Google Home immediately.</li>
          </ol>
          <div className="mt-3 space-y-2">
            <p className="font-medium text-white">What you can do:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Tap a camera tile in the Home app to watch live on your phone.</li>
              <li>Cast to a <strong>Nest Hub, Nest Hub Max</strong> or <strong>Chromecast with Google TV</strong>.</li>
              <li>
                Say <em>&quot;Hey Google, show the front door camera on the living room TV.&quot;</em>
              </li>
            </ul>
          </div>
          <Note>
            If cameras don&apos;t appear after linking, say <em>&quot;Hey Google, sync my devices.&quot;</em>
          </Note>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={i} className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            className="w-full text-left px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
            onClick={() => setOpenStep(openStep === i ? null : i)}
          >
            <span className="flex items-center gap-3">
              <span className="font-medium text-white">{step.title}</span>
              {step.badge && (
                <span className="text-xs bg-green-900 text-green-300 border border-green-700 px-2 py-0.5 rounded-full">
                  {step.badge}
                </span>
              )}
            </span>
            <span className="text-gray-400 shrink-0">{openStep === i ? '▲' : '▼'}</span>
          </button>
          {openStep === i && (
            <div className="px-4 py-4 bg-gray-900/50 text-sm border-t border-gray-700">
              {step.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
