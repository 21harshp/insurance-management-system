import * as XLSX from 'xlsx';

/**
 * Export an array of objects to an Excel (.xlsx) file.
 * @param {Object[]} rows   - Array of flat objects (all fields you want exported)
 * @param {string}   filename - File name without extension
 */
export const exportToExcel = (rows, filename = 'export') => {
    if (!rows || rows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Auto-size columns
    const colWidths = Object.keys(rows[0]).map((key) => ({
        wch: Math.max(key.length, ...rows.map((r) => String(r[key] ?? '').length))
    }));
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `${filename}.xlsx`);
};
