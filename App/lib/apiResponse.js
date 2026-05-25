export function success(data = null, message = "Success", status = 200) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function error(message = "Something went wrong", status = 400) {
  return Response.json(
    {
      success: false,
      message,
    },
    { status }
  );
}