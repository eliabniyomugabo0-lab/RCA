import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ArrowDownRight, 
  ArrowUpRight, 
  RotateCcw, 
  AlertTriangle, 
  Plus, 
  Search, 
  Download, 
  Layers, 
  MapPin, 
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  QrCode,
  Scan,
  Paperclip,
  Eye
} from 'lucide-react';
import { 
  InventoryItem, 
  StockMovement, 
  StockRequest, 
  User as UserType, 
  Role, 
  StockMovementType,
  ProfileAttachment
} from '../../types';
import { Modal } from '../common/Modal';
import { InventoryQrModal } from './InventoryQrModal';
import { InventoryQrScannerModal } from './InventoryQrScannerModal';
import { OptionalAttachmentField, QuickTemplateOption } from '../common/OptionalAttachmentField';
import { FilePreviewModal } from '../common/FilePreviewModal';

const RECEIVE_TEMPLATES: QuickTemplateOption[] = [
  {
    label: 'Supplier Delivery Note & Batch Inspection Log',
    name: 'GCS_Supplier_Delivery_Inspection_Note.csv',
    content: 'Item SKU,Quantity Received,Batch Ref,Quality Check,Inspector\nGCS-BAT-01,24,BATCH-2026-OCT-12,Grade A Wood Verified,Storekeeper JP\nGCS-BAL-01,30,KOK-W-2026-RW,Seam Stitch Inspection Passed,Storekeeper JP',
    size: 110000,
    category: 'ACCREDITATION'
  },
  {
    label: 'Official Goods Received Note (GRN) Voucher',
    name: 'GCS_Goods_Received_Note_GRN_2026.pdf',
    content: 'GAHANGA CRICKET STADIUM — CENTRAL STORES\nGOODS RECEIVED NOTE (GRN)\n\nShipment verified against Purchase Order specs.\nAll items placed in climate-controlled storage vaults.',
    size: 215000,
    category: 'MEMO_REPORT'
  }
];

const ISSUE_TEMPLATES: QuickTemplateOption[] = [
  {
    label: 'Squad Requisition & Handover Authorization',
    name: 'GCS_Equipment_Issue_Handover_Voucher.pdf',
    content: 'OFFICIAL KIT ISSUE & CUSTODY HANDOVER VOUCHER\n\nAuthorized recipient accepts responsibility for all checked-out match gear and safety accessories.\nReturn expected post-match or training completion.',
    size: 165000,
    category: 'CONTRACT'
  }
];

const RETURN_TEMPLATES: QuickTemplateOption[] = [
  {
    label: 'Equipment Return & Post-Practice Audit',
    name: 'GCS_Equipment_Return_Condition_Audit.pdf',
    content: 'STORES RETURN CONDITION AUDIT\n\nGear returned cleaned, counted, and inspected for defects.\nAll returned units restored to available active inventory.',
    size: 140000,
    category: 'MEMO_REPORT'
  }
];

const DAMAGE_TEMPLATES: QuickTemplateOption[] = [
  {
    label: 'Incident Report & Damage Assessment Proof',
    name: 'GCS_Damaged_Equipment_Triage_Report.pdf',
    content: 'EQUIPMENT DAMAGE INCIDENT REPORT\n\nImpact description, photo verification reference, and recommendation for retirement or specialist workshop repair.',
    size: 180000,
    category: 'MEMO_REPORT'
  }
];

const REQUEST_TEMPLATES: QuickTemplateOption[] = [
  {
    label: 'Tournament Logistics Requisition Justification',
    name: 'GCS_Stock_Requisition_Justification.pdf',
    content: 'HIGH PERFORMANCE SQUAD REQUISITION BRIEF\n\nOutlines tactical match schedule, training cadence, and kit requirements.',
    size: 150000,
    category: 'MEMO_REPORT'
  }
];

interface InventoryHubProps {
  currentUser: UserType;
  inventory: InventoryItem[];
  movements: StockMovement[];
  requests: StockRequest[];
  onUpdateInventory: (items: InventoryItem[], newMovement?: StockMovement) => void;
  onAddStockRequest: (request: StockRequest) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
  initialItemId?: string | null;
}

export const InventoryHub: React.FC<InventoryHubProps> = ({
  currentUser,
  inventory,
  movements,
  requests,
  onUpdateInventory,
  onAddStockRequest,
  onShowToast,
  initialItemId
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'ledger' | 'requests' | 'alerts'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    if (initialItemId) {
      const found = inventory.find(i => i.id === initialItemId);
      if (found) {
        setActiveTab('catalog');
        setSearchQuery(found.name);
      }
    }
  }, [initialItemId, inventory]);

  // Modals
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isDamageModalOpen, setIsDamageModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrItemForModal, setQrItemForModal] = useState<InventoryItem | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  // Forms
  const [selectedItemId, setSelectedItemId] = useState(inventory[0]?.id || '');
  const [movementQty, setMovementQty] = useState(1);
  const [movementReason, setMovementReason] = useState('');
  const [movementParty, setMovementParty] = useState('');
  const [movementLocation, setMovementLocation] = useState('');

  // Stock Request form
  const [reqPurpose, setReqPurpose] = useState('');
  const [reqEvent, setReqEvent] = useState('');
  const [reqQty, setReqQty] = useState(2);

  // Form Attachments (Encouraged & Optional)
  const [movementAttachments, setMovementAttachments] = useState<ProfileAttachment[]>([]);
  const [requestAttachments, setRequestAttachments] = useState<ProfileAttachment[]>([]);
  const [previewAttachment, setPreviewAttachment] = useState<ProfileAttachment | null>(null);

  const categories = Array.from(new Set(inventory.map(i => i.category)));

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(i => i.availableQuantity <= i.reorderThreshold);

  // Permissions
  const canReceiveOrIssue = currentUser.role === 'STOREKEEPER' || currentUser.role === 'SYSTEM_ADMIN' || currentUser.role === 'CRICKET_OPERATIONS_MANAGER';

  // 1. Receive Stock
  const handleReceiveStock = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === selectedItemId);
    if (!item) return;

    if (movementQty <= 0) {
      onShowToast('error', 'Invalid Quantity', 'Receipt quantity must be greater than 0.');
      return;
    }

    const updatedItem: InventoryItem = {
      ...item,
      totalQuantity: item.totalQuantity + movementQty,
      availableQuantity: item.availableQuantity + movementQty,
      lastCountedDate: new Date().toISOString().split('T')[0]
    };

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      itemSku: item.sku,
      type: 'RECEIPT',
      quantity: movementQty,
      sourceLocation: movementLocation || 'Supplier Delivery / Purchase Order',
      destinationLocation: item.location,
      recipientOrIssuer: movementParty || currentUser.name,
      performedById: currentUser.id,
      performedByName: currentUser.name,
      reason: movementReason || 'Direct stock replenishment',
      referenceNumber: `RCV-${Date.now().toString().slice(-6)}`,
      attachments: movementAttachments.length > 0 ? movementAttachments : undefined,
      timestamp: new Date().toISOString()
    };

    const newInventoryList = inventory.map(i => i.id === item.id ? updatedItem : i);
    onUpdateInventory(newInventoryList, newMovement);
    setIsReceiveModalOpen(false);
    setMovementQty(1);
    setMovementReason('');
    setMovementAttachments([]);
    onShowToast('success', 'Stock Received', `Added ${movementQty} ${item.unit} of ${item.name} into ${item.location}`);
  };

  // 2. Issue Equipment
  const handleIssueStock = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === selectedItemId);
    if (!item) return;

    if (movementQty <= 0) {
      onShowToast('error', 'Invalid Quantity', 'Issue quantity must be greater than 0.');
      return;
    }

    if (movementQty > item.availableQuantity) {
      onShowToast('error', 'Insufficient Stock', `Cannot issue ${movementQty} ${item.unit}. Only ${item.availableQuantity} available.`);
      return;
    }

    const updatedItem: InventoryItem = {
      ...item,
      availableQuantity: item.availableQuantity - movementQty,
      reservedQuantity: item.type === 'REUSABLE_ASSET' ? item.reservedQuantity + movementQty : item.reservedQuantity
    };

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      itemSku: item.sku,
      type: 'ISSUE',
      quantity: movementQty,
      sourceLocation: item.location,
      destinationLocation: movementLocation || 'Match Ground / Training Camp',
      recipientOrIssuer: movementParty || 'Authorized Team Custodian',
      performedById: currentUser.id,
      performedByName: currentUser.name,
      reason: movementReason || 'Operational fixture issue',
      referenceNumber: `ISS-${Date.now().toString().slice(-6)}`,
      attachments: movementAttachments.length > 0 ? movementAttachments : undefined,
      timestamp: new Date().toISOString()
    };

    const newInventoryList = inventory.map(i => i.id === item.id ? updatedItem : i);
    onUpdateInventory(newInventoryList, newMovement);
    setIsIssueModalOpen(false);
    setMovementQty(1);
    setMovementReason('');
    setMovementAttachments([]);
    onShowToast('success', 'Stock Issued', `Issued ${movementQty} ${item.unit} to ${movementParty || 'Authorized recipient'}`);
  };

  // 3. Return Equipment
  const handleReturnStock = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === selectedItemId);
    if (!item) return;

    if (movementQty <= 0) {
      onShowToast('error', 'Invalid Quantity', 'Return quantity must be greater than 0.');
      return;
    }

    const updatedItem: InventoryItem = {
      ...item,
      availableQuantity: item.availableQuantity + movementQty,
      reservedQuantity: Math.max(0, item.reservedQuantity - movementQty)
    };

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      itemSku: item.sku,
      type: 'RETURN',
      quantity: movementQty,
      sourceLocation: movementLocation || 'Practice Nets / Main Oval',
      destinationLocation: item.location,
      recipientOrIssuer: movementParty || currentUser.name,
      performedById: currentUser.id,
      performedByName: currentUser.name,
      reason: movementReason || 'Returned following training session',
      referenceNumber: `RET-${Date.now().toString().slice(-6)}`,
      attachments: movementAttachments.length > 0 ? movementAttachments : undefined,
      timestamp: new Date().toISOString()
    };

    const newInventoryList = inventory.map(i => i.id === item.id ? updatedItem : i);
    onUpdateInventory(newInventoryList, newMovement);
    setIsReturnModalOpen(false);
    setMovementQty(1);
    setMovementReason('');
    setMovementAttachments([]);
    onShowToast('success', 'Equipment Returned', `Checked in ${movementQty} ${item.unit} back to ${item.location}`);
  };

  // 4. Report Damage / Loss
  const handleDamageStock = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === selectedItemId);
    if (!item) return;

    if (movementQty <= 0) {
      onShowToast('error', 'Invalid Quantity', 'Quantity must be at least 1.');
      return;
    }

    if (movementQty > item.availableQuantity) {
      onShowToast('error', 'Quantity Exceeded', `Cannot flag ${movementQty} units as damaged. Only ${item.availableQuantity} available.`);
      return;
    }

    const updatedItem: InventoryItem = {
      ...item,
      availableQuantity: item.availableQuantity - movementQty,
      damagedQuantity: item.damagedQuantity + movementQty
    };

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId: item.id,
      itemName: item.name,
      itemSku: item.sku,
      type: 'DAMAGE_LOSS',
      quantity: movementQty,
      sourceLocation: item.location,
      destinationLocation: 'Quarantine / Maintenance Bay',
      recipientOrIssuer: currentUser.name,
      performedById: currentUser.id,
      performedByName: currentUser.name,
      reason: movementReason || 'Broken during match play',
      referenceNumber: `DMG-${Date.now().toString().slice(-6)}`,
      attachments: movementAttachments.length > 0 ? movementAttachments : undefined,
      timestamp: new Date().toISOString()
    };

    const newInventoryList = inventory.map(i => i.id === item.id ? updatedItem : i);
    onUpdateInventory(newInventoryList, newMovement);
    setIsDamageModalOpen(false);
    setMovementQty(1);
    setMovementReason('');
    setMovementAttachments([]);
    onShowToast('info', 'Damage Recorded', `Recorded ${movementQty} units of ${item.name} to damaged quarantine.`);
  };

  // 5. Submit Stock Request
  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === selectedItemId);
    if (!item) return;

    const newRequest: StockRequest = {
      id: `req-${Date.now()}`,
      requestNumber: `REQ-2026-${Date.now().toString().slice(-3)}`,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      department: currentUser.department,
      targetEventOrTeam: reqEvent || 'National Team Practice',
      items: [
        {
          itemId: item.id,
          itemName: item.name,
          requestedQty: reqQty,
          unit: item.unit
        }
      ],
      purpose: reqPurpose || 'Equipment requisition for upcoming match.',
      neededByDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      status: 'PENDING',
      attachments: requestAttachments.length > 0 ? requestAttachments : undefined,
      createdAt: new Date().toISOString()
    };

    onAddStockRequest(newRequest);
    setIsRequestModalOpen(false);
    setReqPurpose('');
    setReqEvent('');
    setRequestAttachments([]);
    onShowToast('success', 'Request Filed', 'Requisition submitted to Storekeeper and Operations Manager.');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['SKU,Item Name,Category,Type,Unit,Available,Reserved,Damaged,Total,Location,Threshold'];
    const rows = inventory.map(i => 
      `"${i.sku}","${i.name}","${i.category}","${i.type}","${i.unit}",${i.availableQuantity},${i.reservedQuantity},${i.damagedQuantity},${i.totalQuantity},"${i.location}",${i.reorderThreshold}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GCS_Store_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('success', 'CSV Export Complete', 'Downloaded store inventory spreadsheet.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Store & Equipment Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Traceable stock movements, cricket kit management, reorder alerts, and custody audits
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canReceiveOrIssue && (
            <>
              <button
                onClick={() => setIsReceiveModalOpen(true)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Receive Stock</span>
              </button>

              <button
                onClick={() => setIsIssueModalOpen(true)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Issue Equipment</span>
              </button>

              <button
                onClick={() => setIsReturnModalOpen(true)}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
                <span>Record Return</span>
              </button>
            </>
          )}

          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-950/80 hover:bg-teal-900 border border-teal-500/40 rounded-lg transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Scan equipment QR tag or barcode"
          >
            <Scan className="w-3.5 h-3.5 text-teal-400" />
            <span>Scan QR Tag</span>
          </button>

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-teal-400" />
            <span>Request Kit</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'bg-slate-800 text-teal-300 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Equipment Catalog ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-slate-800 text-teal-300 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Stock Movement Ledger ({movements.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-slate-800 text-teal-300 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Requisitions & Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'alerts'
              ? 'bg-slate-800 text-amber-300 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Reorder Alerts</span>
          {lowStockItems.length > 0 && (
            <span className="font-mono text-[10px] bg-amber-950/80 text-amber-300 px-1.5 py-0.2 rounded border border-amber-800">
              {lowStockItems.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by equipment name, SKU, or storage bay..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter equipment by category"
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-hidden focus:border-teal-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Catalog Table & Mobile Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
            {/* Mobile Card View (phones & small tablets) */}
            <div className="block md:hidden divide-y divide-slate-800/80">
              {filteredInventory.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No inventory items found matching your filters.
                </div>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.availableQuantity <= item.reorderThreshold;
                  return (
                    <div key={item.id} className="p-3.5 space-y-3 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-100 truncate">{item.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="font-mono text-teal-400">{item.sku}</span>
                            <span>·</span>
                            <span>{item.category}</span>
                            {item.condition && (
                              <>
                                <span>·</span>
                                <span className="text-slate-300">{item.condition}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-xs font-mono font-bold ${isLow ? 'text-amber-400' : 'text-slate-100'}`}>
                            {item.availableQuantity} {item.unit}
                          </span>
                          {isLow && (
                            <span className="text-[9px] block text-amber-500 font-semibold">
                              Low (Min: {item.reorderThreshold})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 px-2.5 py-1.5 rounded-lg">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 font-mono text-[10px]">
                          <span>Res: {item.reservedQuantity}</span>
                          <span>Dmg: {item.damagedQuantity}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                        <button
                          type="button"
                          onClick={() => {
                            setQrItemForModal(item);
                            setIsQrModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-teal-300 hover:text-white bg-teal-950/60 hover:bg-teal-900 border border-teal-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
                        >
                          <QrCode className="w-3.5 h-3.5 text-teal-400" />
                          <span>QR Tag</span>
                        </button>

                        {canReceiveOrIssue && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setIsDamageModalOpen(true);
                            }}
                            className="px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg font-medium transition-colors cursor-pointer min-h-[36px]"
                          >
                            Flag Defect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Item & SKU</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 text-right">Available</th>
                    <th className="px-4 py-3 text-right">Reserved</th>
                    <th className="px-4 py-3 text-right">Damaged</th>
                    <th className="px-4 py-3">Storage Location</th>
                    <th className="px-4 py-3 text-right">Asset QR & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredInventory.map((item) => {
                    const isLow = item.availableQuantity <= item.reorderThreshold;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-100">{item.name}</p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono tabular-nums text-slate-400">{item.sku}</span>
                            {item.condition && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-teal-400">{item.condition}</span>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-400">
                          {item.category}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-400">
                          <span className="text-[11px]">
                            {item.type === 'CONSUMABLE' ? 'Consumable' : 'Reusable Asset'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono tabular-nums font-semibold">
                          <span className={isLow ? 'text-amber-400' : 'text-slate-100'}>
                            {item.availableQuantity} {item.unit}
                          </span>
                          {isLow && (
                            <span className="text-[10px] block text-amber-500 font-sans">
                              (Min: {item.reorderThreshold})
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono tabular-nums text-slate-400">
                          {item.reservedQuantity}
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono tabular-nums">
                          <span className={item.damagedQuantity > 0 ? 'text-rose-400' : 'text-slate-500'}>
                            {item.damagedQuantity}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-400">
                          <span className="truncate max-w-[180px] block" title={item.location}>
                            {item.location}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setQrItemForModal(item);
                                setIsQrModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-teal-300 hover:text-white bg-teal-950/60 hover:bg-teal-900 border border-teal-500/30 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              title="Generate QR code and printable asset tag"
                            >
                              <QrCode className="w-3.5 h-3.5 text-teal-400" />
                              <span>QR Tag</span>
                            </button>

                            {canReceiveOrIssue && (
                              <button
                                onClick={() => {
                                  setSelectedItemId(item.id);
                                  setIsDamageModalOpen(true);
                                }}
                                className="text-[11px] text-slate-400 hover:text-rose-400 font-medium px-1.5 py-1"
                                title="Flag Damaged / Missing"
                              >
                                Flag Defect
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEDGER */}
      {activeTab === 'ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Immutable Stock Movement Ledger
            </span>
            <span className="text-[11px] text-slate-400">
              Audit-grade verification trail
            </span>
          </div>

          {/* Mobile Card List for Ledger */}
          <div className="block md:hidden divide-y divide-slate-800/80">
            {movements.map((mov) => (
              <div key={mov.id} className="p-3.5 space-y-2 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{mov.itemName}</h4>
                    <span className="font-mono text-[10px] text-slate-500">{mov.itemSku}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    mov.type === 'RECEIPT' ? 'bg-teal-950/80 text-teal-300 border-teal-800/60' :
                    mov.type === 'ISSUE' ? 'bg-sky-950/80 text-sky-300 border-sky-800/60' :
                    mov.type === 'RETURN' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60' :
                    'bg-rose-950/80 text-rose-300 border-rose-800/60'
                  }`}>
                    {mov.type.replace('_', ' ')}: {mov.type === 'ISSUE' || mov.type === 'DAMAGE_LOSS' ? `-${mov.quantity}` : `+${mov.quantity}`}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="truncate">{mov.sourceLocation}</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-200 truncate">{mov.destinationLocation}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>By: <strong className="text-slate-300">{mov.performedByName}</strong></span>
                  <div className="flex items-center gap-2">
                    {mov.attachments && mov.attachments.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPreviewAttachment(mov.attachments![0])}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] bg-teal-950/80 text-teal-300 border border-teal-800/60 cursor-pointer"
                      >
                        <Paperclip className="w-2.5 h-2.5" />
                        <span>{mov.attachments.length}</span>
                      </button>
                    )}
                    <span className="font-mono">{new Date(mov.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View for Ledger */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Timestamp & Ref</th>
                  <th className="px-4 py-3">Action Type</th>
                  <th className="px-4 py-3">Item Name</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3">Source → Destination</th>
                  <th className="px-4 py-3">Custodian / Actor</th>
                  <th className="px-4 py-3">Operational Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono tabular-nums text-slate-200 block text-[11px]">
                        {new Date(mov.timestamp).toLocaleDateString()} {new Date(mov.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {mov.referenceNumber}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold ${
                        mov.type === 'RECEIPT' ? 'text-teal-400' :
                        mov.type === 'ISSUE' ? 'text-sky-400' :
                        mov.type === 'RETURN' ? 'text-emerald-400' :
                        mov.type === 'DAMAGE_LOSS' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {mov.type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-100">{mov.itemName}</p>
                      <span className="font-mono text-[10px] text-slate-500">{mov.itemSku}</span>
                    </td>

                    <td className="px-4 py-3 text-right whitespace-nowrap font-mono tabular-nums font-semibold text-slate-100">
                      {mov.type === 'ISSUE' || mov.type === 'DAMAGE_LOSS' ? `-${mov.quantity}` : `+${mov.quantity}`}
                    </td>

                    <td className="px-4 py-3 text-slate-400 text-[11px]">
                      <span>{mov.sourceLocation}</span>
                      <span className="text-slate-600 mx-1">→</span>
                      <span className="text-slate-300">{mov.destinationLocation}</span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-slate-300 text-[11px]">
                      {mov.performedByName}
                    </td>

                    <td className="px-4 py-3 text-slate-400 text-[11px] max-w-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{mov.reason}</span>
                        {mov.attachments && mov.attachments.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setPreviewAttachment(mov.attachments![0])}
                            title={`${mov.attachments.length} file(s) attached — click to preview`}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-teal-950/80 text-teal-300 border border-teal-800/60 hover:bg-teal-900/80 transition-colors shrink-0 cursor-pointer"
                          >
                            <Paperclip className="w-2.5 h-2.5" />
                            <span>{mov.attachments.length}</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-teal-400 font-semibold">{req.requestNumber}</span>
                    <h3 className="text-sm font-semibold text-slate-100 mt-0.5">{req.targetEventOrTeam}</h3>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    req.status === 'APPROVED' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' :
                    req.status === 'PENDING' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                  <p className="text-[11px] text-slate-400 font-medium">Requested Items:</p>
                  {req.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.itemName}</span>
                      <span className="font-mono tabular-nums font-semibold">{it.requestedQty} {it.unit}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p><strong>Purpose:</strong> {req.purpose}</p>
                  <p><strong>Requester:</strong> {req.requesterName} ({req.department})</p>
                  <p><strong>Needed By:</strong> {req.neededByDate}</p>
                  {req.reviewerComment && (
                    <p className="text-emerald-400 mt-1">
                      <strong>Reviewer Note:</strong> {req.reviewerComment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REORDER ALERTS */}
      {activeTab === 'alerts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Low Stock & Reorder Alert Dashboard</h3>
              <p className="text-xs text-slate-400">Items where available quantity is at or below the safety reserve buffer</p>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {lowStockItems.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">All inventory items are currently above threshold.</p>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      SKU: <span className="font-mono">{item.sku}</span> · Location: {item.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono tabular-nums font-semibold text-amber-400">
                      {item.availableQuantity} {item.unit} available
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Reorder Threshold: {item.reorderThreshold} {item.unit}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: RECEIVE STOCK */}
      <Modal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        title="Receive Inventory Delivery"
        subtitle="Record incoming stock from official purchase order or donation"
        maxWidth="xl"
      >
        <form onSubmit={handleReceiveStock} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Select Equipment Item *</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.sku}) — Available: {item.availableQuantity} {item.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Quantity Received *</label>
              <input
                type="number"
                min="1"
                required
                value={movementQty}
                onChange={(e) => setMovementQty(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Supplier / Dispatch Origin</label>
              <input
                type="text"
                placeholder="e.g. Sports Equipment Supplier / PO-2026-092"
                value={movementLocation}
                onChange={(e) => setMovementLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Delivery Reference & Notes</label>
            <input
              type="text"
              placeholder="e.g. Approved match ball replenishment for international qualifiers"
              value={movementReason}
              onChange={(e) => setMovementReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          {/* Optional Attachments Field (Encouraged) */}
          <OptionalAttachmentField
            attachments={movementAttachments}
            onChange={setMovementAttachments}
            title="Optional Delivery Note & Purchase Invoice"
            encouragementText="Encouraged: Attach supplier delivery note, purchase invoice, packing manifest, or shipment photo for transparent store audit. Submissions without files are accepted."
            quickTemplates={RECEIVE_TEMPLATES}
            onPreviewAttachment={(att) => setPreviewAttachment(att)}
            compact
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsReceiveModalOpen(false)}
              className="px-3.5 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Record Receipt into Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ISSUE EQUIPMENT */}
      <Modal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        title="Issue Equipment to Squad or Match"
        subtitle="Transfers custody from central store to team manager or ground staff"
        maxWidth="xl"
      >
        <form onSubmit={handleIssueStock} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Select Equipment Item *</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.sku}) — Available: {item.availableQuantity} {item.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Quantity to Issue *</label>
              <input
                type="number"
                min="1"
                required
                value={movementQty}
                onChange={(e) => setMovementQty(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Recipient / Squad Custodian *</label>
              <input
                type="text"
                required
                placeholder="e.g. Coach Patrick Mugabo / Eric Dusingizimana"
                value={movementParty}
                onChange={(e) => setMovementParty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Issue Purpose / Fixture</label>
            <input
              type="text"
              placeholder="e.g. Afternoon net practice session on Wicket 3"
              value={movementReason}
              onChange={(e) => setMovementReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          {/* Optional Attachments Field (Encouraged) */}
          <OptionalAttachmentField
            attachments={movementAttachments}
            onChange={setMovementAttachments}
            title="Optional Dispatch Voucher & Signed Requisition"
            encouragementText="Encouraged: Attach signed coach authorization slip, training camp requisition, or kit handover photo. Submissions without files are accepted."
            quickTemplates={ISSUE_TEMPLATES}
            onPreviewAttachment={(att) => setPreviewAttachment(att)}
            compact
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsIssueModalOpen(false)}
              className="px-3.5 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Confirm Issue & Update Ledger
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: RECORD RETURN */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        title="Record Equipment Return"
        subtitle="Check reusable bats, pads, or equipment back into store custody"
        maxWidth="xl"
      >
        <form onSubmit={handleReturnStock} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Select Returned Item *</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
            >
              {inventory.filter(i => i.type === 'REUSABLE_ASSET' || i.reservedQuantity > 0).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — Currently Reserved / Out: {item.reservedQuantity} {item.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Quantity Returned *</label>
              <input
                type="number"
                min="1"
                required
                value={movementQty}
                onChange={(e) => setMovementQty(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Returned By (Team / Coach)</label>
              <input
                type="text"
                placeholder="e.g. Rwanda Senior Squad Equipment Manager"
                value={movementParty}
                onChange={(e) => setMovementParty(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Condition Inspection Note</label>
            <input
              type="text"
              placeholder="e.g. Cleaned and checked; no crack damage detected"
              value={movementReason}
              onChange={(e) => setMovementReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          {/* Optional Attachments Field (Encouraged) */}
          <OptionalAttachmentField
            attachments={movementAttachments}
            onChange={setMovementAttachments}
            title="Optional Return Condition Audit Slip"
            encouragementText="Encouraged: Attach return check-in sheet, post-training gear audit notes, or photo. Submissions without files are accepted."
            quickTemplates={RETURN_TEMPLATES}
            onPreviewAttachment={(att) => setPreviewAttachment(att)}
            compact
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsReturnModalOpen(false)}
              className="px-3.5 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Confirm Return & Restore Available Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: DAMAGE / DEFECT */}
      <Modal
        isOpen={isDamageModalOpen}
        onClose={() => setIsDamageModalOpen(false)}
        title="Report Damaged or Defective Equipment"
        subtitle="Quarantines item and logs immutable write-off audit reason"
        maxWidth="xl"
      >
        <form onSubmit={handleDamageStock} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Affected Item</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — Available: {item.availableQuantity} {item.unit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Damaged Quantity *</label>
            <input
              type="number"
              min="1"
              required
              value={movementQty}
              onChange={(e) => setMovementQty(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Damage Description & Incident Circumstance *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Split handle cane during 140km/h bowling spell; cannot be safely repaired"
              value={movementReason}
              onChange={(e) => setMovementReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          {/* Optional Attachments Field (Encouraged) */}
          <OptionalAttachmentField
            attachments={movementAttachments}
            onChange={setMovementAttachments}
            title="Optional Incident Evidence & Damage Photos"
            encouragementText="Encouraged: Attach photo proof of cracked willow, punctured gear, or repair estimate. Submissions without files are accepted."
            quickTemplates={DAMAGE_TEMPLATES}
            onPreviewAttachment={(att) => setPreviewAttachment(att)}
            compact
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsDamageModalOpen(false)}
              className="px-3.5 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Quarantine Damaged Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 5: NEW REQUISITION REQUEST */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Submit Equipment Requisition Request"
        subtitle="Request cricket equipment for matches, academy training, or ground maintenance"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Equipment Item Needed *</label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Quantity Needed *</label>
              <input
                type="number"
                min="1"
                required
                value={reqQty}
                onChange={(e) => setReqQty(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Event / Team Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rwanda Women U-19 Practice"
                value={reqEvent}
                onChange={(e) => setReqEvent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Operational Purpose & Justification</label>
            <textarea
              rows={2}
              placeholder="State why equipment is needed and duration required..."
              value={reqPurpose}
              onChange={(e) => setReqPurpose(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          {/* Optional Attachments Field (Encouraged) */}
          <OptionalAttachmentField
            attachments={requestAttachments}
            onChange={setRequestAttachments}
            title="Optional Tournament Schedule & Justification"
            encouragementText="Encouraged: Attach match schedule, coach requisition plan, or squad kit requirements. Submissions without files are accepted."
            quickTemplates={REQUEST_TEMPLATES}
            onPreviewAttachment={(att) => setPreviewAttachment(att)}
            compact
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="px-3.5 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              Submit Requisition
            </button>
          </div>
        </form>
      </Modal>

      {/* Inventory Item QR Code & Printable Label Modal */}
      <InventoryQrModal
        item={qrItemForModal}
        isOpen={isQrModalOpen}
        onClose={() => {
          setIsQrModalOpen(false);
          setQrItemForModal(null);
        }}
        onShowToast={onShowToast}
      />

      {/* Equipment QR Tag & Barcode Live Scanner Modal */}
      <InventoryQrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        inventory={inventory}
        currentUser={currentUser}
        onOpenReceiveForItem={(item) => {
          setSelectedItemId(item.id);
          setIsReceiveModalOpen(true);
        }}
        onOpenIssueForItem={(item) => {
          setSelectedItemId(item.id);
          setIsIssueModalOpen(true);
        }}
        onOpenReturnForItem={(item) => {
          setSelectedItemId(item.id);
          setIsReturnModalOpen(true);
        }}
        onOpenDamageForItem={(item) => {
          setSelectedItemId(item.id);
          setIsDamageModalOpen(true);
        }}
        onShowToast={onShowToast}
      />

      {/* File Preview Modal for Equipment & Movement Documents */}
      <FilePreviewModal
        isOpen={!!previewAttachment}
        onClose={() => setPreviewAttachment(null)}
        attachment={previewAttachment}
        allAttachments={
          previewAttachment
            ? [
                previewAttachment,
                ...movementAttachments,
                ...requestAttachments,
                ...(movements.flatMap(m => m.attachments || [])),
                ...(requests.flatMap(r => r.attachments || []))
              ].filter((a, idx, arr) => arr.findIndex(x => x.id === a.id) === idx)
            : []
        }
        onSelectAttachment={(att) => setPreviewAttachment(att)}
        userContext={{
          name: currentUser.name,
          positionName: currentUser.positionName || currentUser.jobTitle,
          department: currentUser.department,
          evaluationLevel: currentUser.evaluationLevel,
          email: currentUser.email
        }}
      />
    </div>
  );
};
