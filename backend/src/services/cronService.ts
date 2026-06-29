import cron from 'node-cron';
import ScheduledTransfer from '../models/ScheduledTransfer';
import Account from '../models/Account';
import Transaction from '../models/Transaction';

export const initCronJobs = (): void => {
  // Run every minute in development/production for prompt execution & demo validation
  cron.schedule('* * * * *', async () => {
    console.log('[Cron Job] Checking for pending scheduled transfers...');
    try {
      const now = new Date();
      const pendingTransfers = await ScheduledTransfer.find({
        status: 'pending',
        nextRunDate: { $lte: now }
      });

      if (pendingTransfers.length === 0) {
        return;
      }

      console.log(`[Cron Job] Found ${pendingTransfers.length} pending transfer(s) to execute.`);

      for (const transfer of pendingTransfers) {
        try {
          const sAccount = await Account.findOne({ accountNumber: transfer.sourceAccountNumber });
          if (!sAccount) {
            transfer.status = 'failed';
            await transfer.save();
            console.warn(`[Cron Job] Source account ${transfer.sourceAccountNumber} not found. Transfer failed.`);
            continue;
          }

          if (sAccount.balance < transfer.amount) {
            transfer.status = 'failed';
            await transfer.save();
            console.warn(`[Cron Job] Source account ${transfer.sourceAccountNumber} has insufficient balance. Transfer failed.`);
            continue;
          }

          // Deduct from source account
          sAccount.balance -= transfer.amount;
          await sAccount.save();

          let targetAccId = null;

          // If internal, credit target account
          if (transfer.transferMode === 'Own Account Transfer' || transfer.transferMode === 'Internal Transfer') {
            const tAccount = await Account.findOne({ accountNumber: transfer.targetAccountNumber });
            if (tAccount) {
              tAccount.balance += transfer.amount;
              await tAccount.save();
              targetAccId = tAccount._id;
            }
          }

          // Create Transaction record
          const transactionId = `TXN${Math.floor(100000000 + Math.random() * 900000000)}`;
          const newTransaction = new Transaction({
            transactionId,
            sourceAccount: sAccount._id,
            targetAccount: targetAccId,
            type: 'debit',
            transferMode: transfer.transferMode,
            amount: transfer.amount,
            remarks: transfer.remarks || `Scheduled Transfer: ${transfer.scheduleType}`,
            payeeName: transfer.payeeName,
            payeeAccount: transfer.targetAccountNumber,
            ifscCode: transfer.ifscCode,
            status: 'completed'
          });
          await newTransaction.save();

          // Reschedule if recurring, otherwise complete it
          if (transfer.scheduleType === 'one-time') {
            transfer.status = 'completed';
          } else {
            // Calculate nextRunDate
            const nextRun = new Date(transfer.nextRunDate || now);
            if (transfer.frequency === 'daily') {
              nextRun.setDate(nextRun.getDate() + 1);
            } else if (transfer.frequency === 'weekly') {
              nextRun.setDate(nextRun.getDate() + 7);
            } else if (transfer.frequency === 'monthly') {
              nextRun.setMonth(nextRun.getMonth() + 1);
            }
            transfer.nextRunDate = nextRun;
            transfer.status = 'pending'; // keep it pending for next iteration
          }

          await transfer.save();
          console.log(`[Cron Job] Successfully executed scheduled transfer ${transfer._id} (Txn: ${transactionId}).`);
        } catch (err) {
          console.error(`[Cron Job] Failed to execute scheduled transfer ${transfer._id}:`, err);
        }
      }
    } catch (error) {
      console.error('[Cron Job] Error fetching pending scheduled transfers:', error);
    }
  });
};
