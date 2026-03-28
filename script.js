document.addEventListener('DOMContentLoaded', () => {

    const inventoryData = [
        { id: 'item-laptop', name: 'Laptop 15"', type: 'electronics', size: 10, src: 'icons/laptop.svg' },
        { id: 'item-book', name: 'Textbook', type: 'book', size: 5, src: 'icons/book.svg' },
        { id: 'item-firstaid', name: 'First Aid', type: 'health', size: 4, src: 'icons/firstaid.svg' },
        { id: 'item-bottle', name: 'Water Bottle', type: 'bottle', size: 3, src: 'icons/bottle.svg' },
        { id: 'item-umbrella', name: 'Umbrella', type: 'umbrella', size: 3, src: 'icons/umbrella.svg' },
        { id: 'item-powerbank', name: 'Power Bank', type: 'electronics', size: 3, src: 'icons/powerbank.svg' },
        { id: 'item-headphones', name: 'Headphones', type: 'electronics', size: 3, src: 'icons/headphones.svg' },
        { id: 'item-wallet', name: 'Wallet', type: 'accessory', size: 2, src: 'icons/wallet.svg' },
        { id: 'item-smartphone', name: 'Phone', type: 'electronics', size: 2, src: 'icons/smartphone.svg' },
        { id: 'item-flashlight', name: 'Flashlight', type: 'tool', size: 2, src: 'icons/flashlight.svg' },
        { id: 'item-sunglasses', name: 'Sunglasses', type: 'accessory', size: 2, src: 'icons/sunglasses.svg' },
        { id: 'item-watch', name: 'Watch', type: 'accessory', size: 1, src: 'icons/watch.svg' },
        { id: 'item-keys', name: 'Keys', type: 'accessory', size: 1, src: 'icons/keys.svg' },
        { id: 'item-pen', name: 'Pen', type: 'accessory', size: 1, src: 'icons/pen.svg' },
        { id: 'item-knife', name: 'Knife', type: 'tool', size: 1, src: 'icons/knife.svg' }
    ];

    const inventoryArea = document.querySelector('.base-inventory');
    
    // Initialize Inventory HTML dynamically
    inventoryData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'draggable-item';
        div.draggable = true;
        div.id = item.id;
        div.dataset.size = item.size;
        div.dataset.type = item.type;
        
        div.innerHTML = `
            <div class="icon-img"><img src="${item.src}" alt="${item.name}" onerror="this.style.display='none'"></div>
            <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-size-badge">Size: ${item.size} | Type: ${item.type}</span>
            </div>
        `;
        inventoryArea.appendChild(div);
    });

    const baseItems = document.querySelectorAll('.draggable-item');
    baseItems.forEach(initDraggable);

    // Initial Inventory config
    // Inventory is infinite capacity, accepts all types
    const inventoryZone = document.getElementById('inventory-zone');
    inventoryZone.dataset.maxSize = 'Infinity';
    inventoryZone.dataset.allowedType = 'all';
    initDropZone(inventoryZone);

    // Auto-scroll logic while dragging
    let scrollInterval = null;
    
    document.addEventListener('dragover', (e) => {
        const threshold = 100; // pixels from the edge to trigger scroll
        const scrollAmount = 15; // scroll speed
        
        // Scroll Up
        if (e.clientY < threshold) {
            if (!scrollInterval) {
                scrollInterval = setInterval(() => window.scrollBy(0, -scrollAmount), 20);
            }
        // Scroll Down
        } else if (window.innerHeight - e.clientY < threshold) {
            if (!scrollInterval) {
                scrollInterval = setInterval(() => window.scrollBy(0, scrollAmount), 20);
            }
        } else {
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
        }
    });

    document.addEventListener('dragend', () => {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    });

    // Configurator logic
    const typeRadios = document.querySelectorAll('input[name="bp-type"]');
    const typeLabel = document.getElementById('bp-type-label');
    const addPocketBtn = document.getElementById('add-pocket-btn');
    const pocketTypeSelect = document.getElementById('pocket-type');
    const bpContainer = document.getElementById('backpack-pockets');
    const resetBtn = document.getElementById('reset-bp-btn');
    const emptyState = document.querySelector('.empty-state');

    typeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) typeLabel.textContent = e.target.value;
        });
    });

    addPocketBtn.addEventListener('click', () => {
        if (emptyState) emptyState.style.display = 'none';
        
        const type = pocketTypeSelect.value;
        const pocketDiv = document.createElement('div');
        pocketDiv.classList.add('compartment');

        let innerHTML = '';
        
        switch(type) {
            case 'small':
                pocketDiv.classList.add('comp-small', 'drop-zone');
                pocketDiv.dataset.maxSize = '6';
                pocketDiv.dataset.allowedType = 'all';
                innerHTML = `
                    <div class="compartment-header">
                        <h3>Small Pocket</h3>
                        <span class="capacity">Size: 6</span>
                    </div>
                    <div class="drop-area"></div>
                    <div class="usage-meter"><div class="usage-fill" style="width: 0%"></div></div>
                `;
                break;
            case 'main-2':
                pocketDiv.classList.add('comp-main');
                innerHTML = `
                    <div class="compartment-header">
                        <h3>Main Compartment (Dual)</h3>
                        <span class="capacity">Size: 15 per zone</span>
                    </div>
                    <div class="main-multi-zone">
                        <div class="sub-drop-zone drop-zone" data-max-size="15" data-allowed-type="all">
                            <span class="sub-zone-label">Zone 1</span>
                            <div class="drop-area"></div>
                            <div class="usage-meter"><div class="usage-fill" style="width: 0%"></div></div>
                        </div>
                        <div class="sub-drop-zone drop-zone" data-max-size="15" data-allowed-type="all">
                            <span class="sub-zone-label">Zone 2</span>
                            <div class="drop-area"></div>
                            <div class="usage-meter"><div class="usage-fill" style="width: 0%"></div></div>
                        </div>
                    </div>
                `;
                break;
            case 'main-3':
                pocketDiv.classList.add('comp-main');
                innerHTML = `
                    <div class="compartment-header">
                        <h3>Main Compartment (Triple)</h3>
                        <span class="capacity">Size: 10 per zone</span>
                    </div>
                    <div class="main-multi-zone">
                        <div class="sub-drop-zone drop-zone" data-max-size="10" data-allowed-type="all">
                            <span class="sub-zone-label">Zone A</span>
                            <div class="drop-area"></div>
                            <div class="usage-meter"><div class="usage-fill" style="width: 0%"></div></div>
                        </div>
                        <div class="sub-drop-zone drop-zone" data-max-size="10" data-allowed-type="all">
                            <span class="sub-zone-label">Zone B</span>
                            <div class="drop-area"></div>
                            <div class="usage-meter"><div class="usage-fill" style="width: 0%"></div></div>
                        </div>
                        <div class="sub-drop-zone drop-zone" data-max-size="10" data-allowed-type="all">
                            <span class="sub-zone-label">Zone C</span>
                            <div class="drop-area"></div>
                            <div class="usage-meter"><div class="usage-fill" style="width: 0%"></div></div>
                        </div>
                    </div>
                `;
                break;
            case 'bottle':
                pocketDiv.classList.add('comp-bottle', 'drop-zone');
                pocketDiv.dataset.maxSize = 'Infinity';
                pocketDiv.dataset.allowedType = 'bottle';
                innerHTML = `
                    <div class="compartment-header">
                        <h3>Bottle Holder</h3>
                        <span class="capacity">Only for a bottle!</span>
                    </div>
                    <div class="drop-area"></div>
                `;
                break;
            case 'umbrella':
                pocketDiv.classList.add('comp-umbrella', 'drop-zone');
                pocketDiv.dataset.maxSize = 'Infinity';
                pocketDiv.dataset.allowedType = 'umbrella';
                innerHTML = `
                    <div class="compartment-header">
                        <h3>Umbrella Sleeve</h3>
                        <span class="capacity">Umbrella only!</span>
                    </div>
                    <div class="drop-area"></div>
                `;
                break;
        }

        pocketDiv.innerHTML = innerHTML;
        bpContainer.appendChild(pocketDiv);

        if (pocketDiv.classList.contains('drop-zone')) {
            initDropZone(pocketDiv);
            updateMeter(pocketDiv);
        } else {
            const subs = pocketDiv.querySelectorAll('.drop-zone');
            subs.forEach(z => { initDropZone(z); updateMeter(z); });
        }
    });

    resetBtn.addEventListener('click', () => {
        const allItemsInPack = bpContainer.querySelectorAll('.draggable-item');
        allItemsInPack.forEach(item => {
            inventoryArea.appendChild(item);
        });

        bpContainer.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
            bpContainer.appendChild(emptyState);
        }
    });

    function initDraggable(element) {
        element.addEventListener('dragstart', (e) => {
            element.classList.add('dragging');
            // Store properties to dataTransfer so drop zones can read before drop
            e.dataTransfer.setData('text/plain', element.id);
            setTimeout(() => { element.style.opacity = '0.5'; }, 0);
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
            element.style.opacity = '1';
        });
    }

    function canAcceptItem(zone, item) {
        if (!item) return false;
        
        const allowedType = zone.dataset.allowedType || 'all';
        const itemType = item.dataset.type;
        
        // Check Type
        if (allowedType !== 'all' && allowedType !== itemType) {
            return false;
        }

        // Check Size Capacity
        const maxSize = zone.dataset.maxSize === 'Infinity' ? Infinity : parseInt(zone.dataset.maxSize || 0);
        const itemSize = parseInt(item.dataset.size || 0);
        
        if (maxSize === Infinity) return true;

        // Calculate current contents size (EXCLUDING the item being dragged if it's already in the zone)
        let currentSize = 0;
        const currentItems = zone.querySelectorAll('.draggable-item');
        currentItems.forEach(child => {
            if (child.id !== item.id) {
                currentSize += parseInt(child.dataset.size || 0);
            }
        });

        if (currentSize + itemSize > maxSize) {
            return false;
        }

        return true;
    }

    function getDropZoneFillPercentage(zone) {
        const maxSize = zone.dataset.maxSize === 'Infinity' ? Infinity : parseInt(zone.dataset.maxSize || 0);
        if (maxSize === Infinity || maxSize === 0) return 0;
        
        let currentSize = 0;
        const currentItems = zone.querySelectorAll('.draggable-item');
        currentItems.forEach(child => {
            currentSize += parseInt(child.dataset.size || 0);
        });
        
        return Math.min(100, Math.round((currentSize / maxSize) * 100));
    }

    function updateMeter(zone) {
        const meterFill = zone.querySelector('.usage-fill');
        if (meterFill) {
            const fillPct = getDropZoneFillPercentage(zone);
            meterFill.style.width = fillPct + '%';
            
            if (fillPct >= 100) {
                meterFill.style.background = 'var(--danger-color)';
            } else if (fillPct >= 75) {
                meterFill.style.background = '#f59e0b'; // warning orange
            } else {
                meterFill.style.background = 'var(--accent-color)';
            }
        }
    }

    function initDropZone(zone) {
        zone.addEventListener('dragover', e => {
            const draggable = document.querySelector('.dragging');
            if (canAcceptItem(zone, draggable)) {
                e.preventDefault();
                zone.classList.add('drag-over');
                zone.classList.remove('drag-deny');
                
                const targetContainer = zone.querySelector('.drop-area') || zone;
                const afterElement = getDragAfterElement(zone, e.clientY);
                
                if (afterElement == null) {
                    targetContainer.appendChild(draggable);
                } else {
                    targetContainer.insertBefore(draggable, afterElement);
                }
            } else {
                zone.classList.add('drag-deny');
                zone.classList.remove('drag-over');
            }
        });

        zone.addEventListener('dragenter', e => {
            const draggable = document.querySelector('.dragging');
            if (canAcceptItem(zone, draggable)) {
                e.preventDefault();
                zone.classList.add('drag-over');
                zone.classList.remove('drag-deny');
            } else {
                zone.classList.add('drag-deny');
                zone.classList.remove('drag-over');
            }
        });

        zone.addEventListener('dragleave', e => {
            zone.classList.remove('drag-over');
            zone.classList.remove('drag-deny');
        });

        zone.addEventListener('drop', e => {
            const draggable = document.querySelector('.dragging');
            if (canAcceptItem(zone, draggable)) {
                e.preventDefault();
                zone.classList.remove('drag-over');
                zone.classList.remove('drag-deny');
                
                draggable.animate([
                    { transform: 'scale(0.95)' },
                    { transform: 'scale(1.05)' },
                    { transform: 'scale(1)' }
                ], { duration: 300, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });

                updateMeter(zone);
                
                // Also update the zone it left (but we don't directly know it here without querying all zones, so let's update all meters)
                document.querySelectorAll('.drop-zone').forEach(updateMeter);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const targetContainer = container.querySelector('.drop-area') || container;
        const draggableElements = [...targetContainer.querySelectorAll('.draggable-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
