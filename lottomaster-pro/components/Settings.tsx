import React from 'react';
import { Settings as SettingsIcon, Bell, Database, Info, ChevronRight, RefreshCw, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="pb-24 px-4 pt-6 space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-white mb-6">설정</h1>

      {/* Data Update */}
      <section className="space-y-3">
        <h2 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">데이터 업데이트</h2>
        <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-lg text-primary">
                <RefreshCw size={20} />
              </div>
              <div>
                <div className="text-white font-medium">최신 회차 업데이트</div>
                <div className="text-xs text-gray-500">마지막 업데이트: 2024.02.24</div>
              </div>
            </div>
            <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
              업데이트
            </button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="text-gray-300 text-sm">자동 업데이트</div>
            <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-3">
        <h2 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">알림 설정</h2>
        <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="bg-accent/20 p-2 rounded-lg text-accent">
                <Bell size={20} />
              </div>
              <div className="text-white font-medium">당첨 결과 알림</div>
            </div>
            <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="text-gray-300 text-sm">구매 리마인드 (토요일)</div>
            <div className="w-10 h-6 bg-gray-600 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-3">
        <h2 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">데이터 관리</h2>
        <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-success/20 p-2 rounded-lg text-success">
                <Database size={20} />
              </div>
              <div className="text-white font-medium">저장된 조합 목록</div>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-danger/20 p-2 rounded-lg text-danger">
                <Trash2 size={20} />
              </div>
              <div className="text-white font-medium">분석 데이터 초기화</div>
            </div>
          </div>
        </div>
      </section>

      {/* App Info */}
      <section className="space-y-3">
        <h2 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">앱 정보</h2>
        <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="bg-gray-700/50 p-2 rounded-lg text-gray-300">
                <Info size={20} />
              </div>
              <div>
                <div className="text-white font-medium">버전 정보</div>
                <div className="text-xs text-gray-500">v1.0.0 (MVP)</div>
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors">
             <div className="text-gray-300 text-sm">고객 지원 및 피드백</div>
             <ChevronRight size={18} className="text-gray-500" />
          </div>
        </div>
      </section>
      
      <div className="text-center text-xs text-gray-600 pt-4">
        LottoMaster Pro &copy; 2024
      </div>
    </div>
  );
};

export default Settings;
