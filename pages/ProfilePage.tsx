
import React from 'react';
import Card from '../components/Card';
import { UserProfile, Mission } from '../types';
import { INITIAL_MISSIONS } from '../constants';

const ProfilePage: React.FC = () => {
  // Mock user data for the profile page
  const userProfile: UserProfile = {
    name: 'EcoFriend',
    points: INITIAL_MISSIONS.filter(m => m.completed).reduce((sum, m) => sum + m.points, 0) + 120, // Add some initial mock points
    completedMissions: INITIAL_MISSIONS.filter(m => m.completed).length + 2, // Add some initial mock completed missions
    badges: ['Penyelamat Sampah', 'Penjaga Air', 'Pecinta Tanaman', 'Penghemat Energi'], // Example badges
  };

  const calculateProgress = (current: number, total: number) => {
    if (total === 0) return 0;
    return Math.min(100, Math.round((current / total) * 100));
  };

  const totalPossibleMissions = INITIAL_MISSIONS.length + 5; // Assuming more missions will be added
  const totalPossiblePoints = INITIAL_MISSIONS.reduce((sum, m) => sum + m.points, 0) + 500; // Assuming more points will be added

  const missionsProgress = calculateProgress(userProfile.completedMissions, totalPossibleMissions);
  const pointsProgress = calculateProgress(userProfile.points, totalPossiblePoints);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-dark-blue text-center mb-8">
        Profil EcoPahlawan {userProfile.name}
      </h2>

      <Card>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="text-center">
            <img
              src="https://picsum.photos/150/150?random=profile"
              alt="Profil Pengguna"
              className="rounded-full w-24 h-24 object-cover mx-auto mb-3 border-4 border-primary-green shadow-lg"
            />
            <h3 className="text-2xl font-bold text-dark-blue">{userProfile.name}</h3>
            <p className="text-gray-600">Level 5 - Pejuang Lingkungan Sejati</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xl font-semibold text-primary-green">Total Poin: {userProfile.points}</p>
            <p className="text-xl font-semibold text-dark-blue">Misi Selesai: {userProfile.completedMissions}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-dark-blue mb-4">Progres Anda</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700">Misi Selesai ({userProfile.completedMissions}/{totalPossibleMissions})</span>
              <span className="font-semibold text-primary-green">{missionsProgress}%</span>
            </div>
            <div className="w-full bg-light-gray rounded-full h-3">
              <div
                className="bg-primary-green h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${missionsProgress}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700">Poin Terkumpul ({userProfile.points}/{totalPossiblePoints})</span>
              <span className="font-semibold text-primary-green">{pointsProgress}%</span>
            </div>
            <div className="w-full bg-light-gray rounded-full h-3">
              <div
                className="bg-primary-green h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${pointsProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-xl font-bold text-dark-blue mb-4">Lencana yang Anda Dapatkan</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {userProfile.badges.length > 0 ? (
            userProfile.badges.map((badge, index) => (
              <div
                key={index}
                className="bg-light-green text-primary-green p-4 rounded-lg shadow-sm flex flex-col items-center min-w-[100px]"
              >
                <img
                  src={`https://picsum.photos/60/60?random=badge${index}`}
                  alt={badge}
                  className="mb-2 rounded-full"
                />
                <span className="text-sm font-semibold text-center">{badge}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada lencana. Selesaikan lebih banyak misi!</p>
          )}
        </div>
      </Card>

      <Card className="text-center mt-8 bg-primary-green text-white">
        <h3 className="text-2xl font-bold mb-3">Teruslah Berjuang!</h3>
        <p className="text-lg leading-relaxed">
          Setiap tindakanmu berarti bagi bumi. Jangan pernah berhenti menjadi EcoPahlawan!
        </p>
      </Card>
    </div>
  );
};

export default ProfilePage;
