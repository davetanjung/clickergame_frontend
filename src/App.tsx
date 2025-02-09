// src/App.tsx
import { useEffect, useState } from 'react';
import Post from './components/Post';
import SignUp from './components/SignUp';
// import { Heart } from 'lucide-react';
import { getUserByUsername, createUser, deleteUser } from './apis/UserCRUD';
import { User } from './interfaces/User';

enum Menu {
  Post = 'Post',
  SignUp = 'SignUp',
}

const App = () => {
  const [menu, setMenu] = useState<Menu>(Menu.Post);
  const [currentUsername, setCurrentUsername] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSignedUp, setIsSignedUp] = useState(true);

  const fetchCurrentUser = async (username: string) => {
    try {
      const response = await getUserByUsername(username);
      if (response.status === 200 && response.data) {
        setCurrentUser(response.data);
        setError(null);
        return true;
      } else {
        setError('User does not exist. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('An error occurred. Please try again.');
      return false;
    }
  };

  const handleLoginSubmitButton = async () => {
    if (currentUsername.trim() === '') {
      setError('Username cannot be empty!');
      return;
    }

    const userExists = await fetchCurrentUser(currentUsername);

    if (userExists) {
      setIsLogin(!isLogin);
      setError(null);
    }
  };

  const handleSignUp = async (formData: FormData) => {
    try {
      const response = await createUser(formData); 
      if (response.status === 201) {
        setIsSignedUp(true);
        setCurrentUsername(formData.get('username') as string); 
        setIsLogin(true);
        setError(null);
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Sign-up failed. Please try again.');
    }
  };
  
  const handleNotSignedUpButton = async () => {
    setIsSignedUp(!isSignedUp)
  }

  const handleButtonDeleteUser = async (username: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this account?")
    if (!confirmed) return

    try {
      console.log("Delete user: ", username)
      const response = await deleteUser(username)

      if (response.status === 200 || response.status === 204) {
        alert("User deleted successfully.")
        setIsLogin(!isLogin)
        setCurrentUser(null)
      }
    } catch (error) {
      console.error('Error Deleting:', error)
      setError('Delete failed. Please try again.')
    }
  }

  useEffect(() => {
    if (currentUsername) {
      fetchCurrentUser(currentUsername);
    }
  }, [currentUsername]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-400">
      {isLogin ? (
        <>
          <div className="w-full flex flex-row justify-end px-8 py-4 bg-white/10">
            <div className="flex items-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleButtonDeleteUser(currentUsername)}
              >
                Delete Account
              </button>
              <span className="text-2xl font-bold text-white">{currentUser?.username}</span>
              {currentUser?.profileImage ? (
                <img
                  src={`http://localhost:3000/uploads/${currentUser.profileImage}`}
                  alt="User Profile"
                  className="h-16 w-16 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  {/* <Heart className="h-8 w-8 text-white" /> */}
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex">
            {menu === Menu.Post && <Post currentUser={currentUser} />}
          </div>
        </>
      ) : isSignedUp ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back!</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={currentUsername}
                onChange={(e) => setCurrentUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline ${
                  !currentUsername.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleLoginSubmitButton}
                disabled={!currentUsername.trim()}
              >
                Login
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleNotSignedUpButton}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      ) : (
        <SignUp onSignUp={handleSignUp} />
      )}
    </div>
  );
};

export default App;