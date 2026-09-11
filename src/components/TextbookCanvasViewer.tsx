import { 
  useEffect, 
  useRef, 
  useState, 
  useCallback, 
  FormEvent,
  MouseEvent,
  TouchEvent,
  WheelEvent
} from 'react';
import * as pdfjsLib from 'pdfjs-dist';
// Provides window.pdfjsWorker.WorkerMessageHandler as a bulletproof fallback if workers are disabled in sandboxed iframes
import 'pdfjs-dist/build/pdf.worker.entry';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Download, 
  ExternalLink,
  RotateCcw,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Configure worker for pdfjs-dist via public worker script
if (typeof window !== 'undefined') {
  try {
    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(`${cleanBase}pdf.worker.min.js`, window.location.href).href;
    } catch {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `${cleanBase}pdf.worker.min.js`;
    }
  } catch (e) {
    console.warn('Could not initialize Worker via workerSrc:', e);
  }
}

// Global in-memory cache for PDF buffer so it's loaded only once across page switches
let cachedPdfData: Uint8Array | null = null;
let pdfLoadingPromise: Promise<pdfjsLib.PDFDocumentProxy> | null = null;

async function getOrLoadPdfDocument(): Promise<pdfjsLib.PDFDocumentProxy> {
  if (pdfLoadingPromise) {
    return pdfLoadingPromise;
  }

  pdfLoadingPromise = (async () => {
    let data: Uint8Array;
    if (cachedPdfData) {
      data = cachedPdfData;
    } else {
      let response: Response | null = null;
      try {
        response = await fetch('/History_schems.pdf');
      } catch {
        // network or relative error, fallback below
      }
      if (!response || !response.ok) {
        const base = import.meta.env.BASE_URL || './';
        const cleanBase = base.endsWith('/') ? base : `${base}/`;
        response = await fetch(`${cleanBase}History_schems.pdf`);
      }
      if (!response || !response.ok) {
        throw new Error(`Не удалось загрузить PDF: HTTP ${response?.status || 'network error'}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      data = new Uint8Array(arrayBuffer);
      cachedPdfData = data;
    }

    const loadingTask = pdfjsLib.getDocument({
      data,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true
    });

    return await loadingTask.promise;
  })();

  return pdfLoadingPromise;
}

interface TextbookCanvasViewerProps {
  initialPage?: number;
  onPageChange?: (page: number) => void;
  schemeTitle?: string;
  schemeNumber?: number;
  onSwitchToInteractive?: () => void;
  hasInteractiveFallback?: boolean;
}

export default function TextbookCanvasViewer({
  initialPage = 5,
  onPageChange,
  schemeTitle,
  schemeNumber,
  onSwitchToInteractive,
  hasInteractiveFallback
}: TextbookCanvasViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(303);
  const [loadingDoc, setLoadingDoc] = useState<boolean>(true);
  const [renderingPage, setRenderingPage] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomFactor, setZoomFactor] = useState<number>(1.0); // 1.0 = fit to container width
  const [pageInput, setPageInput] = useState<string>(initialPage.toString());

  // Interactive Pan & Drag state for touch and mouse
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; initialScrollLeft: number; initialScrollTop: number }>({
    clientX: 0,
    clientY: 0,
    initialScrollLeft: 0,
    initialScrollTop: 0
  });
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchZoomRef = useRef<number>(1.0);
  const lastTapTimeRef = useRef<number>(0);
  const lastWidthRef = useRef<number>(0);

  // Keep page input in sync
  useEffect(() => {
    setCurrentPage(initialPage);
    setPageInput(initialPage.toString());
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  }, [initialPage]);

  // Load PDF document on mount using cached singleton
  useEffect(() => {
    let isCancelled = false;
    setLoadingDoc(true);
    setErrorMsg(null);

    getOrLoadPdfDocument()
      .then((doc) => {
        if (!isCancelled) {
          pdfDocRef.current = doc;
          setTotalPages(doc.numPages);
          setLoadingDoc(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Error loading PDF document:', err);
          setErrorMsg('Не удалось загрузить файл схем в данном браузере');
          setLoadingDoc(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        goToPage(currentPage - 1);
      } else if (e.key === 'ArrowRight') {
        goToPage(currentPage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // Render current page onto canvas
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDocRef.current || !canvasRef.current || !containerRef.current) return;

    try {
      setRenderingPage(true);
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await pdfDocRef.current.getPage(currentPage);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const paddingBuffer = window.innerWidth < 640 ? 16 : 40;
      const availableWidth = Math.max(280, (containerRef.current.clientWidth || window.innerWidth) - paddingBuffer);
      const unscaledViewport = page.getViewport({ scale: 1.0 });

      // Calculate base scale to fit the container width
      const baseScale = availableWidth > 0 ? (availableWidth / unscaledViewport.width) : 1.0;
      const finalScale = Math.max(0.6, baseScale * zoomFactor);

      const dpr = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: finalScale * dpr });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Fill clean background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;

      await task.promise;
      setRenderingPage(false);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'RenderingCancelledException') {
        // Expected cancellation
        return;
      }
      console.error('Error rendering page:', err);
      setRenderingPage(false);
    }
  }, [currentPage, zoomFactor]);

  // Trigger render when doc, page, or zoom changes
  useEffect(() => {
    if (!loadingDoc && pdfDocRef.current) {
      renderCurrentPage();
    }
  }, [loadingDoc, currentPage, zoomFactor, renderCurrentPage]);

  // Window resize observer with debounce to avoid scrollbar toggle loop
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = Math.round(entry.contentRect.width);
        if (Math.abs(newWidth - lastWidthRef.current) > 20) {
          lastWidthRef.current = newWidth;
          if (!loadingDoc && pdfDocRef.current) {
            renderCurrentPage();
          }
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loadingDoc, renderCurrentPage]);

  const goToPage = (p: number) => {
    const clamped = Math.max(1, Math.min(totalPages, p));
    setCurrentPage(clamped);
    setPageInput(clamped.toString());
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
    if (onPageChange) {
      onPageChange(clamped);
    }
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  const handlePageSubmit = (e: FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p)) {
      goToPage(p);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handleZoomIn = () => setZoomFactor(prev => Math.min(3.0, Math.round((prev + 0.25) * 100) / 100));
  const handleZoomOut = () => setZoomFactor(prev => Math.max(0.75, Math.round((prev - 0.25) * 100) / 100));
  const handleZoomReset = () => {
    setZoomFactor(1.0);
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  };
  const setZoomPreset = (scale: number) => {
    setZoomFactor(scale);
    if (scale === 1.0 && containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  };

  // Touch and mouse pan / pinch-to-zoom handlers using viewport scrolling
  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0 || !containerRef.current) return;
    setIsInteracting(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialScrollLeft: containerRef.current.scrollLeft,
      initialScrollTop: containerRef.current.scrollTop,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isInteracting || !containerRef.current) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    containerRef.current.scrollLeft = dragStartRef.current.initialScrollLeft - dx;
    containerRef.current.scrollTop = dragStartRef.current.initialScrollTop - dy;
  };

  const handleMouseUp = () => {
    setIsInteracting(false);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom started
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialPinchZoomRef.current = zoomFactor;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      // Detect double-tap to toggle between fit-to-width (1.0) and comfortable reading zoom (1.5)
      if (now - lastTapTimeRef.current < 300) {
        if (zoomFactor > 1.2) {
          setZoomPreset(1.0);
        } else {
          setZoomPreset(1.5);
        }
        lastTapTimeRef.current = 0;
        return;
      }
      lastTapTimeRef.current = now;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistRef.current !== null) {
      // Pinch to zoom with two fingers
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / initialPinchDistRef.current;
      const targetZoom = Math.max(0.75, Math.min(3.0, Math.round(initialPinchZoomRef.current * ratio * 100) / 100));
      setZoomFactor(targetZoom);
    }
  };

  const handleTouchEnd = () => {
    initialPinchDistRef.current = null;
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setZoomFactor(prev => Math.max(0.75, Math.min(3.0, Math.round((prev + delta) * 100) / 100)));
    }
  };

  const pdfUrl = `/History_schems.pdf#page=${currentPage}`;
  const isZoomed = zoomFactor > 1.05;

  return (
    <div 
      id="textbook-reader-wrapper"
      className={`bg-slate-950 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col transition-all select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'w-full'
      }`}
    >
      {/* Reader Control Header */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Title / Scheme indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2.5 py-1 rounded-lg bg-sky-600/30 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold shrink-0">
            {schemeNumber ? `Схема №${schemeNumber}` : 'Схема'}
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md lg:max-w-xl">
              {schemeTitle || 'История России в схемах'}
            </h4>
            <div className="text-3xs text-slate-400 truncate">
              Оригинальный графический разворот страницы
            </div>
          </div>
        </div>

        {/* Page navigation buttons & input */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            aria-label="Предыдущая страница"
            className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors cursor-pointer"
            title="Предыдущая страница (Стрелка влево)"
          >
            <ChevronLeft size={18} />
          </button>

          <form onSubmit={handlePageSubmit} className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="text-slate-500">Стр.</span>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-12 text-center bg-slate-800 border border-slate-700 rounded-lg py-1 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <span className="text-slate-500">/ {totalPages}</span>
          </form>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            aria-label="Следующая страница"
            className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors cursor-pointer"
            title="Следующая страница (Стрелка вправо)"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
              title="Уменьшить масштаб"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 py-1 text-3xs font-mono font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="По ширине экрана (100%)"
            >
              {Math.round(zoomFactor * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
              title="Увеличить масштаб"
            >
              <ZoomIn size={16} />
            </button>
            {isZoomed && (
              <button
                onClick={handleZoomReset}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                title="Сбросить увеличение (100%)"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors border border-slate-800 cursor-pointer hidden sm:flex items-center justify-center"
            title="Открыть оригинал PDF в новой вкладке"
          >
            <ExternalLink size={16} />
          </a>

          <a
            href="/History_schems.pdf"
            download="История_России_в_схемах.pdf"
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors border border-slate-800 cursor-pointer hidden sm:flex items-center justify-center"
            title="Скачать полный PDF (2.3 МБ)"
          >
            <Download size={16} />
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors border border-slate-800 cursor-pointer"
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport with Touch Drag, Native Smooth Scroll & Pinch Gesture Support */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`relative flex-1 bg-slate-950 overflow-auto min-h-[480px] select-none ${
          isFullscreen ? 'h-[calc(100vh-100px)]' : 'h-[620px] sm:h-[750px] max-h-[85vh]'
        } ${isInteracting ? 'cursor-grabbing' : (zoomFactor > 1.05 ? 'cursor-grab' : 'cursor-default')}`}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 #020617',
          touchAction: 'pan-x pan-y',
        }}
      >
        {loadingDoc && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 space-y-3">
            <Loader2 size={36} className="text-sky-400 animate-spin" />
            <p className="text-sm font-semibold text-slate-300">
              Загрузка схемы...
            </p>
          </div>
        )}

        {renderingPage && (
          <div className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-2 text-3xs text-sky-400 font-semibold shadow-md">
            <Loader2 size={11} className="animate-spin" />
            <span>Отрисовка...</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex flex-col items-center justify-center py-12 px-6 space-y-4 text-center max-w-md bg-slate-900/80 rounded-3xl border border-slate-800 shadow-xl z-20">
            <AlertCircle size={38} className="text-amber-400" />
            <div className="space-y-1">
              <h5 className="font-bold text-white text-sm">Не удалось отобразить схему</h5>
              <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  pdfLoadingPromise = null;
                  cachedPdfData = null;
                  setLoadingDoc(true);
                  setErrorMsg(null);
                  getOrLoadPdfDocument()
                    .then(doc => {
                      pdfDocRef.current = doc;
                      setTotalPages(doc.numPages);
                      setLoadingDoc(false);
                    })
                    .catch(err => {
                      setErrorMsg('Не удалось загрузить файл: ' + (err?.message || 'ошибка'));
                      setLoadingDoc(false);
                    });
                }}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                Повторить попытку
              </button>
              {hasInteractiveFallback && onSwitchToInteractive && (
                <button
                  onClick={onSwitchToInteractive}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Интерактивная блок-схема
                </button>
              )}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
              >
                <ExternalLink size={13} />
                <span>Открыть в отдельной вкладке</span>
              </a>
            </div>
          </div>
        )}

        {/* The Page Canvas with Safe Centering and Zero-Clipping on Zoom */}
        <div className="min-w-full min-h-full flex items-start justify-start sm:justify-center p-2 sm:p-5 box-border">
          <div
            className="m-auto relative shadow-2xl rounded-sm overflow-hidden bg-white border border-slate-700 shrink-0"
          >
            <canvas ref={canvasRef} className="block max-w-none pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom status bar - Permanent UI chrome outside canvas, NEVER covers the content */}
      <div className="bg-slate-900 px-3 sm:px-4 py-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-2xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Стр. {currentPage} из {totalPages}</span>
        </div>

        {/* Zoom Presets in footer chrome */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setZoomPreset(1.0)}
            className={`px-2 py-0.5 rounded text-3xs font-bold transition-colors cursor-pointer ${
              zoomFactor === 1.0 ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Вписать по ширине экрана"
          >
            По ширине
          </button>
          <button
            onClick={() => setZoomPreset(1.25)}
            className={`px-1.5 py-0.5 rounded text-3xs font-bold transition-colors cursor-pointer ${
              zoomFactor === 1.25 ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            125%
          </button>
          <button
            onClick={() => setZoomPreset(1.5)}
            className={`px-1.5 py-0.5 rounded text-3xs font-bold transition-colors cursor-pointer ${
              zoomFactor === 1.5 ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            150%
          </button>
          <button
            onClick={() => setZoomPreset(2.0)}
            className={`px-1.5 py-0.5 rounded text-3xs font-bold transition-colors cursor-pointer ${
              zoomFactor === 2.0 ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            200%
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="text-slate-500">Листайте стрелками ◀ ▶</span>
          <span className="text-sky-400 font-semibold">282 схемы в базе</span>
        </div>
      </div>
    </div>
  );
}
