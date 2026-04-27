export function getApiErrorMessage(error, fallbackMessage = 'Something went wrong. Please try again.') {
  if (!error.response) {
    return 'Unable to reach the server. Check your connection and try again.';
  }

  const { status, data } = error.response;
  const serverMessage = typeof data?.message === 'string' ? data.message : '';

  if (serverMessage) {
    return serverMessage;
  }

  switch (status) {
    case 400:
      return fallbackMessage || 'The request data is invalid.';
    case 401:
      return 'You need to sign in to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This action conflicts with the current data. Refresh and try again.';
    default:
      return fallbackMessage;
  }
}
