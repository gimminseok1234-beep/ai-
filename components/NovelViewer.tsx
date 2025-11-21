import React, { useEffect, useRef } from 'react';
import { Copy, Download, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface NovelViewerProps {
  content: string;
  isLoading: boolean;
  error: string | null;
}

const NovelViewer: React.FC<NovelViewerProps> = ({ content, isLoading, error }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [content, isLoading]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert("원고가 복사되었습니다.");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "novel_draft.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-400 p-8 text-center">
        <div className="bg-red-900/20 p-4 rounded-full mb-4">
          <AlertTriangleIcon size={48} />
        </div>
        <h3 className="text-xl font-bold mb-2">오류가 발생했습니다</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!content && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <RefreshCw size={64} className="mb-6 opacity-20" />
        <p className="text-lg">왼쪽 설정에서 시놉시스를 입력하고 생성을 시작하세요.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 relative">
      {/* Toolbar */}
      <div className="absolute top-4 right-8 flex gap-2 z-10">
        <button 
          onClick={handleCopy}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition-colors shadow-lg"
          title="복사하기"
        >
          <Copy size={18} />
        </button>
        <button 
          onClick={handleDownload}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 transition-colors shadow-lg"
          title="txt로 다운로드"
        >
          <Download size={18} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <div className="novel-text text-lg text-gray-200 whitespace-pre-wrap leading-loose">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          
          {isLoading && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2 animate-pulse">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};

const AlertTriangleIcon = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/>
    <path d="M12 17h.01"/>
  </svg>
);

export default NovelViewer;