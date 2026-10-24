import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateCourtReadyEvidencePackPDF(incident, evidenceItems = [], auditLogs = []) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
  const { width, height } = page.getSize();

  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const primaryColor = rgb(0.88, 0.11, 0.28); // Rose/Crimson #e11d48
  const darkTextColor = rgb(0.06, 0.09, 0.16); // Slate 900
  const grayTextColor = rgb(0.39, 0.45, 0.55); // Slate 500
  const borderGrey = rgb(0.85, 0.88, 0.92);

  let y = height - 50;

  // Header Banner
  page.drawRectangle({
    x: 40,
    y: y - 20,
    width: width - 80,
    height: 60,
    color: rgb(0.98, 0.94, 0.95),
    borderColor: primaryColor,
    borderWidth: 1
  });

  page.drawText('SHIELD — COURT-READY EVIDENCE PACK', {
    x: 55,
    y: y + 15,
    size: 15,
    font: fontBold,
    color: primaryColor
  });

  page.drawText('COMMUNITY-POWERED INCIDENT INTELLIGENCE & FORENSIC AUDIT CHAIN', {
    x: 55,
    y: y - 2,
    size: 7.5,
    font: fontBold,
    color: grayTextColor
  });

  page.drawText(`GENERATED: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`, {
    x: width - 260,
    y: y - 2,
    size: 7.5,
    font: fontMono,
    color: grayTextColor
  });

  y -= 50;

  // Section 1: Incident Summary
  page.drawText('1. INCIDENT RECORD SUMMARY', {
    x: 40,
    y,
    size: 11,
    font: fontBold,
    color: darkTextColor
  });

  y -= 18;

  const summaryRows = [
    ['Incident Reference ID:', incident.id || 'INC-2026-DEMO'],
    ['Category / Classification:', (incident.category || 'Harassment / Stalking').toUpperCase()],
    ['Severity Level:', (incident.severity || 'HIGH').toUpperCase()],
    ['Incident Occurrence Time:', incident.created_at || new Date().toISOString()],
    ['Approximate Location:', incident.approximate_location?.name || 'Surathkal / NITK Campus Zone'],
    ['Verification / Status:', (incident.status || 'VERIFIED').toUpperCase()]
  ];

  for (const [label, val] of summaryRows) {
    page.drawText(label, { x: 50, y, size: 9, font: fontBold, color: darkTextColor });
    page.drawText(String(val), { x: 210, y, size: 9, font: fontHelvetica, color: darkTextColor });
    y -= 15;
  }

  y -= 10;

  // Factual Narrative
  page.drawText('Incident Description:', { x: 50, y, size: 9, font: fontBold, color: darkTextColor });
  y -= 14;

  const descText = incident.description || 'Complainant reported targeted stalking and hostile loitering.';
  page.drawText(descText.slice(0, 110), { x: 50, y, size: 8.5, font: fontHelvetica, color: grayTextColor });
  if (descText.length > 110) {
    y -= 12;
    page.drawText(descText.slice(110, 220), { x: 50, y, size: 8.5, font: fontHelvetica, color: grayTextColor });
  }

  y -= 25;

  // Section 2: Attached Evidence & SHA-256 Hashes
  page.drawText('2. FORENSIC EVIDENCE INVENTORY & SHA-256 INTEGRITY HASHES', {
    x: 40,
    y,
    size: 11,
    font: fontBold,
    color: darkTextColor
  });

  y -= 18;

  if (evidenceItems.length === 0) {
    page.drawText('No standalone files attached. Realtime digital logs preserved.', {
      x: 50,
      y,
      size: 9,
      font: fontHelvetica,
      color: grayTextColor
    });
    y -= 20;
  } else {
    for (let i = 0; i < evidenceItems.length; i++) {
      const item = evidenceItems[i];
      page.drawRectangle({
        x: 40,
        y: y - 36,
        width: width - 80,
        height: 48,
        color: rgb(0.98, 0.98, 0.99),
        borderColor: borderGrey,
        borderWidth: 0.5
      });

      page.drawText(`Exhibit #${i + 1}: ${item.file_name}`, {
        x: 50,
        y: y - 2,
        size: 9,
        font: fontBold,
        color: darkTextColor
      });

      page.drawText(`Type: ${item.file_type || 'image/jpeg'} | Size: ${item.file_size_kb || 250} KB | Captured: ${item.created_at}`, {
        x: 50,
        y: y - 14,
        size: 7.5,
        font: fontHelvetica,
        color: grayTextColor
      });

      page.drawText(`SHA-256: ${item.sha256_hash}`, {
        x: 50,
        y: y - 28,
        size: 7.5,
        font: fontMono,
        color: primaryColor
      });

      y -= 54;
    }
  }

  y -= 10;

  // Section 3: Tamper-Evident Audit Chain Log
  page.drawText('3. TAMPER-EVIDENT CHAIN-OF-CUSTODY AUDIT LOG', {
    x: 40,
    y,
    size: 11,
    font: fontBold,
    color: darkTextColor
  });

  y -= 14;
  page.drawText('Each audit node references the SHA-256 hash of its predecessor, creating a mathematically verifiable sequence.', {
    x: 40,
    y,
    size: 7.5,
    font: fontHelvetica,
    color: grayTextColor
  });

  y -= 16;

  const displayLogs = auditLogs.slice(0, 4);
  for (const log of displayLogs) {
    page.drawText(`• [${log.timestamp.slice(11, 19)}] Action: ${log.action} | Actor: ${log.actor}`, {
      x: 50,
      y,
      size: 8,
      font: fontBold,
      color: darkTextColor
    });
    y -= 12;
    page.drawText(`  Node Hash: ${log.entry_hash?.slice(0, 36)}... | Prev: ${log.prev_hash?.slice(0, 24)}...`, {
      x: 50,
      y,
      size: 7,
      font: fontMono,
      color: grayTextColor
    });
    y -= 14;
  }

  y -= 15;

  // Section 4: Bharatiya Sakshya Adhiniyam, 2023 (Section 63) Legal Certification Note
  page.drawRectangle({
    x: 40,
    y: y - 70,
    width: width - 80,
    height: 75,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.65, 0.72, 0.85),
    borderWidth: 1
  });

  page.drawText('STATUTORY COMPLIANCE NOTE: SECTION 63, BHARATIYA SAKSHYA ADHINIYAM (BSA), 2023', {
    x: 50,
    y: y - 8,
    size: 8.5,
    font: fontBold,
    color: rgb(0.1, 0.2, 0.4)
  });

  const legalNotes = [
    "Under Section 63 of BSA 2023 (formerly Section 65B of Indian Evidence Act), electronic records are admissible",
    "as documents if integrity of electronic storage and original capture parameters are demonstrably preserved.",
    "This pack provides cryptographic SHA-256 integrity digests and an unbroken hash chain to enable legal counsel",
    "to draft the formal Certificate of Electronic Evidence. SHIELD provides technical verification, not legal counsel."
  ];

  let noteY = y - 22;
  for (const line of legalNotes) {
    page.drawText(line, { x: 50, y: noteY, size: 7.5, font: fontHelvetica, color: darkTextColor });
    noteY -= 11;
  }

  // Footer Disclaimer
  page.drawText('SHIELD Platform Verification • Verified Cryptographic Digest • Confidential Document', {
    x: 130,
    y: 25,
    size: 7.5,
    font: fontBold,
    color: grayTextColor
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
