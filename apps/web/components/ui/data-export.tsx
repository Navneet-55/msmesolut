'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './toast';

interface DataExportProps {
  data: any[];
  filename?: string;
  formats?: ('csv' | 'json' | 'txt')[];
}

export function DataExport({ data, filename = 'export', formats = ['csv', 'json'] }: DataExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  const formatIcons = {
    csv: FileSpreadsheet,
    json: FileJson,
    txt: FileText,
  };

  const exportToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      ),
    ].join('\n');
    return csvContent;
  };

  const exportToJSON = (data: any[]) => {
    return JSON.stringify(data, null, 2);
  };

  const exportToTXT = (data: any[]) => {
    return data.map((row) => JSON.stringify(row)).join('\n');
  };

  const handleExport = async (format: 'csv' | 'json' | 'txt') => {
    setIsExporting(true);

    try {
      let content: string;
      let mimeType: string;

      switch (format) {
        case 'csv':
          content = exportToCSV(data);
          mimeType = 'text/csv';
          break;
        case 'json':
          content = exportToJSON(data);
          mimeType = 'application/json';
          break;
        case 'txt':
          content = exportToTXT(data);
          mimeType = 'text/plain';
          break;
        default:
          throw new Error('Unsupported format');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported as ${format.toUpperCase()}`);
      setIsOpen(false);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl glass-light hover:bg-white/10 transition-all text-sm"
        disabled={data.length === 0}
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 z-50 glass-card p-2 min-w-[160px]"
            >
              {formats.map((format) => {
                const Icon = formatIcons[format];
                return (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    disabled={isExporting}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm disabled:opacity-50"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                    Export as {format.toUpperCase()}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

