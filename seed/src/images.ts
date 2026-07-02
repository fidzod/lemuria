import { extname } from "path"

const mimeType = (path: string): string => {
  const ext = extname(path).toLowerCase()
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg"
  if (ext === ".png") return "image/png"
  return "image/webp"
}

export const loadImage = async (path: string): Promise<File> => {
  const filename = path.split("/").pop()!
  return new File([await Bun.file(path).arrayBuffer()], filename, { type: mimeType(path) })
}
