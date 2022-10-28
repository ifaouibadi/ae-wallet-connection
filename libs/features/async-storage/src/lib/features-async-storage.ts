export async function getStorageValue(name: string) {
  const local = localStorage ? localStorage.getItem(name) : null;

  let session = null;
  if (local) {
    session = JSON.parse(local);
  }
  return session;
}

export async function setStorageValue(name: string, data: any) {
  return localStorage ? localStorage.setItem(name, JSON.stringify(data)) : null;
}
