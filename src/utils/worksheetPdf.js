import dompdf from 'dompdf.js'

export async function downloadWorksheetPDF(el, filename) {
  if (!el) return
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
