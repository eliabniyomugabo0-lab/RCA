import React, { useState, useEffect, useRef } from 'react';
import { 
  Scan, 
  Camera, 
  X, 
  Search, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  MapPin, 
  Layers, 
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { InventoryItem, StockMovement, User } from '../../types';

interface InventoryQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  currentUser: User;
  onOpenReceiveForItem?: (item: InventoryItem) => void;
  onOpenIssueForItem?: (item: InventoryItem) => void;
  onOpenReturnForItem?: (item: InventoryItem) => void;
  onOpenDamageForItem?: (item: InventoryItem) => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const InventoryQrScannerModal: React.FC<InventoryQrScannerModalProps> = ({
  isOpen,
  onClose,
  inventory,
  currentUser,
  onOpenReceiveForItem,
  onOpenIssueForItem,
  onOpenReturnForItem,
  onOpenDamageForItem,
  onShowToast
}) => {
  const [scanMode, setScanMode] = useState<'camera' | 'lookup'>('lookup');
  const [skuInput, setSkuInput] = useState('');
  const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // If opened with no item, pick the first inventory item as quick preview or clear
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScannedItem(null);
      setSkuInput('');
      setCameraError(null);
    }
  }, [isOpen]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    setScanMode('camera');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraActive(false);
      setCameraError(err.message || 'Camera permission denied or camera device unavailable. Use the quick SKU barcode lookup below.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleLookup = (skuOrName: string) => {
    const trimmed = skuOrName.trim().toLowerCase();
    if (!trimmed) return;

    // Try matching by exact SKU, partial SKU, ID, or Name
    const found = inventory.find((i) => 
      i.sku.toLowerCase() === trimmed ||
      i.id.toLowerCase() === trimmed ||
      i.sku.toLowerCase().includes(trimmed) ||
      i.name.toLowerCase().includes(trimmed)
    );

    if (found) {
      setScannedItem(found);
      if (onShowToast) {
        onShowToast('success', 'Asset Located', `${found.name} (${found.sku}) matched successfully.`);
      }
    } else {
      if (onShowToast) {
        onShowToast('error', 'Item Not Found', `No equipment matched "${skuOrName}". Check the SKU number.`);
      }
    }
  };

  const handleSimulateScan = (item: InventoryItem) => {
    setScannedItem(item);
    setSkuInput(item.sku);
    if (onShowToast) {
      onShowToast('info', 'Tag Scanned', `Scanned official tag for ${item.name}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Equipment QR & Tag Scanner</span>
                <span className="text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  LIVE SCANNER
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Instantly scan gear tags, cricket machinery, or storage bay labels at Gahanga
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setScanMode('lookup');
              stopCamera();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              scanMode === 'lookup'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Fast SKU / Tag Lookup</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setScanMode('camera');
              startCamera();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              scanMode === 'camera'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Device Camera Scanner</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* CAMERA MODE */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden aspect-video sm:h-64 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {!cameraActive && (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Camera className="w-6 h-6" />
                    </div>
                    {cameraError ? (
                      <div className="max-w-md mx-auto">
                        <p className="text-xs text-rose-400 font-semibold">{cameraError}</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          You can still use the direct SKU tag lookup or click any simulated tag below to test the workflow.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">Initializing camera feed...</p>
                    )}
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition-colors"
                    >
                      Retry Camera
                    </button>
                  </div>
                )}

                {/* Laser scan line overlay when camera active */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-56 h-56 border-2 border-teal-400/80 rounded-xl relative shadow-lg shadow-teal-500/20">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-300"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-teal-300"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-teal-300"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-300"></div>
                      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse"></div>
                    </div>
                    <span className="mt-3 text-[11px] font-mono text-teal-300 bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      Align QR tag within frame
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LOOKUP INPUT BAR */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Scan Barcode / Enter Equipment SKU:</span>
              <span className="text-[11px] text-slate-500 font-normal">e.g. GCS-EQ-ROLLER-01, GCS-EQ-BALL-01</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type or scan SKU tag number..."
                  value={skuInput}
                  onChange={(e) => setSkuInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLookup(skuInput);
                    }
                  }}
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleLookup(skuInput)}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Lookup</span>
              </button>
            </div>
          </div>

          {/* QUICK SIMULATION TAGS */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quick Test Tags (Gahanga Stadium Inventory Samples):
            </span>
            <div className="flex flex-wrap gap-2">
              {inventory.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSimulateScan(item)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                    scannedItem?.id === item.id
                      ? 'bg-teal-950 border-teal-500 text-teal-300'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold">{item.sku}</span>
                  <span className="text-[10px] text-slate-400 max-w-[120px] truncate">({item.name})</span>
                </button>
              ))}
            </div>
          </div>

          {/* SCANNED ITEM RESULT CARD */}
          {scannedItem && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950/40 border-2 border-teal-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-md">
                      {scannedItem.sku}
                    </span>
                    <span className="text-xs text-slate-400">· {scannedItem.category}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                    {scannedItem.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Location: <strong className="text-slate-200">{scannedItem.location}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Available</span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {scannedItem.availableQuantity} {scannedItem.unit}
                  </span>
                  {scannedItem.availableQuantity <= scannedItem.reorderThreshold && (
                    <span className="text-[10px] text-amber-400 block font-semibold">
                      Below Reorder Min ({scannedItem.reorderThreshold})
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Breakdown Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total In System</span>
                  <span className="font-mono font-bold text-slate-100">{scannedItem.totalQuantity} {scannedItem.unit}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Reserved / Out</span>
                  <span className="font-mono font-bold text-amber-400">{scannedItem.reservedQuantity} {scannedItem.unit}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Damaged / Flawed</span>
                  <span className="font-mono font-bold text-rose-400">{scannedItem.damagedQuantity} {scannedItem.unit}</span>
                </div>
              </div>

              {/* Instant Actions for Storekeeper / Staff */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-300 block mb-2">
                  Execute Quick Movement for {scannedItem.sku}:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {onOpenReceiveForItem && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenReceiveForItem(scannedItem);
                      }}
                      className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-800/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5 text-teal-400" />
                      <span>Receive Stock</span>
                    </button>
                  )}

                  {onOpenIssueForItem && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenIssueForItem(scannedItem);
                      }}
                      className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                      <span>Issue Out</span>
                    </button>
                  )}

                  {onOpenReturnForItem && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenReturnForItem(scannedItem);
                      }}
                      className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Return Item</span>
                    </button>
                  )}

                  {onOpenDamageForItem && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenDamageForItem(scannedItem);
                      }}
                      className="px-2.5 py-2 text-xs font-semibold rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Flag Defect</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>GCS RFID & QR Asset Management Module</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
