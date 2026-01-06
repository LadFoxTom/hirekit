// Utility functions for safe CV data encoding/decoding
export const safeEncodeCVData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data)
    return btoa(unescape(encodeURIComponent(jsonString)))
  } catch (error) {
    console.error('Error encoding CV data:', error)
    // Fallback to the old method
    return encodeURIComponent(JSON.stringify(data))
  }
}

export const safeDecodeCVData = (encodedData: string): any => {
  try {
    const jsonString = decodeURIComponent(escape(atob(encodedData)))
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Error decoding CV data:', error)
    return null
  }
}

export const openCVPreview = (cvData: any) => {
  try {
    const encodedData = safeEncodeCVData(cvData)
    window.open(`/cv-preview?data=${encodedData}`, '_blank')
  } catch (error) {
    console.error('Error opening CV preview:', error)
    // Fallback to localStorage method
    localStorage.setItem('cvData', JSON.stringify(cvData))
    window.open('/cv-preview', '_blank')
  }
}
