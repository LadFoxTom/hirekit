import { redirect } from 'next/navigation'

// Redirect /examples to /examples/cv
export default function ExamplesPage() {
  redirect('/examples/cv')
}
