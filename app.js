// Core Application Logic for B.N.P Tech Solutions

window.getProducts = async function () {
    try {
        return window.PRODUCT_DATA || [];
    } catch (error) {
        console.error('Error accessing product data:', error);
        return [];
    }
};

// Render Products to Grid
window.renderProducts = function (products, containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!Array.isArray(products)) {
        container.innerHTML = `<div class="col-span-full py-12 text-center text-red-500">Error loading product intelligence.</div>`;
        return;
    }

    const displayItems = limit ? products.slice(0, limit) : products;

    if (displayItems.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-12 text-center text-gray-400">
                <p>No active inventory units found.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = displayItems.map((p, index) => {
        const images = Array.isArray(p.images) ? p.images : [p.image || ''];
        
        return `
        <div onclick="showProductDetails('${p.id}')" class="reveal delay-${(index % 4) * 100} group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-200 cursor-pointer">
            <!-- Image Slider Container -->
            <div class="h-48 bg-gray-50 relative overflow-hidden">
                <div class="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide" id="slider-${p.id}">
                    ${images.map(img => `
                        <div class="flex-shrink-0 w-full h-full snap-center">
                            <img src="${img}" alt="${p.name}" class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105">
                        </div>
                    `).join('')}
                </div>
                
                <!-- Simple Slider Dots -->
                ${images.length > 1 ? `
                    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        ${images.map((_, i) => `<div class="w-1.5 h-1.5 rounded-full bg-white/50 border border-black/10"></div>`).join('')}
                    </div>
                ` : ''}

                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
                
                <!-- View Details Overly Button -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <span class="px-5 py-2 bg-slate-900/90 text-white text-[10px] uppercase font-black rounded-full backdrop-blur-sm tracking-widest">View Intel</span>
                </div>
            </div>

            <div class="p-5 flex flex-col flex-grow">
                <div class="mb-3">
                    <span class="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded mb-2 inline-block">${p.model || 'Technical Unit'}</span>
                    <h3 class="text-lg font-black text-slate-900 leading-tight mb-1.5 line-clamp-2" title="${p.name}">${p.name}</h3>
                    <p class="text-slate-500 text-[11px] leading-relaxed line-clamp-2 mb-3 font-medium">${p.description}</p>
                </div>

                <div class="mt-auto space-y-2">
                    <div class="w-full py-2.5 bg-slate-50 text-slate-900 text-[10px] rounded-xl font-black hover:bg-slate-100 transition-all border border-slate-200 text-center uppercase tracking-widest">
                        Technical Specs
                    </div>
                    <a href="contact.html" onclick="event.stopPropagation()" class="block w-full py-3 bg-blue-600 text-white text-[10px] rounded-xl font-black hover:bg-blue-700 transition-all text-center shadow-lg shadow-blue-600/20 uppercase tracking-widest">
                        Ask a Question
                    </a>
                </div>
            </div>
        </div>
    `}).join('');

    // Re-observe new elements
    if (window.observer) {
        container.querySelectorAll('.reveal').forEach(el => window.observer.observe(el));
    }
};

// Expanded Modal/Slider Logic
window.showProductDetails = async function (id) {
    const products = await window.getProducts();
    const p = products.find(prod => String(prod.id) === String(id));
    if (!p) return;

    const modal = document.getElementById('product-modal');
    const content = document.getElementById('modal-content');
    const images = Array.isArray(p.images) ? p.images : [p.image || ''];

    content.innerHTML = `
        <div class="flex flex-col lg:grid lg:grid-cols-2 gap-12">
            <!-- Modal Image Gallery -->
            <div class="space-y-4">
                <div class="rounded-3xl overflow-hidden bg-slate-50 aspect-square border-2 border-slate-100 relative group">
                    <div class="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide transition-all duration-500" id="modal-gallery">
                        ${images.map(img => `
                            <div class="flex-shrink-0 w-full h-full snap-center">
                                <img src="${img}" class="w-full h-full object-contain p-4" alt="${p.name}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Gallery Thumbnails -->
                <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    ${images.map((img, i) => `
                        <button onclick="document.getElementById('modal-gallery').scrollTo({left: document.getElementById('modal-gallery').offsetWidth * ${i}, behavior: 'smooth'})" 
                                class="w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-100 hover:border-blue-500 transition-all flex-shrink-0">
                            <img src="${img}" class="w-full h-full object-cover">
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="flex flex-col">
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Unit ID: ${p.id.toString().slice(-6)}</span>
                        <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">B.N.P Technical Stock</span>
                    </div>
                    <h2 class="text-3xl lg:text-4xl font-black text-slate-900 mb-4 leading-tight">${p.name}</h2>
                    <div class="h-1.5 w-16 bg-blue-600 rounded-full mb-8"></div>
                    
                    <div class="prose prose-slate max-w-none mb-10">
                        <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Product Briefing</h4>
                        <p class="text-slate-600 leading-relaxed font-medium text-lg italic">
                            "${p.description}"
                        </p>
                    </div>

                    <!-- Technical Specs Table -->
                    ${p.specs ? `
                        <div class="space-y-4">
                            <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Integrated Specifications</h4>
                            <div class="grid grid-cols-1 gap-1 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50">
                                ${Object.entries(p.specs).map(([label, value]) => `
                                    <div class="grid grid-cols-2 px-5 py-3 hover:bg-white transition-colors">
                                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${label}</span>
                                        <span class="text-xs font-bold text-slate-800">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="mt-auto pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <a href="contact.html" class="flex-grow flex items-center justify-center gap-3 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]">
                        <span>Transmit Inquiry</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                </div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
};

window.closeModal = function () {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
};

// Initial Setup
document.addEventListener('DOMContentLoaded', async () => {
    // Inject Custom Scrollbar Hide Style
    const style = document.createElement('style');
    style.textContent = `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .snap-x { scroll-snap-type: x mandatory; }
        .snap-center { scroll-snap-align: center; }
        
        /* Mobile Menu Animation */
        .mobile-menu-hidden {
            display: none;
            opacity: 0;
            transform: translateY(-10px);
        }
        .mobile-menu-active {
            display: block !important;
            animation: menuFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes menuFadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Inject Modal Structure
    const modalHTML = `
        <style>
            @keyframes modalZoom {
                from { opacity: 0; transform: scale(0.98) translateY(20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .animate-modal { animation: modalZoom 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        </style>
        <div id="product-modal" class="hidden fixed inset-0 z-[60] bg-slate-950/80 px-4 py-8 items-center justify-center backdrop-blur-md transition-all duration-500">
            <div class="bg-white w-full max-w-7xl max-h-[92vh] rounded-[3rem] shadow-2xl overflow-y-auto relative animate-modal border border-white/10">
                <button onclick="closeModal()" class="fixed lg:absolute top-6 right-6 lg:top-10 lg:right-10 p-4 bg-white/90 text-slate-900 hover:bg-red-50 hover:text-red-600 rounded-full transition-all z-[70] shadow-xl border border-slate-100 active:scale-90">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <div id="modal-content" class="p-8 lg:p-16"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalElement = document.getElementById('product-modal');
    if (modalElement) {
        modalElement.addEventListener('click', (e) => {
            if (e.target.id === 'product-modal') closeModal();
        });
    }

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        // Ensure menu starts in a clean state if JS is slow to load
        mobileMenu.classList.add('mobile-menu-hidden');
        
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = mobileMenu.classList.contains('mobile-menu-active');
            
            if (isExpanded) {
                // Close
                mobileMenu.classList.remove('mobile-menu-active');
                mobileMenu.classList.add('mobile-menu-hidden');
                mobileMenuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
            } else {
                // Open
                mobileMenu.classList.remove('mobile-menu-hidden');
                mobileMenu.classList.add('mobile-menu-active');
                mobileMenuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
            }
        });

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('mobile-menu-active');
                mobileMenu.classList.add('mobile-menu-hidden');
                mobileMenuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
            }
        });
    }

    if (document.getElementById('featured-products')) {
        const products = await window.getProducts();
        renderProducts(products, 'featured-products', 4);
    }
});
