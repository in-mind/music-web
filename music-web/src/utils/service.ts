
export function FetchData(url: string, method: string) {

  return fetch(url, {method: method}).then((res) => {return res.json()})

}