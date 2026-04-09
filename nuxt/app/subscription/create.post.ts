export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('Отримані дані форми:', body)

  return {
    success: true,
    message: `Thank you, ${body.fullName}! Your subscription has been created.`
  }
})
