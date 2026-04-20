import * as yup from 'yup';

export const transactionSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .min(2, 'Title must be at least 2 characters'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),
  category: yup
    .string()
    .required('Category is required'),
  type: yup
    .string()
    .oneOf(['income', 'expense'], 'Invalid transaction type')
    .required('Type is required'),
  date: yup
    .string()
    .required('Date is required'),
  notes: yup
    .string()
    .max(200, 'Notes must be less than 200 characters'),
  isRecurring: yup
    .boolean()
    .default(false),
}).required();

export const budgetSchema = yup.object({
  monthlyBudget: yup
    .number()
    .typeError('Budget must be a number')
    .min(0, 'Budget cannot be negative')
    .required('Monthly budget is required'),
}).required();
