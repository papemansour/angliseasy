import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';

const AvailabilityScheduler = ({ apiClient }) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00'
  ];

  const [availability, setAvailability] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await apiClient.get('/teacher/my-availability');
      if (response.data && response.data.availability) {
        setAvailability(response.data.availability);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const toggleTimeSlot = (day, time) => {
    setAvailability(prev => {
      const daySlots = prev[day] || [];
      const isSelected = daySlots.includes(time);
      
      return {
        ...prev,
        [day]: isSelected 
          ? daySlots.filter(t => t !== time)
          : [...daySlots, time].sort()
      };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.post('/teacher/set-availability', {
        availability: availability
      });
      toast.success('Disponibilités enregistrées avec succès!');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement des disponibilités');
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (day, time) => {
    return (availability[day] || []).includes(time);
  };

  return (
    <Card className="border-teal-100">
      <CardHeader className="bg-teal-50">
        <CardTitle className="text-teal-800">Mes Horaires</CardTitle>
        <CardDescription>
          Sélectionnez vos créneaux disponibles (vert = disponible, rouge = indisponible)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50 text-left font-semibold">Horaire</th>
                {days.map((day, idx) => (
                  <th key={idx} className="border p-2 bg-gray-50 text-center font-semibold">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  <td className="border p-2 font-medium text-gray-700">{time}</td>
                  {dayKeys.map((dayKey, idx) => {
                    const selected = isSelected(dayKey, time);
                    return (
                      <td key={idx} className="border p-1">
                        <button
                          onClick={() => toggleTimeSlot(dayKey, time)}
                          className={`w-full h-10 rounded transition-colors ${
                            selected 
                              ? 'bg-green-500 hover:bg-green-600 text-white' 
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          {selected ? '✓' : '✗'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {loading ? 'Enregistrement...' : '💾 Enregistrer mes disponibilités'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityScheduler;
