// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load config data into page
    loadConfigData();
    
    // Setup FAQ accordion
    setupFAQ();
    
    // Setup order buttons
    setupOrderButtons();
    
    // Setup form submission
    setupFormSubmit();
    
    // Setup price calculator
    setupPriceCalculator();
});

// Load config data into page elements
function loadConfigData() {
    // Update product prices
    document.getElementById('product-pvc-price').textContent = config.products.pvc.priceFormatted;
    document.getElementById('product-nfc-price').textContent = config.products.nfc.priceFormatted;
    document.getElementById('product-wholesale-price').textContent = config.products.nfcWholesale.priceFormatted;
    
    // Update footer WhatsApp
    const footerWA = document.getElementById('footer-wa');
    footerWA.textContent = '0' + config.business.whatsapp.substring(2);
    footerWA.href = config.business.whatsappUrl;
}

// Setup FAQ accordion functionality
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Setup order buttons to scroll to form
function setupOrderButtons() {
    const orderButtons = document.querySelectorAll('.btn-order');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productType = button.getAttribute('data-product');
            
            // Scroll to form
            document.getElementById('pesan').scrollIntoView({ behavior: 'smooth' });
            
            // Pre-select product in form
            setTimeout(() => {
                const productSelect = document.getElementById('produk');
                productSelect.value = productType;
                
                // Trigger change event to update price estimate
                productSelect.dispatchEvent(new Event('change'));
            }, 500);
        });
    });
}

// Setup price calculator
function setupPriceCalculator() {
    const produkSelect = document.getElementById('produk');
    const jumlahInput = document.getElementById('jumlah');
    const priceEstimate = document.getElementById('priceEstimate');
    
    function calculatePrice() {
        const productType = produkSelect.value;
        const quantity = parseInt(jumlahInput.value) || 0;
        
        if (!productType || quantity < 1) {
            priceEstimate.textContent = '';
            return;
        }
        
        let price = 0;
        let productName = '';
        
        switch(productType) {
            case 'pvc':
                price = config.products.pvc.price;
                productName = config.products.pvc.name;
                break;
            case 'nfc':
                price = config.products.nfc.price;
                productName = config.products.nfc.name;
                break;
            case 'wholesale':
                price = config.products.nfcWholesale.price;
                productName = config.products.nfcWholesale.name;
                
                if (quantity < config.products.nfcWholesale.minQty) {
                    priceEstimate.textContent = `Minimal pembelian ${config.products.nfcWholesale.minQty} pcs untuk harga grosir`;
                    priceEstimate.style.color = '#ff4444';
                    return;
                }
                break;
        }
        
        const total = price * quantity;
        const formatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(total);
        
        priceEstimate.textContent = `Estimasi total: ${formatted}`;
        priceEstimate.style.color = '#1A56DB';
    }
    
    produkSelect.addEventListener('change', calculatePrice);
    jumlahInput.addEventListener('input', calculatePrice);
}

// Setup form submission to WhatsApp
function setupFormSubmit() {
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const nama = document.getElementById('nama').value;
        const bisnis = document.getElementById('bisnis').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const alamat = document.getElementById('alamat').value;
        const produk = document.getElementById('produk').value;
        const jumlah = document.getElementById('jumlah').value;
        const googleLink = document.getElementById('googleLink').value;
        const catatan = document.getElementById('catatan').value;
        
        // Validate product selection
        if (!produk) {
            alert('Silakan pilih produk terlebih dahulu');
            return;
        }
        
        // Get product details
        let productName = '';
        let productPrice = '';
        let price = 0;
        
        switch(produk) {
            case 'pvc':
                productName = config.products.pvc.name;
                productPrice = config.products.pvc.priceFormatted;
                price = config.products.pvc.price;
                break;
            case 'nfc':
                productName = config.products.nfc.name;
                productPrice = config.products.nfc.priceFormatted;
                price = config.products.nfc.price;
                break;
            case 'wholesale':
                productName = config.products.nfcWholesale.name;
                productPrice = config.products.nfcWholesale.priceFormatted;
                price = config.products.nfcWholesale.price;
                
                // Validate minimum quantity for wholesale
                if (parseInt(jumlah) < config.products.nfcWholesale.minQty) {
                    alert(`Pembelian grosir minimal ${config.products.nfcWholesale.minQty} pcs`);
                    return;
                }
                break;
        }
        
        // Calculate total
        const total = price * parseInt(jumlah);
        const totalFormatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(total);
        
        // Build WhatsApp message
        let message = `*PEMESANAN GOOGLE REVIEW CARD*\n\n`;
        message += `*Data Pemesan:*\n`;
        message += `Nama: ${nama}\n`;
        message += `Bisnis: ${bisnis}\n`;
        message += `WhatsApp: ${whatsapp}\n`;
        message += `Alamat: ${alamat}\n\n`;
        message += `*Detail Pesanan:*\n`;
        message += `Produk: ${productName}\n`;
        message += `Harga Satuan: ${productPrice}\n`;
        message += `Jumlah: ${jumlah} pcs\n`;
        message += `*Total: ${totalFormatted}*\n\n`;
        
        if (googleLink) {
            message += `Link Google Review: ${googleLink}\n\n`;
        }
        
        if (catatan) {
            message += `Catatan: ${catatan}\n\n`;
        }
        
        message += `Mohon konfirmasi ketersediaan dan detail pengiriman. Terima kasih!`;
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp URL
        const waURL = `${config.business.whatsappUrl}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(waURL, '_blank');
    });
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
