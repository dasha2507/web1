export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  console.log('Дані, які прийшли з форми:', body)

  return {
    success: true,
    message: `Thank you, ${body.fullName || 'User'}! Your subscription for ${body.planTitle || 'the plan'} has been successfully processed.`
  }
})
