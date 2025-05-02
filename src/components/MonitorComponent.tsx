'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { Howl } from 'howler';
import { Settings } from '../lib/db/settings';

const packageInfo = {
  version: '0.1.0',
  author: 'takumi-goto'
};

export default function MonitorComponent() {
  const [viewEventId, setViewEventId] = useState<string | undefined>();
  const [soundPlay, setSoundPlay] = useState(false);
  const [eventIdList, setEventIdList] = useState<string[]>([]);
  const { status, start, close, telegrams } = useWebSocket();
  
  useEffect(() => {
    const sound = new Howl({ src: ['/assets/sound/sound.mp3'] });
    const loadSoundSettings = async () => {
      if (sound.state() === 'loaded') {
        const spAa = await Settings.get('soundPlayAutoActivation');
        setSoundPlay(spAa ?? false);
      }
    };

    sound.on('load', loadSoundSettings);
    
    return () => {
      sound.off('load');
    };
  }, []);

  const webSocketIsStartingOK = () => {
    return [null, 'closed', 'error'].includes(status);
  };

  const handleSoundPlaySetting = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const is = event.target.checked;
    setSoundPlay(is);
    await Settings.set('soundPlayAutoActivation', is);
  };

  return (
    <div className="w-screen h-screen bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl mb-4">地震情報モニター</h1>
        <div className="flex items-center space-x-4 mb-4">
          {webSocketIsStartingOK() ? (
            <button className="px-4 py-2 bg-blue-500 rounded" onClick={start}>WebSocket接続を開始</button>
          ) : (
            <button className="px-4 py-2 bg-red-500 rounded" onClick={close}>WebSocket接続を終了</button>
          )}
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="soundPlay" 
              checked={soundPlay} 
              onChange={handleSoundPlaySetting}
              className="mr-2"
            />
            <label htmlFor="soundPlay">サウンド再生</label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded">
            <h2 className="text-xl mb-2">受信データ</h2>
            <div className="h-64 overflow-y-auto">
              {telegrams.length === 0 ? (
                <p>データがありません</p>
              ) : (
                <ul>
                  {telegrams.map((telegram, index) => (
                    <li key={index} className="mb-2 p-2 bg-gray-600 rounded">
                      {JSON.stringify(telegram).substring(0, 100)}...
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded">
            <h2 className="text-xl mb-2">イベント履歴</h2>
            <div className="h-64 overflow-y-auto">
              {eventIdList.length === 0 ? (
                <p>イベントがありません</p>
              ) : (
                <ul>
                  {eventIdList.map((eventId) => (
                    <li 
                      key={eventId} 
                      className={`mb-2 p-2 rounded cursor-pointer ${viewEventId === eventId ? 'bg-blue-600' : 'bg-gray-600'}`}
                      onClick={() => setViewEventId(eventId)}
                    >
                      {eventId}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
