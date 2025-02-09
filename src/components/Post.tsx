import React, { useEffect, useState } from 'react';
import Heart from '../assets/icons/heart.png';
import { User } from '../interfaces/User';
import { updateUserPoints, fetchUserPoints } from '../apis/UserCRUD';

interface PostProps {
  currentUser: User | null;
}

const Post: React.FC<PostProps> = ({ currentUser }) => {
  const [points, setPoints] = useState<number>(0);
  const [clickPower, setPower] = useState<number>(1);
  const [autoClickActive, setAutoClickActive] = useState<boolean>(false);
  const [scaled, setScaled] = useState<boolean>(false);
  const [power3Activated, setPower3Activated] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      fetchPointsFromDatabase();
    }
  }, [currentUser]);

  const fetchPointsFromDatabase = async () => {
    if (currentUser?.username) {
      try {
        const userData = await fetchUserPoints(currentUser.username);
        setPoints(userData.points);
        setPower(userData.clickPower);
        if (userData.power3Activated === true) {
          setAutoClickActive(!userData.autoClickActive);
        }
      } catch (error) {
        console.error('Error fetching user points:', error);
      }
    }
  };

  const updatePointsInDatabase = async (newPoints: number, newClickPower: number, autoClick: boolean, power3Activated: boolean) => {
    if (currentUser?.username) {
      try {
        await updateUserPoints(currentUser.username, newPoints, newClickPower, autoClick, power3Activated);
      } catch (error) {
        console.error('Error updating user points:', error);
      }
    }
  };

  const addLikes = () => {
    const newPoints = points + clickPower;
    setPoints(newPoints);
    updatePointsInDatabase(newPoints, clickPower, autoClickActive, power3Activated);
  };

  const handleClick = () => {
    addLikes();
    setScaled(true);
    setTimeout(() => setScaled(false), 100);
  };

  const power1 = () => {
    if (points >= 5) {
      const newPower = clickPower + 1;
      const newPoints = points - 5;

      setPower(newPower);
      setPoints(newPoints);
      updatePointsInDatabase(newPoints, newPower, autoClickActive, power3Activated);
    }
  };

  const power2 = () => {
    if (points >= 50) {
      const newPower = clickPower + 5;
      const newPoints = points - 50;

      setPower(newPower);
      setPoints(newPoints);
      updatePointsInDatabase(newPoints, newPower, autoClickActive, power3Activated);
    }
  };

  const power3 = async () => {
    if (!power3Activated && points >= 100) {
      const newPoints = points - 100;
      const newAutoClickActive = !autoClickActive;
      const newClickPower = clickPower + 1;
      const newPower3Activated = true;

      setPower(newClickPower);
      setPoints(newPoints);
      setAutoClickActive(newAutoClickActive);
      setPower3Activated(newPower3Activated);

      try {
        await updatePointsInDatabase(
          newPoints,
          newClickPower,
          newAutoClickActive,
          newPower3Activated
        );
      } catch (error) {
        console.error('Error updating database:', error);
      }
    }
  };

  useEffect(() => {
    let interval: any;
    if (autoClickActive) {
      interval = setInterval(() => {
        setPoints((prevPoints) => {
          const newPoints = prevPoints + 1;
          updatePointsInDatabase(newPoints, clickPower, autoClickActive, power3Activated);
          return newPoints;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoClickActive, clickPower]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-700 w-full flex flex-col items-center justify-center p-6 mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-7xl font-extrabold text-white mb-6">Heart Clicker</h1>
        <div className="inline-block bg-white/20 rounded-xl px-8 py-4">
          <span className="text-5xl font-bold text-white">{points} ❤️</span>
        </div>
      </div>

      <div className="flex flex-col items-center mb-12">
        <button 
          onClick={handleClick} 
          className="bg-pink-500 hover:bg-pink-600 rounded-full p-8 mb-6"
        >
          {/* <Heart size={96} className="text-white" fill="currentColor" /> */}
        </button>
        <div className="bg-white/10 rounded-lg px-6 py-3">
          <p className="text-2xl font-bold text-white">Power Level: +{clickPower}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <button
          onClick={power1}
          disabled={points < 5}
          className={`rounded-xl p-8 text-center ${
            points >= 5 
              ? 'bg-white hover:bg-blue-50' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <h2 className="text-3xl font-bold text-indigo-600 mb-3">Basic Power</h2>
          <p className="text-lg text-indigo-800 mb-2">+1 Heart per click</p>
          <p className={`text-lg font-semibold ${points >= 5 ? 'text-green-600' : 'text-red-500'}`}>
            Cost: 5 Hearts
          </p>
        </button>

        <button
          onClick={power2}
          disabled={points < 50}
          className={`rounded-xl p-8 text-center ${
            points >= 50 
              ? 'bg-white hover:bg-blue-50' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <h2 className="text-3xl font-bold text-indigo-600 mb-3">Super Power</h2>
          <p className="text-lg text-indigo-800 mb-2">+5 Hearts per click</p>
          <p className={`text-lg font-semibold ${points >= 50 ? 'text-green-600' : 'text-red-500'}`}>
            Cost: 50 Hearts
          </p>
        </button>

        <button
          onClick={power3}
          disabled={points < 100 || power3Activated}
          className={`rounded-xl p-8 text-center ${
            points >= 100 && !power3Activated
              ? 'bg-white hover:bg-blue-50' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <h2 className="text-3xl font-bold text-indigo-600 mb-3">Auto Clicker</h2>
          <p className="text-lg text-indigo-800 mb-2">+1 Heart every second</p>
          <p className={`text-lg font-semibold ${
            points >= 100 && !power3Activated ? 'text-green-600' : 'text-red-500'
          }`}>
            Cost: 100 Hearts
          </p>
        </button>
      </div>
    </div>
  );
};

export default Post;