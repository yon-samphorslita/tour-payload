import type { GlobalConfig } from 'payload'

// MRL's own company details, printed on every invoice PDF (VAT TIN, address,
// bank info, footer contact details). Any logged-in user can read this;
// only admins can change it.
export const CompanyInfo: GlobalConfig = {
  slug: 'company-info',
  label: 'Company Info',
  admin: {
    group: 'Settings',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'vatTin',
      type: 'text',
      label: 'VAT TIN',
      defaultValue: 'E003-1500005701',
    },
    {
      name: 'addressKH',
      type: 'textarea',
      label: 'Address (Khmer)',
      defaultValue: 'ផ្ទះលេខ១៣៦E0, ផ្លូវ ១៣៦, សង្កាត់ផ្សារកណ្តាលទី២, ខណ្ឌដូនពេញ, ភ្នំពេញ',
    },
    {
      name: 'addressEN',
      type: 'textarea',
      label: 'Address (English)',
      defaultValue: '#136E0, St 136, Sangkat Psar Kandal II, Khan Duan Penh, Phnom Penh.',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
      defaultValue: '០២៣ ២១៥ ២៥៦/០១២ ៨៤៩ ៩៣៣',
    },
    {
      name: 'bankName',
      type: 'text',
      label: 'Bank name',
      defaultValue: 'MAY Bank',
    },
    {
      name: 'bankAccountName',
      type: 'text',
      label: 'Bank account name',
      defaultValue: 'MRL TRAVEL',
    },
    {
      name: 'bankAccountNumber',
      type: 'text',
      label: 'Bank account number',
      defaultValue: '000010200447808',
    },
    {
      name: 'bankSwiftCode',
      type: 'text',
      label: 'Bank SWIFT code',
      defaultValue: 'MBBEKHPP',
    },
    {
      name: 'bank2Name',
      type: 'text',
      label: 'Second bank name',
      defaultValue: 'FTB Bank',
    },
    {
      name: 'bank2AccountName',
      type: 'text',
      label: 'Second bank account name',
    },
    {
      name: 'bank2AccountNumber',
      type: 'text',
      label: 'Second bank account number',
    },
    {
      name: 'bank2SwiftCode',
      type: 'text',
      label: 'Second bank SWIFT code',
    },
    {
      name: 'footerCompanyName',
      type: 'text',
      label: 'Footer company name',
      defaultValue: 'MRL Travel',
    },
    {
      name: 'footerMobile',
      type: 'text',
      label: 'Footer mobile number',
      defaultValue: '012 849 933',
    },
    {
      name: 'footerTelegram',
      type: 'text',
      label: 'Footer Telegram',
      defaultValue: '012 849 933',
    },
  ],
}
