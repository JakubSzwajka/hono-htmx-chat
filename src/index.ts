import { Hono } from 'hono'
import { serveStatic } from 'hono/bun';

const app = new Hono()

const messages: { user: string, message: string }[] = []

app.get('/', serveStatic({ path: './static/index.html' }))

app.get('/messages', (c) => {
  return c.html(messages.map(msg => `<p><strong>${msg.user}:</strong> ${msg.message}</p>`).join(''))
})

app.post('/message', async (c) => {
  const formData = await c.req.formData()
  const message = formData.get('message') as string
  messages.push({ user: 'user', message })
  
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Simple response logic
  const responseMessage = `Received your message: ${message}`
  messages.push({ user: 'Assistant', message: responseMessage })
  
  return c.html(`
    <p><strong>Assistant:</strong> ${responseMessage}</p>
  `)
})

export default app