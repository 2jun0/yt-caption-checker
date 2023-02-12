export class InvalidYouTubeVideoUrlError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidYouTubeVideoUrlError'
  }
}
