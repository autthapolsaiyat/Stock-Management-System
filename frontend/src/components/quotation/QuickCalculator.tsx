import React, { useState } from 'react';
import { Modal, Input, Button, Table, Space, message, Divider } from 'antd';
import { CalculatorOutlined, ClearOutlined, PlusOutlined } from '@ant-design/icons';
import type { CalculatorItem, CalculatorResult } from '../../types/quotation';

const { TextArea } = Input;

interface QuickCalculatorProps {
  open: boolean;
  onClose: () => void;
  onAddItems: (items: CalculatorItem[]) => void;
}

const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  open,
  onClose,
  onAddItems,
}) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const parseInput = (text: string): CalculatorItem[] => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    const items: CalculatorItem[] = [];

    for (const line of lines) {
      // รองรับหลายรูปแบบ: "ชื่อ, จำนวน, ราคา" หรือ "ชื่อ จำนวน ราคา" หรือ tab separated
      const parts = line.split(/[,\t]+/).map(p => p.trim());
      
      if (parts.length >= 3) {
        const name = parts[0];
        const qty = parseFloat(parts[1]) || 1;
        const price = parseFloat(parts[2].replace(/,/g, '')) || 0;
        
        items.push({
          name,
          qty,
          price,
          total: qty * price,
        });
      } else if (parts.length === 2) {
        // อาจจะเป็น "ชื่อ, ราคา" (จำนวน = 1)
        const name = parts[0];
        const price = parseFloat(parts[1].replace(/,/g, '')) || 0;
        
        items.push({
          name,
          qty: 1,
          price,
          total: price,
        });
      }
    }

    return items;
  };

  const handleCalculate = () => {
    if (!inputText.trim()) {
      message.warning('กรุณาใส่ข้อมูล');
      return;
    }

    const items = parseInput(inputText);
    
    if (items.length === 0) {
      message.error('ไม่สามารถอ่านข้อมูลได้ กรุณาตรวจสอบรูปแบบ');
      return;
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vat = subtotal * 0.07;
    const grandTotal = subtotal + vat;

    setResult({
      items,
      subtotal,
      vat,
      grandTotal,
    });
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
  };

  const handleAddToQuotation = () => {
    if (result && result.items.length > 0) {
      onAddItems(result.items);
      handleClear();
      message.success(`เพิ่ม ${result.items.length} รายการสำเร็จ`);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (error) {
      message.error('ไม่สามารถวางข้อมูลได้');
    }
  };

  const columns = [
    {
      title: '#',
      width: 50,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'รายการ',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: 'จำนวน',
      dataIndex: 'qty',
      width: 80,
      align: 'center' as const,
    },
    {
      title: 'ราคา/หน่วย',
      dataIndex: 'price',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString('th-TH', { minimumFractionDigits: 2 }),
    },
    {
      title: 'รวม',
      dataIndex: 'total',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString('th-TH', { minimumFractionDigits: 2 }),
    },
  ];

  return (
    <Modal
      title="🧮 เครื่องคิดเลขด่วน - คำนวณต้นทุนเบื้องต้น"
      open={open}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="clear" icon={<ClearOutlined />} onClick={handleClear}>
          ล้าง
        </Button>,
        <Button key="close" onClick={onClose}>
          ปิด
        </Button>,
        <Button
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddToQuotation}
          disabled={!result || result.items.length === 0}
        >
          เพิ่มไปรายการจริง
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, color: '#666' }}>
          📝 วาง/พิมพ์รายการ (รูปแบบ: ชื่อสินค้า, จำนวน, ราคา)
        </div>
        <TextArea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`ตัวอย่าง:\nเครื่องตรวจ DNA, 1, 80000\nชุดทดสอบ, 5, 9000\nสารเคมี, 10, 500`}
          style={{ fontFamily: 'monospace' }}
        />
        <Space style={{ marginTop: 12 }}>
          <Button onClick={handlePaste}>📋 วาง Paste</Button>
          <Button type="primary" icon={<CalculatorOutlined />} onClick={handleCalculate}>
            คำนวณ
          </Button>
        </Space>
      </div>

      {result && (
        <>
          <Divider>📊 ผลการคำนวณ</Divider>
          
          <Table
            dataSource={result.items}
            columns={columns}
            rowKey={(_, index) => index!.toString()}
            size="small"
            pagination={false}
            style={{ marginBottom: 16 }}
          />

          <div style={{ 
            background: '#f5f5f5', 
            padding: 16, 
            borderRadius: 8,
            fontSize: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>รวมทั้งหมด:</span>
              <span>฿{result.subtotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>VAT 7%:</span>
              <span>฿{result.vat.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 18 }}>
              <span>ยอดสุทธิ:</span>
              <span>฿{result.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ marginTop: 8, color: '#888', textAlign: 'right' }}>
              ({result.items.length} รายการ)
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default QuickCalculator;
