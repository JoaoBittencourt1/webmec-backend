export function normalizeDocument(value: string): string {
  return value.replace(/\D/g, "");
}

export function isEmail(value: string): boolean {
  return value.includes("@");
}

export function clienteEmailFromDocument(documento: string): string {
  return `${documento}@cliente.webmec.local`;
}
