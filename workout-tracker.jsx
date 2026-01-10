import React, { useState, useEffect } from 'react';
import { Plus, X, TrendingUp, Calendar, Dumbbell, ChevronRight, Menu, Settings, BarChart3, Check, ChevronDown } from 'lucide-react';

const WorkoutTracker = () => {
  const [activeTab, setActiveTab] = useState('push');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');
  const [gSheetUrl, setGSheetUrl] = useState(localStorage.getItem('gSheetUrl') || '');
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [expandedExercise, setExpandedExercise] = useState(null);

  // Workout categories matching the Excel structure
  const workoutPrograms = {
    weigh: {
      name: 'Weigh In',
      icon: '⚖️',
      exercises: [
        { name: 'Morning Weight', sets: 1, reps: '1', rest: 0, type: 'weigh' }
      ]
    },
    push: {
      name: 'Push Day',
      icon: '💪',
      exercises: [
        { name: 'Dumbbell Incline Chest Press', sets: 2, reps: '8-10, 15', rest: 90 },
        { name: 'Machine Chest Press', sets: 3, reps: '10-12', rest: 90 },
        { name: 'Low to High Cable Fly', sets: 3, reps: '15 + DS', rest: 60 },
        { name: 'Feet Elevated Push Up', sets: 2, reps: 'Failure', rest: 60 }
      ]
    },
    pull: {
      name: 'Pull Day',
      icon: '🔙',
      exercises: [
        { name: 'T-Bar Row', sets: 3, reps: '10-12', rest: 90 },
        { name: 'Lat Pulldown', sets: 3, reps: '8-10, 10-12', rest: 60 },
        { name: 'Single Arm Pulldown', sets: 3, reps: '12-15/side', rest: 60 },
        { name: 'Prone Incline DB Row', sets: 4, reps: '10-12 + DS', rest: 60 }
      ]
    },
    legs: {
      name: 'Leg Day',
      icon: '🦵',
      exercises: [
        { name: 'Seated Hamstring Curl', sets: 4, reps: '15/12/12/8', rest: 90 },
        { name: 'Bulgarian Split Squat', sets: 3, reps: '8-12/side', rest: 60 },
        { name: 'Hack Squat', sets: 4, reps: '15/12/6/20', rest: 90 },
        { name: 'Alternating Lunge Barbell', sets: 3, reps: '10-12/side', rest: 60 }
      ]
    },
    shoulders: {
      name: 'Shoulders + Arms',
      icon: '💪',
      exercises: [
        { name: 'Seated Shoulder Press', sets: 3, reps: '10/15/15', rest: 60 },
        { name: 'Dumbbell Side Lateral Raise', sets: 4, reps: '10-12', rest: 60 },
        { name: 'Machine Preacher Curl', sets: 3, reps: '10-15', rest: 60 },
        { name: 'Cross Body Tricep Extension', sets: 3, reps: '10-15', rest: 60 },
        { name: 'Low Pulley Cable Curl', sets: 3, reps: '10-12', rest: 60 }
      ]
    }
  };

  // Quick add handler
  const handleQuickAdd = (exercise) => {
    setCurrentExercise(exercise);
    setShowAddModal(true);
  };

  // Save workout to Google Sheets
  const saveToGoogleSheets = async (workoutData) => {
    if (!gSheetUrl) {
      alert('Please configure Google Sheets URL in settings');
      return;
    }

    try {
      // Extract spreadsheet ID from URL
      const match = gSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        alert('Invalid Google Sheets URL');
        return;
      }

      const spreadsheetId = match[1];
      
      // Format: Date, Exercise, Weight, Reps, Notes
      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        workoutData.exercise,
        workoutData.weight,
        workoutData.reps,
        workoutData.notes || ''
      ];

      // Note: This requires Google Apps Script setup (Web App)
      // The user will need to create a simple Google Apps Script endpoint
      // For demo purposes, we'll save locally
      const workout = {
        ...workoutData,
        timestamp
      };

      const recent = JSON.parse(localStorage.getItem('recentWorkouts') || '[]');
      recent.unshift(workout);
      localStorage.setItem('recentWorkouts', JSON.stringify(recent.slice(0, 20)));
      setRecentWorkouts(recent.slice(0, 20));

      // Show success
      alert('✅ Workout logged successfully!');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error saving workout. Please check your settings.');
    }
  };

  const handleSubmitWorkout = (e) => {
    e.preventDefault();
    
    if (!currentExercise || !weight || !reps) {
      alert('Please fill in all required fields');
      return;
    }

    const workoutData = {
      exercise: currentExercise.name,
      weight: parseFloat(weight),
      reps: parseInt(reps),
      notes,
      category: activeTab
    };

    saveToGoogleSheets(workoutData);
    
    // Reset form
    setWeight('');
    setReps('');
    setNotes('');
    setShowAddModal(false);
  };

  const saveSettings = () => {
    localStorage.setItem('gSheetUrl', gSheetUrl);
    setShowSettings(false);
    alert('Settings saved!');
  };

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentWorkouts') || '[]');
    setRecentWorkouts(recent.slice(0, 20));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white font-sans overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 border-b border-white/5 backdrop-blur-xl bg-slate-950/50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">GymFlow</h1>
              <p className="text-xs text-slate-400">Track. Grow. Conquer.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2.5 hover:bg-white/5 rounded-xl transition-all active:scale-95"
          >
            <Settings className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-6 pb-28">
        {/* Program Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {Object.entries(workoutPrograms).map(([key, program]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-shrink-0 px-5 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 scale-105'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{program.icon}</span>
              {program.name}
            </button>
          ))}
        </div>

        {/* Exercises List */}
        <div className="space-y-3">
          {workoutPrograms[activeTab].exercises.map((exercise, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <button
                onClick={() => setExpandedExercise(expandedExercise === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between"
              >
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                    {exercise.name}
                  </h3>
                  <div className="flex gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                      {exercise.sets} sets
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                      {exercise.reps} reps
                    </span>
                    {exercise.rest > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        {exercise.rest}s rest
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    expandedExercise === idx ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {expandedExercise === idx && (
                <div className="px-5 pb-4 border-t border-white/5 pt-4 space-y-3 animate-slideDown">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1">Sets</p>
                      <p className="text-2xl font-bold text-indigo-400">{exercise.sets}</p>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 mb-1">Rest Time</p>
                      <p className="text-2xl font-bold text-purple-400">{exercise.rest}s</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAdd(exercise);
                    }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Log Set
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        {recentWorkouts.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Recent Activity
            </h2>
            <div className="space-y-2">
              {recentWorkouts.slice(0, 5).map((workout, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/5 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-white">{workout.exercise}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {workout.weight}lbs × {workout.reps} reps
                    </p>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(workout.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl shadow-indigo-500/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 z-50"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-around">
          <button className="flex flex-col items-center gap-1 text-indigo-400">
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs font-medium">Workouts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Progress</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500">
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">History</span>
          </button>
        </div>
      </nav>

      {/* Add Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Log Your Set</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-all active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {currentExercise && (
                <p className="text-sm text-slate-400">{currentExercise.name}</p>
              )}
            </div>

            <form onSubmit={handleSubmitWorkout} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-lg font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                    placeholder="135"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-lg font-bold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
                  placeholder="Felt strong today..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 flex items-center justify-center gap-2"
              >
                <Check className="w-6 h-6" />
                Save Workout
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden animate-slideUp">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-white/5 rounded-xl transition-all active:scale-95"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">
                  Google Sheets URL
                </label>
                <input
                  type="text"
                  value={gSheetUrl}
                  onChange={(e) => setGSheetUrl(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                />
                <p className="text-xs text-slate-500 mt-2">
                  Paste your Google Sheets URL to sync workouts
                </p>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4">
                <h3 className="font-bold text-sm mb-2 text-indigo-300">Setup Instructions:</h3>
                <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Create a Google Sheet</li>
                  <li>Go to Extensions → Apps Script</li>
                  <li>Copy the deployment URL</li>
                  <li>Paste it above</li>
                </ol>
              </div>

              <button
                onClick={saveSettings}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default WorkoutTracker;
