import { createNextRouteHandler } from "uploadthing/next"
import { uploadRouter } from "./core"

// Force dynamic rendering since this route handles file uploads
export const dynamic = 'force-dynamic'

export const { GET, POST } = createNextRouteHandler({
  router: uploadRouter,
}) 