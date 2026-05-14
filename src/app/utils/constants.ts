export class Constants {
  static WHATSAPP_NUMBER = '5511943981467';
  static WHATSAPP_DISPLAY = '+55 (11) 94398-1467';
  static WHATSAPP_MESSAGE = 'Olá, gostaria de fazer um orçamento.';
  static PHONE_DISPLAY = '+55 (11) 2404-6100';
  static PHONE_HREF = 'tel:+551124046100';
  static STORE_ADDRESS_LINE = 'Av. Tiradentes, 4133 - Jardim Santa Edwirges';
  static STORE_ADDRESS_CITY = 'Guarulhos, SP';
  static STORE_ADDRESS_ZIP = '07196-000';
  static STORE_ADDRESS_FULL = `${Constants.STORE_ADDRESS_LINE}, ${Constants.STORE_ADDRESS_CITY} CEP: ${Constants.STORE_ADDRESS_ZIP}`;

  static whatsappUrl(message = Constants.WHATSAPP_MESSAGE): string {
    return `https://wa.me/${Constants.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }
}
