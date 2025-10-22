// Shared JavaScript across all pages
document.addEventListener('DOMContentLoaded', function() {
    // State management
    const state = {
        items: [],
        clientName: '',
        discount: 0
    };

    // DOM Elements
    const elements = {
        itemForm: document.getElementById('itemForm'),
        productName: document.getElementById('productName'),
        price: document.getElementById('price'),
        quantity: document.getElementById('quantity'),
        formError: document.getElementById('formError'),
        quotationItemsContainer: document.getElementById('quotationItemsContainer'),
        emptyState: document.getElementById('emptyState'),
        itemsTable: document.getElementById('itemsTable'),
        itemsTableBody: document.getElementById('itemsTableBody'),
        clientNameInput: document.getElementById('clientName'),
        discountInput: document.getElementById('discount'),
        totalPrice: document.getElementById('totalPrice'),
        discountAmount: document.getElementById('discountAmount'),
        finalPrice: document.getElementById('finalPrice'),
        generatePdfBtn: document.getElementById('generatePdfBtn'),
        pdfPreviewModal: document.getElementById('pdfPreviewModal'),
        pdfPreviewLoader: document.getElementById('pdfPreviewLoader'),
        pdfPreviewDocument: document.getElementById('pdfPreviewDocument'),
        downloadPdfBtn: document.getElementById('downloadPdfBtn'),
        closePreviewBtn: document.getElementById('closePreviewBtn')
    };

    // Initialize the application
    function init() {
        setupEventListeners();
        updateUI();
    }

    // Set up event listeners
    function setupEventListeners() {
        elements.itemForm.addEventListener('submit', handleAddItem);
        elements.clientNameInput.addEventListener('input', handleClientNameChange);
        elements.discountInput.addEventListener('input', handleDiscountChange);
        elements.generatePdfBtn.addEventListener('click', showPdfPreview);
        elements.downloadPdfBtn.addEventListener('click', downloadPdf);
        elements.closePreviewBtn.addEventListener('click', closePdfPreview);
    }

    // Handle adding a new item to the quotation
    function handleAddItem(e) {
        e.preventDefault();
        
        // Get form values
        const productName = elements.productName.value.trim();
        const price = parseFloat(elements.price.value);
        const quantity = parseInt(elements.quantity.value);
        
        // Validate form
        if (!productName || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
            showError('Please fill all fields with valid values');
            return;
        }
        
        // Add item to state
        const newItem = {
            id: Date.now(),
            productName,
            price,
            quantity,
            subtotal: price * quantity
        };
        
        state.items.push(newItem);
        
        // Reset form
        elements.itemForm.reset();
        hideError();
        
        // Update UI
        updateUI();
    }

    // Handle client name change
    function handleClientNameChange(e) {
        state.clientName = e.target.value;
    }

    // Handle discount change
    function handleDiscountChange(e) {
        const discount = parseFloat(e.target.value);
        state.discount = isNaN(discount) ? 0 : Math.min(100, Math.max(0, discount));
        updateFinancialSummary();
    }

    // Remove an item from the quotation
    function removeItem(id) {
        state.items = state.items.filter(item => item.id !== id);
        updateUI();
    }

    // Update the entire UI
    function updateUI() {
        renderItemsList();
        updateFinancialSummary();
        updateGenerateButton();
    }

    // Render the items list
    function renderItemsList() {
        if (state.items.length === 0) {
            elements.emptyState.classList.remove('hidden');
            elements.itemsTable.classList.add('hidden');
            return;
        }
        
        elements.emptyState.classList.add('hidden');
        elements.itemsTable.classList.remove('hidden');
        
        // Clear existing items
        elements.itemsTableBody.innerHTML = '';
        
        // Add items to table
        state.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.productName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${item.price.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.quantity}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${item.subtotal.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button data-id="${item.id}" class="remove-item-btn text-red-600 hover:text-red-900">
                        <i data-feather="trash-2"></i>
                    </button>
                </td>
            `;
            elements.itemsTableBody.appendChild(row);
        });
        
        // Re-initialize feather icons
        feather.replace();
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                removeItem(id);
            });
        });
    }

    // Update financial summary
    function updateFinancialSummary() {
        const total = state.items.reduce((sum, item) => sum + item.subtotal, 0);
        const discountAmount = total * (state.discount / 100);
        const final = total - discountAmount;
        
        elements.totalPrice.textContent = `₹${total.toFixed(2)}`;
        elements.discountAmount.textContent = `₹${discountAmount.toFixed(2)}`;
        elements.finalPrice.textContent = `₹${final.toFixed(2)}`;
    }

    // Update generate button state
    function updateGenerateButton() {
        elements.generatePdfBtn.disabled = state.items.length === 0;
    }

    // Show error message
    function showError(message) {
        elements.formError.textContent = message;
        elements.formError.classList.remove('hidden');
    }

    // Hide error message
    function hideError() {
        elements.formError.classList.add('hidden');
    }

    // Show PDF preview
    function showPdfPreview() {
        elements.pdfPreviewModal.classList.remove('hidden');
        elements.pdfPreviewLoader.classList.remove('hidden');
        elements.pdfPreviewDocument.classList.add('hidden');
        
        // Generate PDF content after a short delay to show loader
        setTimeout(generatePdfContent, 500);
    }

    // Generate PDF content
    function generatePdfContent() {
        const total = state.items.reduce((sum, item) => sum + item.subtotal, 0);
        const discountAmount = total * (state.discount / 100);
        const final = total - discountAmount;
        const date = new Date().toLocaleDateString();
        const quoteNumber = `Q-${Date.now()}`;
        
        // Create PDF content
        elements.pdfPreviewDocument.innerHTML = `
            <div class="max-w-4xl mx-auto p-8 bg-white">
                <div class="border-b pb-6 mb-6">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="flex items-center mb-2">
                                <img src="assets/logo.png" alt="Elevate Edge Logo" style="width:60px;height:60px;margin-right:12px;" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 48 48\\'><rect width=\\'48\\' height=\\'48\\' fill=\\'%23dfa667\\' rx=\\'8\\'/><text x=\\'50%\\' y=\\'55%\\' font-size=\\'18\\' font-family=\\'Poppins,Arial\\' font-weight=\\'700\\' text-anchor=\\'middle\\' fill=\\'%23111111\\'>EE</text></svg>'" />
                                <div>
                                    <h1 class="text-2xl font-bold text-gray-800">Elevate Edge Interiors</h1>
                                    <p class="text-gray-600 text-sm">LET'S DESIGN YOUR DREAM SPACE TOGETHER.</p>
                                </div>
                            </div>
                            <p class="text-gray-700 text-sm">Jubilee Hills, Hyderabad - 500033, Telangana<br>Phone: +91 89197 94276 | Email: studioelevateedge@gmail.com</p>
                        </div>
                        <div class="text-right">
                            <h2 class="text-3xl font-bold text-indigo-700 mb-2">QUOTATION</h2>
                            <p class="text-gray-600"><span class="font-medium">Date:</span> ${date}</p>
                            <p class="text-gray-600"><span class="font-medium">Quote #:</span> ${quoteNumber}</p>
                        </div>
                    </div>
                </div>
                
                ${state.clientName ? `
                <div class="mb-8">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">Bill To:</h3>
                    <p class="text-gray-700">${state.clientName}</p>
                </div>
                ` : ''}
                
                <div class="mb-8">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-100">
                                <th class="text-left py-3 px-4 font-medium text-gray-700">Product Name</th>
                                <th class="text-right py-3 px-4 font-medium text-gray-700">Price (₹)</th>
                                <th class="text-right py-3 px-4 font-medium text-gray-700">Quantity</th>
                                <th class="text-right py-3 px-4 font-medium text-gray-700">Subtotal (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.items.map(item => `
                            <tr class="border-b">
                                <td class="py-3 px-4 text-gray-700">${item.productName}</td>
                                <td class="py-3 px-4 text-right text-gray-700">₹${item.price.toFixed(2)}</td>
                                <td class="py-3 px-4 text-right text-gray-700">${item.quantity}</td>
                                <td class="py-3 px-4 text-right text-gray-700">₹${item.subtotal.toFixed(2)}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="flex justify-end mb-8">
                    <div class="w-64">
                        <div class="flex justify-between py-2">
                            <span class="text-gray-600">Subtotal:</span>
                            <span class="font-medium">₹${total.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between py-2">
                            <span class="text-gray-600">Discount (${state.discount}%):</span>
                            <span class="font-medium">-₹${discountAmount.toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between py-3 border-t border-b border-gray-300 font-bold text-lg">
                            <span>Total:</span>
                            <span class="text-indigo-700">₹${final.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="pt-6 border-t border-gray-200">
                    <p class="text-center text-gray-600 mb-2">Thank you for your business!</p>
                    <p class="text-center text-gray-500 text-sm">If you have any questions about this quotation, please contact us at studioelevateedge@gmail.com</p>
                </div>
            </div>
        `;
        
        elements.pdfPreviewLoader.classList.add('hidden');
        elements.pdfPreviewDocument.classList.remove('hidden');
    }

    // Download PDF
    async function downloadPdf() {
        const { jsPDF } = window.jspdf;
        // Ensure web fonts are loaded so text renders crisply
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        // Increase scale for much higher resolution (can be 3-5). Beware: higher scale => more memory.
        const baseDPR = window.devicePixelRatio || 1;
        const scale = Math.max(2, Math.min(5, baseDPR * 2)); // typically 4 on standard displays

        // Calculate full width/height of the element to capture
        const width = Math.ceil(elements.pdfPreviewDocument.scrollWidth);
        const height = Math.ceil(elements.pdfPreviewDocument.scrollHeight);

        const options = {
            scale,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            width,
            height,
            scrollY: -window.scrollY
        };

        const fullCanvas = await html2canvas(elements.pdfPreviewDocument, options);

        // We'll slice the fullCanvas into A4-sized pages (in pixels) to avoid scaling artifacts
        const pdf = new jsPDF('p', 'mm', 'a4');
        const a4WidthMm = 210;
        const a4HeightMm = 297;

        // px per mm on the captured canvas
        const pxPerMm = fullCanvas.width / a4WidthMm;
        const pageHeightPx = Math.floor(a4HeightMm * pxPerMm);

        let renderedHeight = 0;
        let pageCount = 0;

        while (renderedHeight < fullCanvas.height) {
            const canvasPage = document.createElement('canvas');
            canvasPage.width = fullCanvas.width;
            canvasPage.height = Math.min(pageHeightPx, fullCanvas.height - renderedHeight);

            const ctx = canvasPage.getContext('2d');
            // improve rendering quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(
                fullCanvas,
                0,
                renderedHeight,
                fullCanvas.width,
                canvasPage.height,
                0,
                0,
                canvasPage.width,
                canvasPage.height
            );

            const pageData = canvasPage.toDataURL('image/png'); // lossless

            const pageHeightMm = canvasPage.height / pxPerMm;

            if (pageCount > 0) pdf.addPage();
            pdf.addImage(pageData, 'PNG', 0, 0, a4WidthMm, pageHeightMm);

            renderedHeight += canvasPage.height;
            pageCount++;
        }

        // Generate filename
        const clientName = state.clientName || 'Client';
        const date = new Date().toISOString().slice(0, 10);
        const filename = `Quotation-${clientName.replace(/\s+/g, '_')}-${date}.pdf`;

        pdf.save(filename);
    }

    // Close PDF preview
    function closePdfPreview() {
        elements.pdfPreviewModal.classList.add('hidden');
    }

    // Initialize the application
    init();
});