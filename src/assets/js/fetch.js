class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

export default async (url) => {
	let response = await fetch(url);
	if (response.ok) {
		return await response.json();
	}
	throw new HttpError(response);
}
