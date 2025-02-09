// src/components/SignUp.tsx
import { useState } from 'react';

interface SignUpProps {
  onSignUp: (formData: FormData) => void; // Ubah untuk hanya satu argumen
}

const SignUp = ({ onSignUp }: SignUpProps) => {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = () => {
    if (username.trim() === '') {
      setError('Username cannot be empty!');
      return;
    }
    if (!profileImage) {
      setError('Profile image is required!');
      return;
    }
    setError(null);
  
    const formData = new FormData();
    formData.append('username', username);
    formData.append('profileImage', profileImage); 
    
    onSignUp(formData); 
  };
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; 
    setProfileImage(file);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-1/3 p-4 border rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Sign Up</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Tampilkan error jika ada */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="profileImage"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            accept="image/*" 
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignUp;
