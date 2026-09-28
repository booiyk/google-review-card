// Konfigurasi Google Review Card
const config = {
  business: {
    name: "Google Review Card",
    location: "Sumedang",
    whatsapp: "6288212725000",
    whatsappUrl: "https://wa.me/6288212725000"
  },
  
  products: {
    pvc: {
      name: "Kartu PVC",
      price: 50000,
      priceFormatted: "Rp 50.000",
      description: "Kartu PVC dengan NFC + QR Code"
    },
    nfc: {
      name: "Kartu Akrilik NFC",
      price: 90000,
      priceFormatted: "Rp 90.000",
      description: "Kartu akrilik premium 10x10 cm dengan NFC + QR Code"
    },
    nfcWholesale: {
      name: "Kartu Akrilik NFC (Grosir)",
      price: 80000,
      priceFormatted: "Rp 80.000",
      minQty: 5,
      description: "Harga khusus pembelian 5+ pcs"
    }
  },
  
  terms: {
    warranty: "3 bulan",
    production: "2 hari",
    freeShipping: "Sumedang",
    payment: ["Tunai", "QRIS"]
  },
  
  specs: {
    size: "10x10 cm",
    material: "Akrilik",
    features: ["NFC", "QR Code"]
  }
};
