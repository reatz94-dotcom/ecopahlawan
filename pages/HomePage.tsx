
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { generateContentFromGemini, ensureApiKeySelected } from '../services/geminiService';
import { UserProfile } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const [dailyTip, setDailyTip] = useState<string>('Selamat datang, Pejuang Lingkungan!');
  const [isLoadingTip, setIsLoadingTip] = useState<boolean>(false);
  // Mock user profile data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'EcoFriend',
    points: 120,
    completedMissions: 2,
    badges: ['Penyelamat Sampah', 'Penjaga Air'],
  });

  const fetchDailyTip = async () => {
    setIsLoadingTip(true);
    const isKeySelected = await ensureApiKeySelected();
    if (!isKeySelected) {
      setDailyTip('Gagal memuat tips harian. Harap pilih kunci API Anda.');
      setIsLoadingTip(false);
      return;
    }

    try {
      const prompt = `Berikan satu tips harian singkat dan inspiratif (maksimal 50 kata) tentang cara berkontribusi pada pelestarian lingkungan bagi seorang siswa. Gunakan bahasa Indonesia.`;
      const tip = await generateContentFromGemini(prompt);
      setDailyTip(tip);
    } catch (error) {
      console.error('Failed to fetch daily tip:', error);
      setDailyTip('Gagal memuat tips harian. Coba lagi nanti.');
    } finally {
      setIsLoadingTip(false);
    }
  };

  // Fetch daily tip on component mount
  useEffect(() => {
    fetchDailyTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-dark-blue text-center mb-8">
        Selamat Datang, {userProfile.name}!
      </h2>

      <Card>
        <h3 className="text-xl font-bold text-primary-green mb-3">Tips Lingkungan Harian</h3>
        {isLoadingTip ? (
          <LoadingSpinner />
        ) : (
          <p className="text-gray-700 leading-relaxed italic">{dailyTip}</p>
        )}
        <Button onClick={fetchDailyTip} disabled={isLoadingTip} className="mt-4">
          Segarkan Tips
        </Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <p className="text-5xl font-extrabold text-primary-green">{userProfile.points}</p>
          <p className="text-gray-600 text-lg">Total Poin</p>
        </Card>
        <Card className="text-center">
          <p className="text-5xl font-extrabold text-primary-green">{userProfile.completedMissions}</p>
          <p className="text-gray-600 text-lg">Misi Selesai</p>
        </Card>
        <Card className="text-center col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-bold text-primary-green mb-3">Lencana Anda</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {userProfile.badges.length > 0 ? (
              userProfile.badges.map((badge, index) => (
                <span
                  key={index}
                  className="bg-light-green text-primary-green text-sm font-medium px-3 py-1 rounded-full shadow-sm"
                >
                  {badge}
                </span>
              ))
            ) : (
              <p className="text-gray-500">Belum ada lencana. Selesaikan misi untuk mendapatkannya!</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-xl font-bold text-dark-blue mb-3">Apa itu EcoPahlawan?</h3>
        <p className="text-gray-700 leading-relaxed">
          EcoPahlawan adalah teman digitalmu dalam perjalanan menjadi pelindung lingkungan.
          Di sini, kamu bisa belajar tentang isu-isu lingkungan, menyelesaikan misi yang
          berdampak nyata, dan melihat bagaimana kontribusimu membantu bumi kita.
          Bersama-sama, kita bisa membuat perbedaan!
        </p>
      </Card>
    </div>
  );
};

export default HomePage;
