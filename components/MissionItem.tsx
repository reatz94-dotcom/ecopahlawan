
import React from 'react';
import { Mission } from '../types';
import Button from './Button';

interface MissionItemProps {
  mission: Mission;
  onComplete: (id: string) => void;
  isLoading: boolean;
}

const MissionItem: React.FC<MissionItemProps> = ({ mission, onComplete, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-medium-gray mb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="mb-3 md:mb-0 md:mr-4 flex-grow">
        <h3 className="text-lg font-bold text-dark-blue">{mission.title}</h3>
        <p className="text-gray-600 text-sm">{mission.description}</p>
        <span className="inline-block bg-primary-green text-white text-xs font-semibold px-2 py-1 rounded-full mt-2">
          +{mission.points} Poin
        </span>
      </div>
      <div className="w-full md:w-auto">
        {mission.completed ? (
          <span className="text-primary-green font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Selesai!
          </span>
        ) : (
          <Button
            onClick={() => onComplete(mission.id)}
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            Selesaikan Misi
          </Button>
        )}
      </div>
    </div>
  );
};

export default MissionItem;
