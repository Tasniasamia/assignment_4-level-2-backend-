import app from './app'

const PORT = process.env.PORT || 5750

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})