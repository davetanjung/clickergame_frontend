import axios from "axios"

const getAllUsers = async () => {
  return axios.get('http://localhost:3000/users')
}

const getUserByUsername = async (username: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/users/${username}`);
    return response;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// const createUser = async (username: string, points = 0, clickPower = 1, autoClickActive = false, profileImage = "") => {
//   return axios.post('http://localhost:3000/users', {
//     username,
//     points,
//     clickPower,
//     autoClickActive,
//     profileImage
//   })
// }

const createUser = async (formData: FormData) => {
  const response = await axios.post('http://localhost:3000/users', formData);
  return response.data;
};

const deleteUser = async (username: string) => {
  return axios.delete(`http://localhost:3000/users/${username}`)
}

const fetchUserPoints = async (username: String) => {
  const response = await axios.get(`http://localhost:3000/users/${username}`);
  return response.data;
};

const updateUserPoints = async (username: String, points: number, clickPower: number, autoClickActive: boolean, power3Activated: boolean) => {

  const response = await axios.put(`http://localhost:3000/users/`, {
    username,
    points,
    clickPower,
    autoClickActive,
    power3Activated
  });

  return response.data
};




export { getAllUsers, createUser, getUserByUsername, updateUserPoints, fetchUserPoints, deleteUser }