import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { FileUploadService } from "./db"

const f = createUploadthing()

export const uploadRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save file info to database
      await FileUploadService.createFileUpload(
        metadata.userId,
        file.name,
        file.url,
        file.size,
        file.type
      )
    }),

  cvDocument: f({ pdf: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save file info to database
      await FileUploadService.createFileUpload(
        metadata.userId,
        file.name,
        file.url,
        file.size,
        file.type
      )
    }),

  templatePreview: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save template preview image
      await FileUploadService.createFileUpload(
        metadata.userId,
        file.name,
        file.url,
        file.size,
        file.type
      )
    }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter 