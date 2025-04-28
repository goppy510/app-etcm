'use client';

import React, { useState } from 'react';
import MonitorComponent from './MonitorComponent';

interface MainComponentProps {
  status?: 'ok' | 'loading' | 'no-contract' | 'no-auth';
  initMode: boolean;
  packageInfo: {
    version: string;
    author: string;
  };
  onInit: () => Promise<void>;
}

export default function MainComponent({ status, initMode, packageInfo, onInit }: MainComponentProps) {
  if (!initMode && status === 'ok') {
    return <MonitorComponent />;
  }

  return (
    <div className="relative flex w-screen h-screen bg-primary">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit text-center text-white">
        {!initMode && (
          <div className="text-xl">
            {status === 'no-contract' && (
              <div>
                <p>現在、地震津波関連の契約がないため情報が表示できません。</p>
              </div>
            )}
            
            {status === 'no-auth' && (
              <div>
                <p>認可情報が取り消されました。アプリケーション再連携を行ってください。</p>
                
                <div 
                  className="w-fit mx-auto my-1 p-1 cursor-pointer border border-accent rounded bg-secondary"
                  onClick={() => onInit()}
                >
                  アプリケーション再連携
                </div>
              </div>
            )}
            
            {status === 'loading' && (
              <div>
                <p>Now loading...</p>
              </div>
            )}
            
            {!status && (
              <div>
                <p>Now process...</p>
              </div>
            )}
          </div>
        )}
        
        {initMode && (
          <div>
            <h1 className="text-2xl font-bold">地震情報ビューア</h1>
            <p>これは、地震情報をリアルタイムに更新する情報パネルです。</p>
            <p><a href="https://dmdata.jp" className="text-white">dmdata.jp</a>の「地震・津波関連」を契約している方のみ使用できます。</p>
            <p>WebSocketまたはPuLLリクエストを行い情報を取得しています。</p>
            <br />
            <p>このアプリケーションを使用するには、以下のアプリケーション連携をしてください。</p>
            <div 
              className="w-fit mx-auto my-1 p-1 cursor-pointer border border-accent rounded bg-secondary"
              onClick={() => onInit()}
            >
              アプリケーション連携
            </div>
          </div>
        )}
      </div>

      <div className="text-sm mt-auto mx-auto mb-1 text-center text-white">
        <p>ETCM - v.{packageInfo.version}</p>
        <p>&copy; {packageInfo.author}</p>
        <p>by DMDATA.JP</p>
      </div>
    </div>
  );
}
