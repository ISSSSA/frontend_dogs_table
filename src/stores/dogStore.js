import { defineStore } from 'pinia';
import axios from 'axios';

export const useDogStore = defineStore('dogStore', {
  state: () => ({
    dogs: [],
    loading: false,
  }),
  actions: {
    async fetchDogs() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/dogs/');
        this.dogs = response.data;
      } catch (error) {
        console.error('Failed to fetch dogs:', error);
      } finally {
        this.loading = false;
      }
    },
    async addDog(dog) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/dogs/', dog);
        this.dogs.push(response.data);
      } catch (error) {
        console.error('Failed to add dog:', error);
      }
    },
    async updateDog(updatedDog) {
      try {
        await axios.put(`http://127.0.0.1:8000/api/dogs/${updatedDog.id}/`, updatedDog);
        const index = this.dogs.findIndex(dog => dog.id === updatedDog.id);
        if (index !== -1) {
          this.dogs[index] = updatedDog;
        }
      } catch (error) {
        console.error('Failed to update dog:', error);
      }
    },
    async deleteDog(id) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/dogs/${id}/`);
        this.dogs = this.dogs.filter(dog => dog.id !== id);
      } catch (error) {
        console.error('Failed to delete dog:', error);
      }
    },
  },
});
