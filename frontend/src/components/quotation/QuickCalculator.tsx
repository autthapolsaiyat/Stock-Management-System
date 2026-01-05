import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  Button,
  InputNumber,
  Space,
  Tooltip,
  message,
  Spin,
  Popconfirm,
  Card,
} from 'antd';
import {
  ExpandOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import api from '../../services/api';

interface CellData {
  value: string | number | null;
  formula?: string;
  calculatedValue?: string | number | null;
}

interface CalculatorData {
  settings: {
    exchangeRate: number;
    clearanceFee: number;
  };
  columnHeaders: string[];
  cells: CellData[][];
}

interface QuickCalculatorProps {
  quotationId?: number;
  onDataChange?: (data: CalculatorData) => void;
  open?: boolean;
  onClose?: () => void;
  // onAddItems?: (items: { name: string; qty: number; price: number; total: number }[]) => void;
}

const DEFAULT_HEADERS = [
  'ราคาของ $',
  'ราคาต่อรอบ $',
  'ค่าของ (xRate)',
  'ค่าบริการ 10%',
  'Freight $/Sample',
  'ค่าส่ง (xRate)',
  'Shipment/year',
  'ค่าเคลียร์/รอบ',
  'ค่าเคลียร์/ship',
  'ราคารวม',
  'XDS ($)',
  'ราคารวม+XDS',
  'จำนวน (N)',
  'ราคาสุดท้าย',
];// REPLACED

const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  quotationId,
  onDataChange,
  open: externalOpen,
  onClose: externalOnClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<CalculatorData>({
    settings: { exchangeRate: 33, clearanceFee: 4500 },
    columnHeaders: DEFAULT_HEADERS,
    cells: [],
  });
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const isExternalControl = externalOpen !== undefined;
  const modalOpen = isExternalControl ? externalOpen : isModalOpen;
  const closeModal = isExternalControl ? externalOnClose : () => setIsModalOpen(false);

  const loadData = useCallback(async () => {
    if (!quotationId) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/api/quotation-calculators/quotation/${quotationId}`);
      if (response.data?.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load calculator data:', error);
    } finally {
      setLoading(false);
    }
  }, [quotationId]);

  useEffect(() => {
    if (modalOpen && quotationId) {
      loadData();
    }
  }, [modalOpen, quotationId, loadData]);

  // Calculate all cells with formulas - iterative approach
  const calculatedCells = useMemo(() => {
    const { cells, settings } = data;
    
    // Create a copy with calculated values
    const result: CellData[][] = cells.map(row => 
      row.map(cell => ({ ...cell, calculatedValue: cell.value }))
    );
    
    // Helper to get cell value (already calculated or raw)
    const getCellValue = (rowIdx: number, colIdx: number): number => {
      if (rowIdx < 0 || rowIdx >= result.length) return 0;
      if (colIdx < 0 || colIdx >= 14) return 0;
      const val = result[rowIdx]?.[colIdx]?.calculatedValue;
      if (val === null || val === undefined || val === '') return 0;
      return typeof val === 'number' ? val : parseFloat(val) || 0;
    };
    
    // Evaluate a single formula
    const evalFormula = (formula: string, _rowIndex: number): number | null => {
      if (!formula || !formula.startsWith('=')) return null;
      
      let expr = formula.substring(1);
      
      // Replace variables
      expr = expr.replace(/\$RATE/g, settings.exchangeRate.toString());
      expr = expr.replace(/\$CLEARANCE/g, settings.clearanceFee.toString());
      
      // Replace percentages: 10% -> 0.1
      expr = expr.replace(/(\d+(?:\.\d+)?)%/g, (_, num) => (parseFloat(num) / 100).toString());
      
      // Replace cell references: C1 -> value
      expr = expr.replace(/([A-N])(\d+)/g, (_, col, row) => {
        const colIdx = col.charCodeAt(0) - 65;
        const rowIdx = parseInt(row) - 1;
        return getCellValue(rowIdx, colIdx).toString();
      });
      
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function(`return ${expr}`);
        const result = fn();
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
          return Math.round(result * 100) / 100;
        }
      } catch (e) {
        console.error('Formula error:', formula, expr, e);
      }
      return null;
    };
    
    // Multiple passes to resolve dependencies (max 5 iterations)
    for (let pass = 0; pass < 5; pass++) {
      let changed = false;
      
      for (let rowIdx = 0; rowIdx < result.length; rowIdx++) {
        for (let colIdx = 0; colIdx < result[rowIdx].length; colIdx++) {
          const cell = result[rowIdx][colIdx];
          if (cell.formula) {
            const newValue = evalFormula(cell.formula, rowIdx);
            if (newValue !== null && newValue !== cell.calculatedValue) {
              cell.calculatedValue = newValue;
              changed = true;
            }
          }
        }
      }
      
      if (!changed) break;
    }
    
    return result;
  }, [data]);

  const saveData = async () => {
    if (!quotationId) {
      message.info('บันทึกในหน่วยความจำ');
      onDataChange?.(data);
      return;
    }
    
    setSaving(true);
    try {
      await api.put(`/api/quotation-calculators/quotation/${quotationId}`, { data });
      message.success('บันทึกสำเร็จ');
      onDataChange?.(data);
    } catch (error) {
      console.error('Failed to save calculator data:', error);
      message.error('บันทึกไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const addRow = () => {
    // const n = data.cells.length + 1;
    const newRow: CellData[] = [
      { value: null },           // A: ราคาของ $
      { value: null },           // B: ราคาต่อรอบ $
      { value: null },           // C: ค่าของ (xRate)
      { value: null },           // D: ค่าบริการ 10%
      { value: null },           // E: Freight $/Sample
      { value: null },           // F: ค่าส่ง (xRate)
      { value: null },           // G: Shipment/year
      { value: null },           // H: ค่าเคลียร์/รอบ
      { value: null },           // I: ค่าเคลียร์/ship
      { value: null },           // J: ราคารวม
      { value: null },           // K: XDS ($)
      { value: null },           // L: ราคารวม+XDS
      { value: null },           // M: จำนวน (N)
      { value: null },           // N: ราคาสุดท้าย
    ];
    
    setData(prev => ({
      ...prev,
      cells: [...prev.cells, newRow],
    }));
  };

  const removeRow = (rowIndex: number) => {
    setData(prev => ({
      ...prev,
      cells: prev.cells.filter((_, idx) => idx !== rowIndex),
    }));
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cell = data.cells[rowIndex]?.[colIndex];
    setEditingCell({ row: rowIndex, col: colIndex });
    
    if (cell?.formula) {
      setEditValue(cell.formula);
    } else {
      setEditValue(cell?.value?.toString() || '');
    }
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    setData(prev => {
      const newCells = prev.cells.map((row, rIdx) => 
        rIdx === rowIndex 
          ? row.map((cell, cIdx) => {
              if (cIdx !== colIndex) return cell;
              
              if (value.startsWith('=')) {
                return { ...cell, value: null, formula: value };
              } else {
                const numValue = value === '' ? null : parseFloat(value);
                return { 
                  ...cell, 
                  value: isNaN(numValue as number) ? value : numValue,
                  formula: undefined 
                };
              }
            })
          : row
      );
      
      return { ...prev, cells: newCells };
    });
  };

  const handleCellBlur = () => {
    if (editingCell) {
      handleCellChange(editingCell.row, editingCell.col, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const formatNumber = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return value.toString();
    return num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getColumnLetter = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const renderMiniPreview = () => (
    <Card
      title="🧮 เครื่องคิดเลขด่วน"
      style={{ marginTop: 16 }}
      extra={<Button type="link" icon={<ExpandOutlined />} onClick={() => setIsModalOpen(true)}>ขยาย</Button>}
    >
      <div style={{ fontSize: 12, color: '#666' }}>
        {data.cells.length > 0 
          ? `${data.cells.length} รายการ | Rate: ${data.settings.exchangeRate} | ค่าเคลียร์: ${data.settings.clearanceFee.toLocaleString()}`
          : 'คลิก "ขยาย" เพื่อใช้งาน วางรายการเพื่อคำนวณต้นทุนเบื้องต้น'}
      </div>
    </Card>
  );

  const renderSpreadsheet = () => (
    <>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={addRow}>
          เพิ่มแถว
        </Button>
        <span style={{ color: '#666', fontSize: 12, alignSelf: 'center' }}>
          💡 พิมพ์สูตรได้ เช่น =A1*33, =B1+C1, =C1*10%, =C1+10% | ใช้ $RATE และ $CLEARANCE อ้างอิงค่าตั้งค่า
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
            minWidth: 1400,
          }}
        >
          <thead>
            <tr style={{ background: '#1890ff', color: 'white' }}>
              <th style={{ padding: '8px 4px', border: '1px solid #ddd', width: 40 }}>#</th>
              {data.columnHeaders.map((header, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '8px 4px',
                    border: '1px solid #ddd',
                    minWidth: 100,
                  }}
                >
                  <div>{getColumnLetter(idx)}</div>
                  <div style={{ fontSize: 11, fontWeight: 'normal' }}>{header}</div>
                </th>
              ))}
              <th style={{ padding: '8px 4px', border: '1px solid #ddd', width: 50 }}>ลบ</th>
            </tr>
          </thead>
          <tbody>
            {calculatedCells.length === 0 ? (
              <tr>
                <td colSpan={14} style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                  ยังไม่มีข้อมูล - คลิก "เพิ่มแถว" เพื่อเริ่มต้น
                </td>
              </tr>
            ) : (
              calculatedCells.map((row, rowIndex) => (
                <tr key={rowIndex} style={{ background: rowIndex % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                  <td style={{ padding: '4px', border: '1px solid #ddd', textAlign: 'center', background: '#f0f0f0' }}>
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, colIndex) => {
                    const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex;
                    const displayValue = cell.calculatedValue;
                    
                    return (
                      <td
                        key={colIndex}
                        style={{
                          padding: '2px',
                          border: '1px solid #ddd',
                          background: isEditing ? '#e6f7ff' : '#fff',
                          cursor: 'text',
                        }}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            style={{
                              width: '100%',
                              border: 'none',
                              outline: 'none',
                              padding: '4px',
                              background: 'transparent',
                              textAlign: 'right',
                            }}
                          />
                        ) : (
                          <Tooltip title={cell.formula || ''}>
                            <div
                              style={{
                                padding: '4px',
                                textAlign: 'right',
                                color: cell.formula ? '#1890ff' : 'inherit',
                                minHeight: 24,
                              }}
                            >
                              {formatNumber(displayValue)}
                            </div>
                          </Tooltip>
                        )}
                      </td>
                    );
                  })}
                  <td style={{ padding: '4px', border: '1px solid #ddd', textAlign: 'center' }}>
                    <Popconfirm
                      title="ลบแถวนี้?"
                      onConfirm={() => removeRow(rowIndex)}
                      okText="ลบ"
                      cancelText="ยกเลิก"
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {calculatedCells.length > 0 && (
        <div style={{ marginTop: 16, padding: 12, background: '#f6ffed', borderRadius: 8, border: '1px solid #b7eb8f' }}>
          <strong>📋 สรุป:</strong>{' '}
          {calculatedCells.length} รายการ |{' '}
          รวมราคาสุดท้าย:{' '}
          <strong style={{ color: '#52c41a' }}>
            {formatNumber(
              calculatedCells.reduce((sum, row) => {
                const lastCol = row[13]?.calculatedValue;
                return sum + (typeof lastCol === 'number' ? lastCol : 0);
              }, 0)
            )} บาท
          </strong>
        </div>
      )}
    </>
  );

  return (
    <>
      {!isExternalControl && renderMiniPreview()}

      <Modal
        title="📊 เครื่องคิดเลขด่วน - คำนวณต้นทุนสินค้านำเข้า"
        open={modalOpen}
        onCancel={closeModal}
        width="95%"
        style={{ top: 20 }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <Button icon={<SettingOutlined />} onClick={() => setIsSettingsOpen(true)}>
                ตั้งค่า (Rate: {data.settings.exchangeRate}, ค่าเคลียร์: {data.settings.clearanceFee.toLocaleString()})
              </Button>
            </Space>
            <Space>
              {quotationId && (
                <Button icon={<ReloadOutlined />} onClick={loadData} loading={loading}>
                  โหลดใหม่
                </Button>
              )}
              <Button type="primary" icon={<SaveOutlined />} onClick={saveData} loading={saving}>
                บันทึก
              </Button>
              <Button onClick={closeModal}>ปิด</Button>
            </Space>
          </div>
        }
      >
        <Spin spinning={loading}>
          {renderSpreadsheet()}
        </Spin>
      </Modal>

      <Modal
        title="⚙️ ตั้งค่าเครื่องคิดเลข"
        open={isSettingsOpen}
        onCancel={() => setIsSettingsOpen(false)}
        onOk={() => setIsSettingsOpen(false)}
        okText="ตกลง"
        cancelText="ยกเลิก"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>อัตราแลกเปลี่ยน (Rate):</label>
            <InputNumber
              value={data.settings.exchangeRate}
              onChange={(value) => setData(prev => ({
                ...prev,
                settings: { ...prev.settings, exchangeRate: value || 33 }
              }))}
              min={1}
              style={{ width: '100%' }}
              addonAfter="บาท/$"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>ค่าเคลียร์ต่อรอบ:</label>
            <InputNumber
              value={data.settings.clearanceFee}
              onChange={(value) => setData(prev => ({
                ...prev,
                settings: { ...prev.settings, clearanceFee: value || 4500 }
              }))}
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/,/g, '') as any}
              addonAfter="บาท"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuickCalculator;
