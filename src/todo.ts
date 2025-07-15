export function todoImplement(prompt: string) {
  window.open(`/prompt?prefill=${encodeURIComponent(prompt)}`);
}
