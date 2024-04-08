export function Response(data: any) {
  return {
    status: 200,
    count: Array.isArray(data) ? data.length : 1,
    data: data
  }
}

export function toBoolean(status) {
  var value
  if (status === 'true') {
    value = true
  }
  else if (status === 'false') {
    value = false
  }
  return value
}

export function generateOrderNumber(order_id) {
  const timestamp = Date.now().toString(36)
  const orderNumber = `#${order_id}-${timestamp}`
  return orderNumber.toUpperCase();
}
