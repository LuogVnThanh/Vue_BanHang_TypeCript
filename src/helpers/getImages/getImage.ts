// http://127.0.0.1:8000/storage/ 
export function getProductImage(value:string) { 
    const defaultImage = "https://bulma.io/assets/images/placeholders/1280x960.png"
    const baseUrl = 'http://localhost:8000/storage/'
    return value? baseUrl + value: defaultImage;
}