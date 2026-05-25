export function validateLeadInput(body) {
  const { name, phone, city, serviceType, description } = body;

  if (!name || !phone || !city || !serviceType || !description) {
    return "All fields are required";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    return "Phone number must be 10 digits";
  }

  if (!["SERVICE_1", "SERVICE_2", "SERVICE_3"].includes(serviceType)) {
    return "Invalid service type";
  }

  if (description.trim().length < 5) {
    return "Description must be at least 5 characters";
  }

  return null;
}