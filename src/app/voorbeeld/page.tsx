import { redirect } from 'next/navigation'

// Redirect /voorbeeld to /voorbeeld/cv
export default function VoorbeeldPage() {
  redirect('/voorbeeld/cv')
}
