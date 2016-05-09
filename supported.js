module.exports = (
  'Worker' in window &&
  'URL' in window && URL.createObjectURL &&
  'Blob' in window
)
