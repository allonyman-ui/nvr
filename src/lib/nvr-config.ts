export interface Camera {
  id: string;
  channel: number;
  name: string;
  streamName: string; // go2rtc stream name (e.g. "cam1")
}

export interface NvrConfig {
  nvrHost: string;
  nvrUsername: string;
  nvrPassword: string;
  go2rtcBaseUrl: string; // public HTTPS URL, e.g. https://yourname.trycloudflare.com
  cameras: Camera[];
}

/**
 * Reads camera definitions from environment variables.
 * Set CAM_1_NAME="Front Door" (and optionally CAM_1_STREAM="cam1") for each camera.
 * Server-side only.
 */
export function getCamerasFromEnv(): Camera[] {
  const cameras: Camera[] = [];
  for (let i = 1; i <= 16; i++) {
    const name = process.env[`CAM_${i}_NAME`];
    if (name) {
      cameras.push({
        id: `cam-${i}`,
        channel: i,
        name,
        streamName: process.env[`CAM_${i}_STREAM`] || `cam${i}`,
      });
    }
  }
  return cameras;
}

/** Server-side NVR config from environment variables. */
export function getNvrConfig(): NvrConfig {
  return {
    nvrHost: process.env.NVR_HOST || '',
    nvrUsername: process.env.NVR_USERNAME || 'admin',
    nvrPassword: process.env.NVR_PASSWORD || '',
    go2rtcBaseUrl: process.env.GO2RTC_BASE_URL || '',
    cameras: getCamerasFromEnv(),
  };
}
