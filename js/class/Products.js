export class Products {

    async getProducts() {
        try {
            const response = await fetch('api/api.json');
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}