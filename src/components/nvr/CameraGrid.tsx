'use client';

import { useState } from 'react';
import CameraPlayer from './CameraPlayer';

interface Camera {
  id: string;
  name: string;
  streamName: string;
}

interface CameraGridProps {
  go2rtcBaseUrl: string;
  cameras: Camera[];
}

export default function CameraGrid({ go2rtcBaseUrl, cameras }: CameraGridProps) {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  if (!go2rtcBaseUrl) {
    return (
      <div className="rounded-lg border border-dashed border-gray-700 p-8 text-center text-gray-400">
        <p className="text-lg font-medium mb-1">go2rtc not configured</p>
        <p className="text-sm">Set the <code className="bg-gray-800 px-1 rounded">GO2RTC_BASE_URL</code> environment variable to see live feeds.</p>
      </div>
    );
  }

  if (cameras.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-700 p-8 text-center text-gray-400">
        <p className="text-lg font-medium mb-1">No cameras configured</p>
        <p className="text-sm">Add <code className="bg-gray-800 px-1 rounded">CAM_1_NAME=&quot;Front Door&quot;</code> etc. to your environment variables.</p>
      </div>
    );
  }

  const visibleCameras = selectedCamera
    ? cameras.filter((c) => c.id === selectedCamera)
    : cameras;

  return (
    <div>
      {/* Camera selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setSelectedCamera(null)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            selectedCamera === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All cameras
        </button>
        {cameras.map((cam) => (
          <button
            key={cam.id}
            onClick={() => setSelectedCamera(cam.id === selectedCamera ? null : cam.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedCamera === cam.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cam.name}
          </button>
        ))}
      </div>

      {/* Camera grid */}
      <div
        className={`grid gap-3 ${
          visibleCameras.length === 1
            ? 'grid-cols-1 max-w-3xl'
            : visibleCameras.length <= 4
            ? 'grid-cols-2'
            : 'grid-cols-3'
        }`}
      >
        {visibleCameras.map((cam) => (
          <CameraPlayer
            key={cam.id}
            label={cam.name}
            streamUrl={`${go2rtcBaseUrl}/api/stream.m3u8?src=${cam.streamName}`}
            snapshotUrl={`${go2rtcBaseUrl}/api/frame.jpeg?src=${cam.streamName}`}
          />
        ))}
      </div>
    </div>
  );
}
