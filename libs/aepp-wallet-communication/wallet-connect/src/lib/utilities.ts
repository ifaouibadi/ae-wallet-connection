export function getCachedWalletConnectSession(name = 'walletconnect') {
  const local = localStorage ? localStorage.getItem(name) : null;

  let session = null;
  if (local) {
    session = JSON.parse(local);
  }
  return session;
}

export function setCachedWalletConnectSession(
  name = 'walletconnect',
  data: any
) {
  return localStorage ? localStorage.setItem(name, JSON.stringify(data)) : null;
}
