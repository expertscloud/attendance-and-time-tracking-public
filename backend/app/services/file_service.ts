import drive from '@adonisjs/drive/services/main'
import { profileConfig } from '#config/services'

import File from '#models/file'
import { associatedTableEnums } from '#enums/associated_table_enum'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import { readFile } from 'node:fs/promises'
import mime from 'mime-types'

export const sanitizeName = async (inputFileName: string) => {
  return inputFileName
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .trim()
    .toLowerCase()
}

function profileBasePath(ownerUserId: number): string {
  return `users/${ownerUserId}/profile`
}

export type UploadUserProfileOptions = {
  ownerUserId: number
  uploadedByUserId: number
}

export async function deleteS3KeyIfExists(filePath: string | null | undefined) {
  if (!filePath) {
    return
  }
  const disk = drive.use()
  if (await disk.exists(filePath)) {
    await disk.delete(filePath)
  }
}

export async function uploadUserProfileAndCreateFile(
  file: MultipartFile,
  userId: number
): Promise<File> {
  const sanitizedFileName = await sanitizeName(file.clientName)
  const uniqueName = `${Date.now()}-${sanitizedFileName}`
  const s3BasePath = profileBasePath(userId)
  const s3FilePath = `${s3BasePath}/${uniqueName}`
  const fileMimeType = mime.lookup(file.clientName)

  const contentType = fileMimeType ? fileMimeType : `application/pdf`
  const disk = drive.use()
  const fileBuffer = await readFile(file.tmpPath!)

  await disk.put(s3FilePath, fileBuffer, {
    contentType,
  })

  return File.create({
    userId: userId,
    filePath: s3FilePath,
    fileOriginalName: sanitizedFileName,
    fileName: uniqueName,
    fileType: file.type ?? contentType,
    fileExt: file.extname ?? '',
    fileSize: file.size ?? fileBuffer.byteLength,
    associatedTable: associatedTableEnums.userDetails,
  })
}

export const getSignedUrlByFilePath = async (filePath: string | null) => {
  if (!filePath) return null
  const disk = drive.use()

  try {
    const signedUrl = await disk.getSignedUrl(filePath, {
      expiresIn: profileConfig.expiresIn,
    })
    return signedUrl ?? null
  } catch (error: any) {
    throw new Error(`Error generating signed URL: ${error.message}`)
  }
}
