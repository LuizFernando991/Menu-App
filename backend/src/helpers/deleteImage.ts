import { join } from 'path'
import * as fs from 'fs'

export const removeImageFromStorage = (imagePath: string) => {
  fs.unlink(join(__dirname + '../../../' + 'uploads/' + imagePath), () => {})
}
