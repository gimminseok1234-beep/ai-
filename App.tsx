import React, { useState, useCallback } from 'react';
import Controls from './components/Controls';
import NovelViewer from './components/NovelViewer';
import { generateNovelStream } from './services/geminiService';
import { NovelSettings, DEFAULT_SETTINGS } from './types';

function App() {
  const [settings, setSettings] = useState<NovelSettings>(DEFAULT_SETTINGS);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!settings.synopsis) return;

    setIsLoading(true);
    setError(null);
    setGeneratedContent(""); // Clear previous content

    try {
      await generateNovelStream(settings, (chunk) => {
        setGeneratedContent((prev) => prev + chunk);
      });
    } catch (err) {
      setError("소설 생성 중 오류가 발생했습니다. API 키를 확인하거나 잠시 후 다시 시도해주세요.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-900 text-gray-100">
      {/* Left Sidebar: 30% width on large screens, hidden on small if reading? No, let's keep side-by-side for desktop */}
      <aside className="w-full md:w-[400px] h-full flex-shrink-0 z-20 shadow-xl">
        <Controls 
          settings={settings} 
          setSettings={setSettings} 
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />
      </aside>

      {/* Right Content: Viewer */}
      <main className="flex-1 h-full relative">
        <NovelViewer 
          content={generatedContent} 
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}

export default App;