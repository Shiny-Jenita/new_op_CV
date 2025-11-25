import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";


const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_REGION_NAME = process.env.AWS_REGION_NAME;


// Create an S3 client with the provided credentials
const s3Client = new S3Client({
  region: AWS_REGION_NAME,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Fetches the file from S3 using the provided key.
 */
export const fetchFileFromS3 = async (key: string): Promise<Buffer> => {
  try {
    // Fetch the file from S3
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME, // Use the predefined bucket name
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("No file content found in S3 response");
    }

    // Convert the response body (ReadableStream) to a Buffer
    const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    };

    return await streamToBuffer(response.Body as Readable);
  } catch (error) {
    console.error("Error fetching file from S3:", error);
    throw error;
  }
};


