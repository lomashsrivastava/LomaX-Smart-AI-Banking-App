import { Response } from 'express';
import PDFDocument from 'pdfkit';
import { IAccount } from '../models/Account';
import { IUser } from '../models/User';

interface TransactionDoc {
  transactionId: string;
  type: 'credit' | 'debit';
  amount: number;
  remarks?: string;
  transferMode?: string;
  payeeName?: string;
  createdAt: Date;
}

/**
 * Compile transactions and build a branded LomaX statement as a PDF streamed to the response.
 */
export const generatePDFStatement = (
  account: IAccount,
  user: IUser,
  transactions: TransactionDoc[],
  startDateStr: string,
  endDateStr: string,
  res: Response
) => {
  const doc = new PDFDocument({ margin: 50, bufferPages: true });

  // Pipe the PDF document directly to the express response object
  doc.pipe(res);

  // Define colors
  const primaryColor = '#0f172a'; // dark slate
  const secondaryColor = '#0284c7'; // cyan-600
  const textColor = '#334155'; // slate-700
  const lightBg = '#f8fafc'; // slate-50
  const borderCol = '#e2e8f0'; // slate-200

  // 1. Header Section
  doc.rect(0, 0, doc.page.width, 120).fill(primaryColor);
  
  doc.fillColor('#ffffff')
     .font('Helvetica-Bold')
     .fontSize(24)
     .text('LOMAX DIGITAL BANK', 50, 40);
     
  doc.font('Helvetica')
     .fontSize(10)
     .text('Cybernetic Core Banking Node', 50, 70)
     .text('Support: compliance@lomax.com | https://lomax.bank', 50, 85);

  doc.font('Helvetica-Bold')
     .fontSize(14)
     .text('ACCOUNT STATEMENT', 380, 40, { align: 'right', width: 180 });

  doc.font('Helvetica')
     .fontSize(9)
     .text(`Statement Period:`, 380, 70, { align: 'right', width: 180 })
     .text(`${startDateStr} to ${endDateStr}`, 380, 85, { align: 'right', width: 180 });

  // 2. Account Information Block
  let y = 150;
  doc.fillColor(primaryColor)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text('ACCOUNT HOLDER DETAILS', 50, y);

  doc.font('Helvetica-Bold')
     .fontSize(11)
     .text('BRANCH DETAILS', 320, y);

  y += 18;
  // Line separator
  doc.moveTo(50, y).lineTo(562, y).strokeColor(borderCol).stroke();

  y += 10;
  doc.fillColor(textColor)
     .font('Helvetica-Bold')
     .fontSize(9)
     .text('Name:', 50, y)
     .font('Helvetica')
     .text(`${user.firstName} ${user.lastName}`, 120, y)
     .fillColor(textColor)
     .font('Helvetica-Bold')
     .text('Branch Name:', 320, y)
     .font('Helvetica')
     .text(account.branchName, 410, y);

  y += 15;
  doc.fillColor(textColor)
     .font('Helvetica-Bold')
     .text('Customer ID:', 50, y)
     .font('Helvetica')
     .text(user.customerId || 'CUST100001', 120, y)
     .fillColor(textColor)
     .font('Helvetica-Bold')
     .text('Branch Code:', 320, y)
     .font('Helvetica')
     .text(account.branchCode, 410, y);

  y += 15;
  doc.fillColor(textColor)
     .font('Helvetica-Bold')
     .text('Account No:', 50, y)
     .font('Helvetica')
     .text(account.accountNumber, 120, y)
     .fillColor(textColor)
     .font('Helvetica-Bold')
     .text('IFSC Code:', 320, y)
     .font('Helvetica')
     .text(account.ifscCode, 410, y);

  y += 15;
  doc.fillColor(textColor)
     .font('Helvetica-Bold')
     .text('Account Type:', 50, y)
     .font('Helvetica')
     .text(account.accountType, 120, y)
     .fillColor(textColor)
     .font('Helvetica-Bold')
     .text('Status:', 320, y)
     .font('Helvetica')
     .text(account.status.toUpperCase(), 410, y);

  // 3. Statement Summary Card
  y += 35;
  doc.rect(50, y, 512, 55).fill(lightBg).strokeColor(borderCol).stroke();

  // Summary figures
  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const closingBalance = account.balance;
  const startingBalance = closingBalance - totalCredits + totalDebits;

  doc.fillColor(textColor).font('Helvetica-Bold').fontSize(8);
  doc.text('STARTING BALANCE', 70, y + 15, { width: 100, align: 'center' });
  doc.text('TOTAL DEBITS (-)', 190, y + 15, { width: 100, align: 'center' });
  doc.text('TOTAL CREDITS (+)', 310, y + 15, { width: 100, align: 'center' });
  doc.text('CLOSING BALANCE', 430, y + 15, { width: 100, align: 'center' });

  doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(11);
  doc.text(`INR ${startingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 70, y + 30, { width: 100, align: 'center' });
  
  doc.fillColor('#e11d48'); // rose-600
  doc.text(`INR ${totalDebits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 190, y + 30, { width: 100, align: 'center' });
  
  doc.fillColor('#16a34a'); // green-600
  doc.text(`INR ${totalCredits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 310, y + 30, { width: 100, align: 'center' });
  
  doc.fillColor(secondaryColor); // cyan-600
  doc.text(`INR ${closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 430, y + 30, { width: 100, align: 'center' });

  // 4. Transactions Table
  y += 85;
  doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(11).text('TRANSACTION LEDGER RECORDS', 50, y);

  y += 18;
  
  // Table Header Drawing Helper
  const drawTableHeader = (posY: number) => {
    doc.rect(50, posY, 512, 22).fill(primaryColor);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5);
    doc.text('DATE', 60, posY + 7, { width: 70 });
    doc.text('TRANSACTION ID', 135, posY + 7, { width: 90 });
    doc.text('DESCRIPTION / REMARKS', 230, posY + 7, { width: 170 });
    doc.text('TYPE', 410, posY + 7, { width: 50, align: 'center' });
    doc.text('AMOUNT', 470, posY + 7, { width: 80, align: 'right' });
  };

  drawTableHeader(y);
  y += 22;

  // Running balance starting point
  let runningBalance = startingBalance;

  // Loop transactions
  transactions.forEach((txn, index) => {
    // Pagination Check: If page height exceeds 700, create a new page
    if (y > 680) {
      doc.addPage();
      y = 50;
      drawTableHeader(y);
      y += 22;
    }

    // Row alternating background
    if (index % 2 === 1) {
      doc.rect(50, y, 512, 24).fill(lightBg);
    } else {
      doc.rect(50, y, 512, 24).fill('#ffffff');
    }

    // Draw borders
    doc.moveTo(50, y + 24).lineTo(562, y + 24).strokeColor(borderCol).stroke();

    // Date formatting
    const dateStr = new Date(txn.createdAt).toLocaleDateString('en-IN', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    // Description text formatting
    const desc = txn.remarks || txn.payeeName || txn.transferMode || 'Core Ledger Entry';

    doc.fillColor(textColor).font('Helvetica').fontSize(8);
    doc.text(dateStr, 60, y + 8, { width: 70 });
    doc.text(txn.transactionId, 135, y + 8, { width: 90 });
    doc.text(desc, 230, y + 8, { width: 170, height: 12, ellipsis: true });
    
    // Type and amount coloring
    const isCredit = txn.type === 'credit';
    doc.font('Helvetica-Bold');
    if (isCredit) {
      doc.fillColor('#16a34a').text('CREDIT', 410, y + 8, { width: 50, align: 'center' });
      doc.text(`+₹${txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 470, y + 8, { width: 80, align: 'right' });
      runningBalance += txn.amount;
    } else {
      doc.fillColor('#e11d48').text('DEBIT', 410, y + 8, { width: 50, align: 'center' });
      doc.text(`-₹${txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, 470, y + 8, { width: 80, align: 'right' });
      runningBalance -= txn.amount;
    }

    y += 24;
  });

  // 5. Footer Page numbers
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fillColor('#94a3b8')
       .font('Helvetica')
       .fontSize(8)
       .text(`Page ${i + 1} of ${range.count}`, 50, 750, { align: 'center', width: 512 });
  }

  doc.end();
};

/**
 * Generate a CSV string containing account statement records.
 */
export const generateCSVStatement = (
  account: IAccount,
  transactions: TransactionDoc[]
): string => {
  const headers = ['Date', 'Transaction ID', 'Description', 'Type', 'Amount (INR)', 'Status'];
  const rows = [headers.join(',')];

  transactions.forEach(t => {
    const dateStr = new Date(t.createdAt).toISOString().split('T')[0];
    const desc = (t.remarks || t.payeeName || t.transferMode || 'Entry').replace(/,/g, ' ');
    const row = [
      dateStr,
      t.transactionId,
      desc,
      t.type.toUpperCase(),
      t.amount.toString(),
      'COMPLETED'
    ];
    rows.push(row.join(','));
  });

  return rows.join('\n');
};
