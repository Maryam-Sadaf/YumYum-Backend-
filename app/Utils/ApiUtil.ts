export function Response(data: any) {
    return {
      status: 200,
      count: typeof data === 'object' ? 1 : data.length,
      data: data
    }
  }