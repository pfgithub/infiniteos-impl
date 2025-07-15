export function todoImplement(prompt: string) {
  fetch(`/api/updateApp?prompt=${encodeURIComponent(prompt)}`)
    .then(res => {
      if (res.ok) {
        window.location.reload();
      } else {
        console.error('Failed to submit prompt:', res.status, res.statusText);
      }
    })
    .catch(err => {
      console.error('Error submitting prompt:', err);
    });
}
