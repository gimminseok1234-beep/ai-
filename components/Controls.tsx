import React, { useRef } from 'react';
import { BookOpen, Upload, AlertTriangle, Settings2 } from 'lucide-react';
import { NovelSettings, POV } from '../types';

interface ControlsProps {
  settings: NovelSettings;
  setSettings: React.Dispatch<React.SetStateAction<NovelSettings>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const Controls: React.FC<ControlsProps> = ({ settings, setSettings, onGenerate, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof NovelSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleChange('referenceText', text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 bg-gray-800/50 border-r border-gray-700 overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
          <BookOpen className="text-indigo-400" />
          NovelCraft AI
        </h2>
        <p className="text-gray-400 text-sm">Create immersive stories with Gemini</p>
      </div>

      {/* Synopsis */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">시놉시스 / 줄거리</label>
        <textarea
          className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          placeholder="주인공은 사실 마왕이었는데, 용사와 사랑에 빠져서..."
          value={settings.synopsis}
          onChange={(e) => handleChange('synopsis', e.target.value)}
        />
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* POV */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">시점 (Point of View)</label>
          <select
            className="bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-sm text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
            value={settings.pov}
            onChange={(e) => handleChange('pov', e.target.value as POV)}
          >
            {Object.values(POV).map((pov) => (
              <option key={pov} value={pov}>{pov}</option>
            ))}
          </select>
        </div>

        {/* Length */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-300">목표 분량 (글자 수)</label>
            <span className="text-xs text-indigo-400">{settings.targetLength} 자</span>
          </div>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={settings.targetLength}
            onChange={(e) => handleChange('targetLength', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      </div>

      {/* Style Learning */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300 flex justify-between items-center">
          학습용 원고 (스타일 모방)
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <Upload size={12} /> txt 파일 업로드
          </button>
        </label>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".txt" 
          onChange={handleFileUpload} 
        />
        <textarea
          className="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          placeholder="여기에 텍스트를 붙여넣거나 파일을 업로드하면, AI가 문체를 학습하여 비슷하게 작성합니다."
          value={settings.referenceText}
          onChange={(e) => handleChange('referenceText', e.target.value)}
        />
      </div>

      {/* Mature Toggle */}
      <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-900/50 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-500" size={16} />
          <span className="text-sm text-red-200 font-medium">19+ (성인 모드)</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={settings.isMature}
            onChange={(e) => handleChange('isMature', e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={onGenerate}
          disabled={isLoading || !settings.synopsis}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2
            ${isLoading 
              ? 'bg-gray-700 cursor-not-allowed' 
              : !settings.synopsis 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20'
            }`}
        >
          {isLoading ? (
            <>
              <Settings2 className="animate-spin" /> 작성 중...
            </>
          ) : (
            "소설 생성하기"
          )}
        </button>
      </div>
    </div>
  );
};

export default Controls;