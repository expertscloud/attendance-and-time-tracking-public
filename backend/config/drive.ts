import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'
import type { InferDriveDisks } from '@adonisjs/drive/types'

// Use explicit env credentials when set (local dev, Docker/MinIO). When absent,
// the AWS SDK default provider chain applies (IAM role, instance profile, etc.).
const accessKeyId = env.get('AWS_ACCESS_KEY_ID')
const secretAccessKey = env.get('AWS_SECRET_ACCESS_KEY')
const sessionToken = env.get('AWS_SESSION_TOKEN')
const s3Endpoint = env.get('AWS_ENDPOINT')

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    s3: services.s3({
      ...(accessKeyId && secretAccessKey
        ? {
            credentials: {
              accessKeyId,
              secretAccessKey,
              ...(sessionToken ? { sessionToken } : {}),
            },
          }
        : {}),
      region: env.get('AWS_REGION'),
      bucket: env.get('S3_BUCKET'),
      ...(s3Endpoint
        ? {
            endpoint: s3Endpoint,
            forcePathStyle: true,
          }
        : {}),
      visibility: 'private',
      supportsACL: false,
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
