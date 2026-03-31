import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

const APP_NAME = 'VulnScan Pro';
const COMPANY_NAME = 'VulnScan Pro Security';

const createPDFDocument = () => new jsPDF();

const primaryColor = [99, 102, 241];
const severityColors = {
    critical: [220, 38, 38],
    high: [249, 115, 22],
    medium: [245, 158, 11],
    low: [34, 197, 94],
    info: [59, 130, 246]
};

const addWatermark = (doc) => {
    try {
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({ opacity: 0.08 }));
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(60);
        doc.setFont('helvetica', 'bold');
        doc.text(APP_NAME, 105, 150, { angle: 45, align: 'center' });
        doc.restoreGraphicsState();
    } catch (e) {
        console.warn('Watermark not supported');
    }
};

const addHeader = (doc, pageNum = 1, totalPages = 1) => {
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 28, 'F');
    
    doc.setFillColor(255, 255, 255);
    doc.circle(17, 14, 8, 'F');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VS', 17, 16, { align: 'center' });
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(APP_NAME, 30, 14);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Vulnerability Scanner', 30, 21);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`Page ${pageNum} of ${totalPages}`, 200, 20, { align: 'right' });
};

const addFooter = (doc) => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(245, 245, 245);
        doc.rect(0, 282, 210, 15, 'F');
        
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text(`${COMPANY_NAME} - Confidential Report`, 14, 290);
        doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}`, 200, 290, { align: 'right' });
    }
};

const buildPDFContent = (doc, scan, vulnerabilities) => {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy HH:mm')}`, 14, 42);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Vulnerability Assessment Report', 14, 52);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('This report contains confidential security information. Do not distribute.', 14, 58);

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(14, 62, 196, 62);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Scan Information', 14, 72);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const scanInfo = [
        ['Target URL:', scan?.target_url || 'N/A'],
        ['Scan ID:', scan?.scan_id ? scan.scan_id.substring(0, 20) + '...' : 'N/A'],
        ['Status:', scan?.status?.toUpperCase() || 'N/A'],
        ['Scan Date:', scan?.created_at ? format(new Date(scan.created_at), 'MMM dd, yyyy HH:mm') : 'N/A'],
        ['Completed:', scan?.completed_at ? format(new Date(scan.completed_at), 'MMM dd, yyyy HH:mm') : 'N/A']
    ];

    let yPos = 80;
    scanInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 14, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 45, yPos);
        yPos += 7;
    });

    doc.setDrawColor(...primaryColor);
    doc.line(14, yPos + 2, 196, yPos + 2);
    yPos += 12;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 14, yPos);

    const severityCounts = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
    vulnerabilities.forEach(v => {
        if (severityCounts.hasOwnProperty(v.severity)) {
            severityCounts[v.severity]++;
        }
    });

    const totalVulnerabilities = vulnerabilities.length;
    
    yPos += 12;
    doc.setFillColor(250, 250, 252);
    doc.roundedRect(14, yPos - 5, 60, 35, 3, 3, 'F');
    
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(totalVulnerabilities.toString(), 44, yPos + 15, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Total', 44, yPos + 22, { align: 'center' });
    doc.text('Vulnerabilities', 44, yPos + 27, { align: 'center' });

    let xPos = 85;
    const severityLabels = ['critical', 'high', 'medium', 'low', 'info'];
    
    severityLabels.forEach(severity => {
        const count = severityCounts[severity];
        const [r, g, b] = severityColors[severity];
        
        doc.setFillColor(r, g, b);
        doc.roundedRect(xPos, yPos - 3, 22, 28, 3, 3, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(count.toString(), xPos + 11, yPos + 10, { align: 'center' });
        
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(severity.toUpperCase(), xPos + 11, yPos + 18, { align: 'center' });
        
        xPos += 26;
    });

    if (vulnerabilities.length > 0) {
        yPos += 42;
        doc.setDrawColor(...primaryColor);
        doc.line(14, yPos, 196, yPos);
        yPos += 10;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Vulnerability Details', 14, yPos);

        yPos += 10;
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(240, 240, 245);
        doc.roundedRect(14, yPos - 4, 182, 7, 2, 2, 'F');
        
        doc.setTextColor(80, 80, 80);
        doc.text('#', 17, yPos + 1);
        doc.text('SEVERITY', 25, yPos + 1);
        doc.text('TITLE', 55, yPos + 1);
        doc.text('TYPE', 135, yPos + 1);
        doc.text('OWASP', 170, yPos + 1);

        yPos += 8;
        doc.setFont('helvetica', 'normal');

        vulnerabilities.slice(0, 25).forEach((vuln, index) => {
            if (yPos > 265) {
                doc.addPage();
                yPos = 25;
            }
            
            const [r, g, b] = severityColors[vuln.severity] || [100, 100, 100];
            doc.setFillColor(r, g, b);
            doc.roundedRect(14, yPos - 3, 22, 6, 1, 1, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(6);
            doc.text((vuln.severity || 'N/A').toUpperCase(), 25, yPos + 1);
            
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            const title = (vuln.title || 'Unknown').substring(0, 40);
            doc.text(`${index + 1}. ${title}`, 40, yPos + 1);
            
            const type = (vuln.vulnerability_type || 'N/A').substring(0, 15);
            doc.setTextColor(80, 80, 80);
            doc.text(type, 135, yPos + 1);
            
            const owasp = (vuln.owasp_category || 'N/A').substring(0, 15);
            doc.text(owasp, 170, yPos + 1);
            
            doc.setTextColor(230, 230, 230);
            doc.line(14, yPos + 4, 196, yPos + 4);
            
            yPos += 7;
        });

        if (vulnerabilities.length > 25) {
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Showing 25 of ${vulnerabilities.length} vulnerabilities. See detailed section for more.`, 14, yPos + 5);
        }
    }

    doc.addPage();
    addHeader(doc, 2);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Detailed Vulnerability Analysis', 14, 40);

    let currentY = 50;

    vulnerabilities.forEach((vuln, index) => {
        if (currentY > 260) {
            doc.addPage();
            currentY = 35;
        }
        
        const severityColor = severityColors[vuln.severity] || [100, 100, 100];
        
        doc.setFillColor(...severityColor);
        doc.roundedRect(14, currentY, 3, 12, 1, 1, 'F');
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${(vuln.title || 'Unknown Vulnerability').substring(0, 65)}`, 22, currentY + 5);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...severityColor);
        doc.text(`[${(vuln.severity || 'N/A').toUpperCase()}]`, 22, currentY + 10);
        
        doc.setTextColor(100, 100, 100);
        doc.text(`Type: ${vuln.vulnerability_type || 'N/A'} | OWASP: ${vuln.owasp_category || 'N/A'}`, 65, currentY + 10);

        currentY += 16;
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        const description = vuln.description || 'No description available for this vulnerability.';
        const splitDesc = doc.splitTextToSize(description, 175);
        doc.text(splitDesc.slice(0, 5), 22, currentY + 5);
        currentY += 5 + Math.min(splitDesc.length, 5) * 4;

        if (vuln.evidence) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Evidence:', 22, currentY);
            currentY += 5;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.setFontSize(8);
            const evidence = doc.splitTextToSize(vuln.evidence.substring(0, 300), 170);
            doc.text(evidence.slice(0, 3), 22, currentY);
            currentY += 3 + Math.min(evidence.length, 3) * 4;
        }

        if (vuln.remediation) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 100, 0);
            doc.text('Recommendation:', 22, currentY);
            currentY += 5;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(40, 120, 40);
            doc.setFontSize(8);
            const remediation = doc.splitTextToSize(vuln.remediation.substring(0, 300), 170);
            doc.text(remediation.slice(0, 3), 22, currentY);
        }

        currentY += 15;
        doc.setDrawColor(230, 230, 230);
        doc.line(14, currentY, 196, currentY);
        currentY += 8;
    });
};

export const exportScanToPDF = (scan, vulnerabilities, withWatermark = true) => {
    const doc = createPDFDocument();
    
    buildPDFContent(doc, scan, vulnerabilities);
    
    const pageCount = doc.internal.getNumberOfPages();
    
    if (withWatermark) {
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            addWatermark(doc);
        }
    }
    
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        addHeader(doc, i, pageCount);
    }
    addFooter(doc);

    const filename = `${APP_NAME.toLowerCase().replace(' ', '-')}-report-${scan?.target_url?.replace(/[^a-zA-Z0-9]/g, '-') || 'scan'}-${format(new Date(), 'yyyy-MM-dd')}${withWatermark ? '-branded' : ''}.pdf`;
    doc.save(filename);
};

export const exportScanToPDFWithWatermark = (scan, vulnerabilities) => {
    return exportScanToPDF(scan, vulnerabilities, true);
};

export const exportScanToPDFWithoutWatermark = (scan, vulnerabilities) => {
    return exportScanToPDF(scan, vulnerabilities, false);
};

export default exportScanToPDF;
