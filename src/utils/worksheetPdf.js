import dompdf from 'dompdf.js'

export async function downloadWorksheetPDF(el, filename) {
  if (!el) return

  const pageEls = el.querySelectorAll('[data-page]')
  if (pageEls.length > 1) {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    for (let i = 0; i < pageEls.length; i++) {
      if (i > 0) doc.addPage()
      const blob = await dompdf(pageEls[i], { format: 'a4', backgroundColor: '#ffffff', compress: true })
      const ab = await blob.arrayBuffer()
      const bytes = new Uint8Array(ab)
      let binary = ''
      for (let j = 0; j < bytes.length; j++) binary += String.fromCharCode(bytes[j])
      const dataUrl = 'data:application/pdf;base64,' + btoa(binary)
      doc.addImage(dataUrl, 'PDF', 0, 0, 210, 297)
    }
    const outBlob = doc.output('blob')
    const url = URL.createObjectURL(outBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } else {
    const blob = await dompdf(el, {
      pagination: true,
      format: 'a4',
      backgroundColor: '#ffffff',
      compress: true
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
