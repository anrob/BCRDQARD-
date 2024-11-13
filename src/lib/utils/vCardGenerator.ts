export function generateVCard(card: {
  businessName: string;
  businessDescription?: string;
  phoneNumber: string;
  email: string;
  address: string;
  website?: string;
}) {
  const vCardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.businessName}`,
    `ORG:${card.businessName}`,
    card.businessDescription ? `NOTE:${card.businessDescription}` : '',
    `TEL;TYPE=work,voice:${card.phoneNumber}`,
    `EMAIL;TYPE=work:${card.email}`,
    `ADR;TYPE=work:;;${card.address}`,
    card.website ? `URL:${card.website}` : '',
    'END:VCARD'
  ]
    .filter(Boolean) // Remove empty lines
    .join('\r\n');

  return vCardData;
} 