const mmToPx = mm => mm * 3.779; // conversao para 96 DPI

// salva e carrega configuracoes do localStorage
function saveConfig(config) {
    localStorage.setItem('mioloConfig', JSON.stringify(config));
}
function loadConfig() {
    const c = localStorage.getItem('mioloConfig');
    return c ? JSON.parse(c) : null;
}

class Ruling {
    draw(svg, opts) {}
}

class HorizontalRuling extends Ruling {
    constructor(spacing) {
        super();
        this.spacing = spacing;
    }
    draw(svg, opts) {
        const {width, height, margin} = opts;
        for (let y = margin.top; y <= height - margin.bottom; y += this.spacing) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', margin.left);
            line.setAttribute('x2', width - margin.right);
            line.setAttribute('y1', y);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'var(--line-color)');
            line.setAttribute('stroke-width', '1');
            svg.appendChild(line);
        }
    }
}

class GridRuling extends Ruling {
    constructor(size) { super(); this.size = size; }
    draw(svg, opts) {
        const {width, height, margin} = opts;
        for (let x = margin.left; x <= width - margin.right; x += this.size) {
            const v = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            v.setAttribute('x1', x); v.setAttribute('x2', x);
            v.setAttribute('y1', margin.top); v.setAttribute('y2', height - margin.bottom);
            v.setAttribute('stroke', 'var(--line-color)');
            v.setAttribute('stroke-width', '1');
            svg.appendChild(v);
        }
        for (let y = margin.top; y <= height - margin.bottom; y += this.size) {
            const h = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            h.setAttribute('x1', margin.left); h.setAttribute('x2', width - margin.right);
            h.setAttribute('y1', y); h.setAttribute('y2', y);
            h.setAttribute('stroke', 'var(--line-color)');
            h.setAttribute('stroke-width', '1');
            svg.appendChild(h);
        }
    }
}

class DotRuling extends Ruling {
    constructor(size) { super(); this.size = size; }
    draw(svg, opts) {
        const {width, height, margin} = opts;
        for (let x = margin.left; x <= width - margin.right; x += this.size) {
            for (let y = margin.top; y <= height - margin.bottom; y += this.size) {
                const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                c.setAttribute('cx', x); c.setAttribute('cy', y);
                c.setAttribute('r', 1);
                c.setAttribute('fill', 'var(--line-color)');
                svg.appendChild(c);
            }
        }
    }
}

class SeyesRuling extends Ruling {
    constructor() { super(); }
    draw(svg, opts) {
        const {width, height, margin} = opts;
        const major = 8, minor = 2;
        for (let y = margin.top; y <= height - margin.bottom; y += minor) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', margin.left);
            line.setAttribute('x2', width - margin.right);
            line.setAttribute('y1', y);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'var(--line-color)');
            line.setAttribute('stroke-width', y % major === 0 ? '1' : '0.5');
            svg.appendChild(line);
        }
        for (let x = margin.left; x <= width - margin.right; x += major) {
            const v = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            v.setAttribute('x1', x);
            v.setAttribute('x2', x);
            v.setAttribute('y1', margin.top);
            v.setAttribute('y2', height - margin.bottom);
            v.setAttribute('stroke', 'var(--line-color)');
            v.setAttribute('stroke-width', '1');
            svg.appendChild(v);
        }
    }
}

// Representacoes simplificadas para isometrico e hexagonal
class IsoRuling extends Ruling {
    constructor(size) { super(); this.size = size; }
    draw(svg, opts) {
        const {width, height, margin} = opts;
        const s = this.size;
        for (let y = margin.top - height; y < height; y += s) {
            const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line1.setAttribute('x1', margin.left);
            line1.setAttribute('y1', y + margin.top);
            line1.setAttribute('x2', width - margin.right);
            line1.setAttribute('y2', y + height);
            line1.setAttribute('stroke', 'var(--line-color)');
            line1.setAttribute('stroke-width', '0.5');
            svg.appendChild(line1);
            const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line2.setAttribute('x1', margin.left);
            line2.setAttribute('y1', y + height);
            line2.setAttribute('x2', width - margin.right);
            line2.setAttribute('y2', y + margin.top);
            line2.setAttribute('stroke', 'var(--line-color)');
            line2.setAttribute('stroke-width', '0.5');
            svg.appendChild(line2);
        }
    }
}

class HexRuling extends Ruling {
    constructor(size) { super(); this.size = size; }
    draw(svg, opts) {
        const {width, height, margin} = opts;
        const s = this.size;
        const h = Math.sin(Math.PI/3) * s;
        for (let y = margin.top; y <= height - margin.bottom + h; y += h) {
            for (let x = margin.left; x <= width - margin.right + s; x += 1.5 * s) {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const p = [
                    [x, y],
                    [x + s/2, y - h],
                    [x + 1.5*s, y - h],
                    [x + 2*s, y],
                    [x + 1.5*s, y + h],
                    [x + s/2, y + h],
                    [x, y]
                ].map(pt => pt.join(',')).join(' ');
                path.setAttribute('d', 'M' + p);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke', 'var(--line-color)');
                path.setAttribute('stroke-width', '0.5');
                svg.appendChild(path);
            }
        }
    }
}

function getRuling(type, spacing) {
    switch(type) {
        case 'wide': return new HorizontalRuling(spacing || 8);
        case 'college': return new HorizontalRuling(spacing || 7);
        case 'narrow': return new HorizontalRuling(spacing || 6);
        case 'calligraphy': return new HorizontalRuling(spacing || 8);
        case 'grid': return new GridRuling(5);
        case 'dot': return new DotRuling(5);
        case 'seyes': return new SeyesRuling();
        case 'iso': return new IsoRuling(10);
        case 'hex': return new HexRuling(5);
        default: return new Ruling();
    }
}

function updateVisibility() {
    headerFields.style.display = headerToggle.checked ? 'block' : 'none';
    lineSpacingDiv.style.display = ['wide','college','narrow','calligraphy'].includes(ruling.value) ? 'block' : 'none';
    customSize.style.display = pageSize.value === 'custom' ? 'block' : 'none';
}

function renderPreview() {
    const widthMM = pageSize.value === 'A4' ? 210 : pageSize.value === 'Letter' ? 216 : parseFloat(width.value);
    const heightMM = pageSize.value === 'A4' ? 297 : pageSize.value === 'Letter' ? 279 : parseFloat(height.value);
    const widthPx = mmToPx(widthMM);
    const heightPx = mmToPx(heightMM);
    preview.setAttribute('viewBox', `0 0 ${widthPx} ${heightPx}`);
    preview.innerHTML = '';
    const margin = {
        top: mmToPx(parseFloat(marginTop.value)),
        right: mmToPx(parseFloat(marginRight.value)),
        bottom: mmToPx(parseFloat(marginBottom.value)),
        left: mmToPx(parseFloat(marginLeft.value))
    };
    const options = {width: widthPx, height: heightPx, margin};
    const spacing = parseFloat(lineSpacing.value);
    const rule = getRuling(ruling.value, spacing);
    rule.draw(preview, options);
    if (bgImage.src) {
        const img = document.createElementNS('http://www.w3.org/2000/svg','image');
        img.setAttribute('href', bgImage.src);
        img.setAttribute('x','0');
        img.setAttribute('y','0');
        img.setAttribute('width', widthPx);
        img.setAttribute('height', heightPx);
        img.setAttribute('opacity','0.05');
        preview.appendChild(img);
    }
    if (headerToggle.checked) {
        const text = document.createElementNS('http://www.w3.org/2000/svg','text');
        text.textContent = title.value || '';
        text.setAttribute('x', margin.left);
        text.setAttribute('y', margin.top - 5);
        text.setAttribute('font-size','12');
        text.setAttribute('dominant-baseline','text-before-edge');
        preview.appendChild(text);
        if (autoDate.checked) {
            const dt = document.createElementNS('http://www.w3.org/2000/svg','text');
            dt.textContent = new Date().toLocaleDateString('pt-BR');
            dt.setAttribute('x', widthPx - margin.right);
            dt.setAttribute('y', margin.top - 5);
            dt.setAttribute('font-size','12');
            dt.setAttribute('text-anchor','end');
            dt.setAttribute('dominant-baseline','text-before-edge');
            preview.appendChild(dt);
        }
    }
    if (logo.src) {
        const img = document.createElementNS('http://www.w3.org/2000/svg','image');
        img.setAttribute('href', logo.src);
        img.setAttribute('width', 50);
        img.setAttribute('height', 50);
        let x = margin.left, y = margin.top;
        if (logoPos.value.includes('right')) x = widthPx - margin.right - 50;
        if (logoPos.value.includes('bottom')) y = heightPx - margin.bottom - 50;
        if (logoPos.value.startsWith('mid')) y = heightPx/2 - 25;
        if (logoPos.value.endsWith('mid')) x = widthPx/2 - 25;
        img.setAttribute('x', x);
        img.setAttribute('y', y);
        preview.appendChild(img);
    }
    saveConfig(getConfig());
}

function getConfig() {
    return {
        ruling: ruling.value,
        header: headerToggle.checked,
        title: title.value,
        autoDate: autoDate.checked,
        pageSize: pageSize.value,
        width: width.value,
        height: height.value,
        marginLeft: marginLeft.value,
        marginRight: marginRight.value,
        marginTop: marginTop.value,
        marginBottom: marginBottom.value,
        numPages: numPages.value,
        logoPos: logoPos.value,
        lineSpacing: lineSpacing.value,
        duplicate: duplicateFlag
    };
}

function applyConfig(c) {
    if(!c) return;
    ruling.value = c.ruling;
    headerToggle.checked = c.header;
    title.value = c.title;
    autoDate.checked = c.autoDate;
    pageSize.value = c.pageSize;
    width.value = c.width;
    height.value = c.height;
    marginLeft.value = c.marginLeft;
    marginRight.value = c.marginRight;
    marginTop.value = c.marginTop;
    marginBottom.value = c.marginBottom;
    numPages.value = c.numPages;
    logoPos.value = c.logoPos;
    lineSpacing.value = c.lineSpacing;
    duplicateFlag = c.duplicate || false;
    duplicate.textContent = duplicateFlag ? 'Duplicacao Ativa' : 'Duplicar Configuracoes';
    updateVisibility();
}

function handleImage(input, target) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => { target.src = e.target.result; renderPreview(); };
        reader.readAsDataURL(input.files[0]);
    } else {
        target.src = '';
        renderPreview();
    }
}

function exportPDF() {
    const {jsPDF} = window.jspdf;
    const pdf = new jsPDF({unit:'pt', format:'a4'});
    const widthMM = pageSize.value === 'A4' ? 210 : pageSize.value === 'Letter' ? 216 : parseFloat(width.value);
    const heightMM = pageSize.value === 'A4' ? 297 : pageSize.value === 'Letter' ? 279 : parseFloat(height.value);
    const widthPx = mmToPx(widthMM);
    const heightPx = mmToPx(heightMM);
    const num = parseInt(numPages.value,10);
    const total = duplicateFlag ? num * 2 : num;
    const tasks = [];
    for (let i=0;i<total;i++) {
        tasks.push(html2canvas(preview, {scale:3}).then(canvas => {
            const img = canvas.toDataURL('image/png');
            if(i>0) pdf.addPage([mmToPx(widthMM)/3.779*72, mmToPx(heightMM)/3.779*72]);
            pdf.addImage(img, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        }));
    }
    Promise.all(tasks).then(()=>{
        const ts = Date.now();
        pdf.save(`miolo-${ruling.value}-${ts}.pdf`);
    });
}

let duplicateFlag = false;

document.addEventListener('DOMContentLoaded', () => {
    const cfg = loadConfig();
    applyConfig(cfg);
    renderPreview();
    [...document.querySelectorAll('#controls input, #controls select')].forEach(el => {
        el.addEventListener('change', () => { updateVisibility(); renderPreview(); });
    });
    bgImage.addEventListener('change', () => handleImage(bgImage, bgImage));
    logo.addEventListener('change', () => handleImage(logo, logo));
    export.addEventListener('click', exportPDF);
    duplicate.addEventListener('click', () => {
        duplicateFlag = !duplicateFlag;
        duplicate.textContent = duplicateFlag ? 'Duplicacao Ativa' : 'Duplicar Configuracoes';
    });
    document.addEventListener('keydown', e => { if(e.ctrlKey && e.key==='p'){ e.preventDefault(); exportPDF(); }});
});
