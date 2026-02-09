
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import MissionItem from '../components/MissionItem';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { INITIAL_MISSIONS } from '../constants';
import { Mission } from '../types';
import { getMissionFeedbackFromGemini, ensureApiKeySelected } from '../services/geminiService';

const MissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);
  const [completedMissionFeedback, setCompletedMissionFeedback] = useState<{ [key: string]: string }>({});

  const handleMissionComplete = async (id: string) => {
    setIsLoadingFeedback(true);
    const isKeySelected = await ensureApiKeySelected();
    if (!isKeySelected) {
      alert('Gagal menyelesaikan misi. Harap pilih kunci API Anda.');
      setIsLoadingFeedback(false);
      return;
    }

    setMissions((prevMissions) =>
      prevMissions.map((mission) => (mission.id === id ? { ...mission, completed: true } : mission))
    );

    const completedMission = missions.find((m) => m.id === id);
    if (completedMission) {
      const promptDescription = `Saya telah menyelesaikan misi "${completedMission.title}" dengan melakukan: ${completedMission.description.toLowerCase()}`;
      try {
        const feedback = await getMissionFeedbackFromGemini(completedMission.title, promptDescription);
        setCompletedMissionFeedback((prev) => ({ ...prev, [id]: feedback }));
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setCompletedMissionFeedback((prev) => ({ ...prev, [id]: 'Terima kasih telah menyelesaikan misi! Terus semangat!' }));
      } finally {
        setIsLoadingFeedback(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-dark-blue text-center mb-8">
        Misi EcoPahlawan
      </h2>

      <Card>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Selesaikan misi-misi di bawah ini untuk mendapatkan poin dan lencana.
          Setiap misi yang kamu selesaikan akan membantumu menjadi pejuang lingkungan yang lebih baik!
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {missions.map((mission) => (
          <div key={mission.id}>
            <MissionItem
              mission={mission}
              onComplete={handleMissionComplete}
              isLoading={isLoadingFeedback}
            />
            {mission.completed && completedMissionFeedback[mission.id] && (
              <div className="bg-light-green border border-primary-green text-dark-blue p-3 rounded-lg text-sm mt-2">
                <p className="font-semibold mb-1">Umpan Balik Gemini:</p>
                <p>{completedMissionFeedback[mission.id]}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {isLoadingFeedback && (
        <div className="text-center mt-6">
          <LoadingSpinner />
          <p className="text-gray-600 mt-2">Mengambil umpan balik dari Gemini...</p>
        </div>
      )}

      <Card className="text-center mt-8">
        <h3 className="text-xl font-bold text-dark-blue mb-3">Mulai Petualanganmu!</h3>
        <p className="text-gray-700 mb-4">
          Setiap tindakan kecil memiliki dampak besar. Pilih misimu dan mulai buat perubahan!
        </p>
        <Button onClick={() => alert('Fitur ini akan segera hadir: Misi baru!')} variant="secondary">
          Cari Misi Baru
        </Button>
      </Card>
    </div>
  );
};

export default MissionsPage;
