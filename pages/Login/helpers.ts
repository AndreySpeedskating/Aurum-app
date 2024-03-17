export const phoneFormatter = (value: string): string => {
  const phone = value?.replace('+7', '')?.replace(/\D/g, '')?.slice(0, 10)?.split('');
  return `+7 ${phone?.length > 0 ? '(' : ''}${[
    phone['0'] || '',
    phone['1'] || '',
    phone['2'] || '',
  ]}${phone?.length >= 3 ? ')' : ''}${[phone['3'] || '', phone['4'] || '', phone['5'] || '']}${
    phone?.length > 6 ? '-' : ''
  }${[phone['6'] || '', phone['7'] || '']}${phone?.length > 8 ? '-' : ''}${[
    phone['8'] || '',
    phone['9'] || '',
  ]}`
    ?.split(',')
    ?.join('')
    ?.slice(0, 17);
};

export const phoneValidation = (phone: string): boolean =>
  !!phone.match(/^(\+7)?[\s\ ]?\(?[0-9]{3}\)?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/);
